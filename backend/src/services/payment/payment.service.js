const paymentRepository = require("../../data-access/payment.repository");
const bookingRepository = require("../../data-access/booking.repository");
const userRepository = require("../../data-access/user.repository");
const paytechService = require("./paytech.service");
const { AppError, ERROR_MESSAGES } = require("../../utils/errors");
const logger = require("../../utils/logger");
const Payment = require("../../models/Payment");
const Booking = require("../../models/Booking");
const notificationService = require("../notification/notification.service");
const { NOTIFICATION_TYPES } = require("../../config/constants");

/**
 * Service pour les opérations sur les paiements
 */
class PaymentService {
	/**
	 * Initialiser un paiement pour une réservation
	 */
	async initiatePayment(userId, bookingId, phoneNumber, options = {}) {
		// Vérifier que la réservation existe
		const booking = await bookingRepository.findById(bookingId);
		if (!booking) {
			throw new AppError("Réservation non trouvée", 404);
		}

		// Vérifier que l'utilisateur est le propriétaire de la réservation
		if (booking.userId !== userId) {
			throw new AppError(
				"Vous n'êtes pas autorisé à payer cette réservation",
				403
			);
		}

		// Vérifier que la réservation est en attente ou confirmée
		if (
			![Booking.STATUS.PENDING, Booking.STATUS.CONFIRMED].includes(
				booking.status
			)
		) {
			throw new AppError("Cette réservation ne peut pas être payée", 400);
		}

		// Vérifier si un paiement existe déjà
		let payment = await paymentRepository.findByBookingId(bookingId);

		if (payment && payment.status === Payment.STATUS.SUCCESS) {
			throw new AppError("Cette réservation a déjà été payée", 400);
		}

		// Si un paiement en attente existe, le réutiliser
		if (!payment) {
			payment = await paymentRepository.create({
				bookingId,
				userId: booking.userId,
				providerId: booking.providerId,
				amount: booking.totalPrice,
				paymentMethod: Payment.METHOD.PAYTECH,
				status: Payment.STATUS.PENDING,
			});
		}

		// Récupérer les infos de l'utilisateur pour le pré-remplissage
		const user = await userRepository.findById(userId);

		// Initialiser le paiement PayTech
		const paytechResponse = await paytechService.initiatePayment({
			amount: booking.totalPrice,
			phoneNumber,
			fullName: user ? `${user.firstName} ${user.lastName}` : undefined,
			description: `Paiement réservation ${bookingId}`,
			bookingId,
			userId,
			successUrl: options.successUrl,
			cancelUrl: options.cancelUrl,
		});

		// Mettre à jour le paiement avec l'ID de transaction PayTech
		payment = await paymentRepository.updateById(payment.id, {
			transactionId: paytechResponse.transaction_id || paytechResponse.token,
			paytechTransactionId:
				paytechResponse.transaction_id || paytechResponse.token,
			metadata: {
				paytech_response: paytechResponse,
				phoneNumber,
			},
		});

		return {
			payment,
			paytech: {
				transaction_id: paytechResponse.transaction_id,
				payment_url: paytechResponse.payment_url,
				token: paytechResponse.token,
				simulated: paytechResponse.simulated,
			},
		};
	}

	/**
	 * Traiter un webhook PayTech
	 */
	async handleWebhook(webhookData) {
		try {
			// Vérifier la signature
			const isValid = paytechService.verifyWebhookSignature(webhookData);
			if (!isValid) {
				logger.warn("Signature webhook PayTech invalide", { webhookData });
				throw new AppError("Signature webhook invalide", 401);
			}

			const {
				token,
				transaction_id,
				status,
				amount,
				custom_field,
				ref_command,
			} = webhookData;

			logger.info(
				`Webhook PayTech reçu: ${
					token || transaction_id
				} (${status}) pour la commande ${ref_command}`
			);

			const transactionId = token || transaction_id;
			let payment = null;

			if (transactionId) {
				payment = await paymentRepository.findByTransactionId(transactionId);
			}

			// Fallback sur ref_command ou custom_field si non trouvé par token
			if (!payment && (ref_command || custom_field)) {
				let bookingId = ref_command;
				if (!bookingId && custom_field) {
					try {
						const custom = JSON.parse(custom_field);
						bookingId = custom.bookingId;
					} catch (e) {
						logger.warn("Erreur parsing custom_field webhook:", e);
					}
				}

				if (bookingId) {
					logger.info(`Recherche de paiement par bookingId: ${bookingId}`);
					payment = await paymentRepository.findByBookingId(bookingId);
				}
			}

			if (!payment) {
				logger.warn(
					`Paiement non trouvé pour webhook. Token: ${transactionId}, Ref: ${ref_command}`
				);
				// Créer un paiement s'il n'existe pas encore (sécurité)
				// Ou lever une erreur
				throw new AppError("Paiement non trouvé", 404);
			}

			// Mettre à jour le statut du paiement
			let paymentStatus = Payment.STATUS.PENDING;
			if (status === "success" || status === "completed") {
				paymentStatus = Payment.STATUS.SUCCESS;
			} else if (status === "failed" || status === "cancelled") {
				paymentStatus = Payment.STATUS.FAILED;
			}

			// Mettre à jour le paiement
			let isPaid =
				status === "success" ||
				status === "completed" ||
				paymentStatus === "success";

			const updateFields = {
				status: isPaid ? "success" : paymentStatus,
				paymentDate: isPaid ? new Date() : payment.paymentDate || null,
				metadata: {
					...(payment.metadata || {}),
					webhook_data: webhookData,
					webhook_received_at: new Date(),
				},
			};

			logger.info(
				`Mise à jour paiement ${payment.id}: ${JSON.stringify(updateFields)}`
			);
			await paymentRepository.updateById(payment.id, updateFields);

			// Si le paiement est réussi, mettre à jour le statut de la réservation
			if (paymentStatus === Payment.STATUS.SUCCESS) {
				const booking = await bookingRepository.findById(payment.bookingId);
				if (booking && booking.status === Booking.STATUS.PENDING) {
					await bookingRepository.updateById(booking.id, {
						status: Booking.STATUS.CONFIRMED,
					});
					logger.info(
						`Réservation ${booking.id} confirmée après paiement réussi`
					);
				}

				// Notifications paiement réussi
				try {
					await notificationService.createNotification(
						payment.userId,
						NOTIFICATION_TYPES.PAYMENT,
						"Paiement réussi",
						`Votre paiement pour la réservation ${payment.bookingId} a été confirmé.`,
						{ paymentId: payment.id, bookingId: payment.bookingId, amount }
					);

					await notificationService.createNotification(
						payment.providerId,
						NOTIFICATION_TYPES.PAYMENT,
						"Paiement reçu",
						"Un paiement a été confirmé pour l'une de vos réservations.",
						{ paymentId: payment.id, bookingId: payment.bookingId, amount }
					);
				} catch (notifyError) {
					logger.warn("Erreur notification paiement réussi:", notifyError);
				}
			}

			logger.info(
				`Webhook PayTech traité: ${transactionId}, statut: ${paymentStatus}`
			);

			return {
				success: true,
				payment: await paymentRepository.findById(payment.id),
			};
		} catch (error) {
			logger.error("Erreur traitement webhook PayTech:", error);
			throw error;
		}
	}

	/**
	 * Obtenir un paiement par ID
	 */
	async getPaymentById(paymentId) {
		const payment = await paymentRepository.findById(paymentId);
		if (!payment) {
			throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
		}
		return payment;
	}

	/**
	 * Obtenir tous les paiements avec filtres
	 */
	async getAllPayments(options = {}) {
		const { count, rows } = await paymentRepository.findAll(options);

		return {
			payments: rows,
			pagination: {
				page: parseInt(options.page || 1),
				limit: parseInt(options.limit || 20),
				total: count,
				totalPages: Math.ceil(count / (options.limit || 20)),
			},
		};
	}

	/**
	 * Vérifier le statut d'un paiement
	 */
	async checkPaymentStatus(paymentId) {
		const payment = await paymentRepository.findById(paymentId);
		if (!payment) {
			throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
		}
		return this._verifyAndUpdateStatus(payment);
	}

	/**
	 * Vérifier le statut d'un paiement via l'ID de réservation
	 */
	async checkPaymentStatusByBookingId(bookingId) {
		const payment = await paymentRepository.findByBookingId(bookingId);
		if (!payment) {
			throw new AppError("Aucun paiement trouvé pour cette réservation", 404);
		}
		return this._verifyAndUpdateStatus(payment);
	}

	/**
	 * Logique interne de vérification et mise à jour du statut
	 * @private
	 */
	async _verifyAndUpdateStatus(payment) {
		// Si le paiement est déjà en succès, retourner directement
		if (payment.status === Payment.STATUS.SUCCESS) {
			return payment;
		}

		// Vérifier auprès de PayTech si transaction ID existe
		if (payment.paytechTransactionId) {
			try {
				const paytechStatus = await paytechService.verifyPayment(
					payment.paytechTransactionId
				);

				// Mettre à jour si le statut a changé
				if (paytechStatus.status !== payment.status) {
					let newStatus = Payment.STATUS.PENDING;
					if (
						paytechStatus.status === "success" ||
						paytechStatus.status === "completed"
					) {
						newStatus = Payment.STATUS.SUCCESS;
					} else if (
						paytechStatus.status === "failed" ||
						paytechStatus.status === "cancelled"
					) {
						newStatus = Payment.STATUS.FAILED;
					}

					if (newStatus !== payment.status) {
						let isPaid = newStatus === "success" || newStatus === "completed";
						logger.info(
							`Verification: Mise à jour paiement ${
								payment.id
							} status=${newStatus}, paymentDate=${isPaid ? "NOW" : "STAY"}`
						);

						const updatedPayment = await paymentRepository.updateById(
							payment.id,
							{
								status: newStatus,
								paymentDate: isPaid ? new Date() : payment.paymentDate || null,
							}
						);

						// Si succès, confirmer aussi la réservation
						if (newStatus === Payment.STATUS.SUCCESS) {
							const booking = await bookingRepository.findById(
								payment.bookingId
							);
							if (booking && booking.status === Booking.STATUS.PENDING) {
								await bookingRepository.updateById(booking.id, {
									status: Booking.STATUS.CONFIRMED,
								});
							}
						}

						return updatedPayment;
					}
				}
			} catch (error) {
				logger.warn("Erreur vérification statut PayTech:", error);
			}
		}

		return payment;
	}
}

module.exports = new PaymentService();
