const bookingRepository = require("../../data-access/booking.repository");
const serviceRepository = require("../../data-access/service.repository");
const providerRepository = require("../../data-access/provider.repository");
const { AppError, ERROR_MESSAGES } = require("../../utils/errors");
const logger = require("../../utils/logger");
const Booking = require("../../models/Booking");
const notificationService = require("../notification/notification.service");
const { NOTIFICATION_TYPES, PAGINATION } = require("../../config/constants");

/**
 * Service pour les opérations sur les réservations
 */
class BookingService {
	/**
	 * Créer une réservation avec vérification de disponibilité
	 */
	async createBooking(userId, bookingData) {
		const {
			serviceId,
			bookingDate,
			startTime,
			endTime,
			duration,
			latitude,
			longitude,
			notes,
		} = bookingData;

		// Vérifier que le service existe
		const service = await serviceRepository.findById(serviceId);
		if (!service) {
			throw new AppError("Service non trouvé", 404);
		}

		// Vérifier que le service est disponible
		if (!service.availability) {
			throw new AppError("Ce service n'est pas disponible", 400);
		}

		// Vérifier que le prestataire est approuvé
		const provider = await providerRepository.findById(service.providerId);
		if (!provider || !provider.isApproved) {
			throw new AppError("Le prestataire n'est pas approuvé", 400);
		}

		// Calculer l'heure de fin si non fournie
		let calculatedEndTime = endTime;
		if (!calculatedEndTime && duration) {
			const [hours, minutes] = startTime.split(":").map(Number);
			const startDate = new Date();
			startDate.setHours(hours, minutes, 0, 0);
			startDate.setHours(startDate.getHours() + duration);
			calculatedEndTime = `${String(startDate.getHours()).padStart(
				2,
				"0"
			)}:${String(startDate.getMinutes()).padStart(2, "0")}`;
		}

		if (!calculatedEndTime) {
			throw new AppError("L'heure de fin ou la durée est requise", 400);
		}

		// Vérifier la disponibilité (anti-double réservation)
		const isAvailable = await bookingRepository.checkAvailability(
			serviceId,
			bookingDate,
			startTime,
			calculatedEndTime
		);

		if (!isAvailable) {
			throw new AppError(
				"Ce service n'est pas disponible à cette date/heure",
				409
			);
		}

		// Calculer le prix total
		const totalPrice = this._calculatePrice(
			service,
			duration,
			startTime,
			calculatedEndTime
		);

		// Créer la réservation
		const booking = await bookingRepository.create({
			userId,
			serviceId,
			providerId: service.providerId,
			bookingDate,
			startTime,
			endTime: calculatedEndTime,
			duration,
			totalPrice,
			latitude,
			longitude,
			notes,
			status: Booking.STATUS.PENDING,
		});

		logger.info(
			`Réservation créée: ${booking.id} pour le service ${serviceId}`
		);

		// Notifications: utilisateur + prestataire
		try {
			await notificationService.createNotification(
				userId,
				NOTIFICATION_TYPES.BOOKING,
				"Réservation créée",
				`Votre réservation pour le service ${service.name} a été créée.`,
				{ bookingId: booking.id, serviceId, providerId: service.providerId }
			);

			await notificationService.createNotification(
				provider.userId,
				NOTIFICATION_TYPES.BOOKING,
				"Nouvelle réservation",
				`Vous avez reçu une nouvelle réservation pour le service ${service.name}.`,
				{ bookingId: booking.id, serviceId, userId }
			);
		} catch (notifyError) {
			logger.warn(
				"Erreur lors de la création des notifications de réservation:",
				notifyError
			);
		}

		return booking;
	}

	/**
	 * Calculer le prix total d'une réservation
	 * @private
	 */
	_calculatePrice(service, duration, startTime, endTime) {
		if (service.pricePerDay && duration && duration >= 8) {
			// Si durée >= 8h, utiliser le prix par jour
			const days = Math.ceil(duration / 24);
			return parseFloat((service.pricePerDay * days).toFixed(2));
		}

		if (service.pricePerHour && duration) {
			// Utiliser le prix par heure
			return parseFloat((service.pricePerHour * duration).toFixed(2));
		}

		// Calculer depuis les heures si pas de duration
		if (startTime && endTime) {
			const [startHours, startMinutes] = startTime.split(":").map(Number);
			const [endHours, endMinutes] = endTime.split(":").map(Number);

			const startTotal = startHours * 60 + startMinutes;
			const endTotal = endHours * 60 + endMinutes;
			let diffMinutes = endTotal - startTotal;

			if (diffMinutes < 0) {
				diffMinutes += 24 * 60; // Gérer le passage à minuit
			}

			const hours = diffMinutes / 60;

			if (service.pricePerHour) {
				return parseFloat((service.pricePerHour * hours).toFixed(2));
			}
		}

		throw new AppError(
			"Impossible de calculer le prix (durée ou prix manquant)",
			400
		);
	}

	/**
	 * Obtenir une réservation par ID
	 */
	async getBookingById(bookingId) {
		const booking = await bookingRepository.findById(bookingId);
		if (!booking) {
			throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
		}
		return booking;
	}

	/**
	 * Obtenir toutes les réservations avec filtres avancés
	 */
	async getAllBookings(options = {}) {
		const {
			page = PAGINATION.DEFAULT_PAGE,
			limit = PAGINATION.DEFAULT_LIMIT,
			userId = null,
			providerId = null,
			serviceId = null,
			status = null,
			search = null,
			startDate = null,
			endDate = null,
			bookingDateStart = null,
			bookingDateEnd = null,
		} = options;

		const { count, rows } = await bookingRepository.findAll({
			page,
			limit,
			userId,
			providerId,
			serviceId,
			status,
			search,
			startDate,
			endDate,
			bookingDateStart,
			bookingDateEnd,
		});

		return {
			bookings: rows,
			pagination: {
				page: parseInt(page),
				limit: parseInt(limit),
				total: count,
				totalPages: Math.ceil(count / limit),
			},
		};
	}

	/**
	 * Confirmer une réservation (provider ou admin)
	 */
	async confirmBooking(bookingId, userId, userRole) {
		const booking = await bookingRepository.findById(bookingId);
		if (!booking) {
			throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
		}

		// Si pas admin, vérifier que c'est bien le prestataire
		if (userRole !== "admin" && booking.providerId !== userId) {
			throw new AppError(
				"Vous n'êtes pas autorisé à confirmer cette réservation",
				403
			);
		}

		if (booking.status !== Booking.STATUS.PENDING) {
			throw new AppError("Cette réservation ne peut pas être confirmée", 400);
		}

		const updated = await bookingRepository.updateById(bookingId, {
			status: Booking.STATUS.CONFIRMED,
		});

		// Notifications
		try {
			await notificationService.createNotification(
				booking.userId,
				NOTIFICATION_TYPES.BOOKING,
				"Réservation confirmée",
				"Votre réservation a été confirmée.",
				{ bookingId: booking.id, providerId: booking.providerId }
			);
		} catch (notifyError) {
			logger.warn("Erreur notification confirmation réservation:", notifyError);
		}

		return updated;
	}

	/**
	 * Annuler une réservation
	 */
	async cancelBooking(bookingId, userId, userRole) {
		const booking = await bookingRepository.findById(bookingId);
		if (!booking) {
			throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
		}

		// Vérifier que l'utilisateur est le propriétaire, le prestataire ou un admin
		if (
			userRole !== "admin" &&
			booking.userId !== userId &&
			booking.providerId !== userId
		) {
			throw new AppError(
				"Vous n'êtes pas autorisé à annuler cette réservation",
				403
			);
		}

		if (
			[Booking.STATUS.COMPLETED, Booking.STATUS.CANCELLED].includes(
				booking.status
			)
		) {
			throw new AppError("Cette réservation ne peut pas être annulée", 400);
		}

		const updated = await bookingRepository.updateById(bookingId, {
			status: Booking.STATUS.CANCELLED,
		});

		// Notifications
		try {
			const targetUserIds = new Set([booking.userId, booking.providerId]);
			targetUserIds.forEach(async (targetId) => {
				// Ne pas notifier celui qui a annulé
				if (targetId !== userId) {
					await notificationService.createNotification(
						targetId,
						NOTIFICATION_TYPES.BOOKING,
						"Réservation annulée",
						"Une réservation a été annulée.",
						{ bookingId: booking.id }
					);
				}
			});
		} catch (notifyError) {
			logger.warn("Erreur notification annulation réservation:", notifyError);
		}

		return updated;
	}

	/**
	 * Marquer une réservation comme terminée (provider ou admin)
	 */
	async completeBooking(bookingId, userId, userRole) {
		const booking = await bookingRepository.findById(bookingId);
		if (!booking) {
			throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
		}

		if (userRole !== "admin" && booking.providerId !== userId) {
			throw new AppError(
				"Vous n'êtes pas autorisé à terminer cette réservation",
				403
			);
		}

		if (booking.status !== Booking.STATUS.CONFIRMED) {
			throw new AppError(
				"Cette réservation doit être confirmée avant d'être terminée",
				400
			);
		}

		const updated = await bookingRepository.updateById(bookingId, {
			status: Booking.STATUS.COMPLETED,
		});

		// Notifications
		try {
			await notificationService.createNotification(
				booking.userId,
				NOTIFICATION_TYPES.BOOKING,
				"Réservation terminée",
				"Votre réservation a été marquée comme terminée. Vous pouvez maintenant laisser un avis.",
				{ bookingId: booking.id, providerId: booking.providerId }
			);
		} catch (notifyError) {
			logger.warn("Erreur notification fin de réservation:", notifyError);
		}

		return updated;
	}

	/**
	 * Supprimer une réservation (admin seulement)
	 */
	async deleteBooking(bookingId) {
		const booking = await bookingRepository.findById(bookingId);
		if (!booking) {
			throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
		}

		const deleted = await bookingRepository.deleteById(bookingId);
		if (!deleted) {
			throw new AppError(
				"Erreur lors de la suppression de la réservation",
				500
			);
		}

		return { deleted: true, bookingId };
	}
}

module.exports = new BookingService();
