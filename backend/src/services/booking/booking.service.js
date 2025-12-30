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
			type,
			startDate,
			endDate,
			bookingDate,
			startTime,
			endTime,
			duration,
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

		let finalDuration = duration;
		let finalTotalPrice = 0;
		let calculatedEndTime = endTime;

		if (type === "daily") {
			// Logique JOUR
			const start = new Date(startDate);
			const end = new Date(endDate);
			const durationInMilliseconds = end.getTime() - start.getTime();
			finalDuration =
				Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24)) + 1;

			if (finalDuration < 1) {
				throw new AppError(
					"La durée de réservation doit être d'au moins 1 jour",
					400
				);
			}
			finalTotalPrice = this._calculatePrice(service, finalDuration, "daily");
		} else {
			// Logique HEURE
			if (!calculatedEndTime && duration) {
				const [hours, minutes] = startTime.split(":").map(Number);
				const dateObj = new Date();
				dateObj.setHours(hours, minutes, 0, 0);
				dateObj.setHours(dateObj.getHours() + duration);
				calculatedEndTime = `${String(dateObj.getHours()).padStart(
					2,
					"0"
				)}:${String(dateObj.getMinutes()).padStart(2, "0")}`;
			}

			if (!calculatedEndTime) {
				throw new AppError("L'heure de fin ou la durée est requise", 400);
			}

			if (!finalDuration && startTime && calculatedEndTime) {
				const [h1, m1] = startTime.split(":").map(Number);
				const [h2, m2] = calculatedEndTime.split(":").map(Number);
				let diff = h2 * 60 + m2 - (h1 * 60 + m1);
				if (diff < 0) diff += 24 * 60;
				finalDuration = diff / 60;
			}
			finalTotalPrice = this._calculatePrice(service, finalDuration, "hourly");
		}

		// Créer la réservation
		const booking = await bookingRepository.create({
			userId,
			serviceId,
			providerId: service.providerId,
			type,
			startDate: type === "daily" ? startDate : null,
			endDate: type === "daily" ? endDate : null,
			bookingDate: type === "hourly" ? bookingDate : null,
			startTime: type === "hourly" ? startTime : null,
			endTime: type === "hourly" ? calculatedEndTime : null,
			duration: finalDuration,
			totalPrice: finalTotalPrice,
			notes,
			status: Booking.STATUS.PENDING,
		});

		logger.info(
			`Réservation créée (${type}): ${booking.id} pour le service ${serviceId}`
		);

		// Notifications
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

	_calculatePrice(service, duration, type) {
		let price = 0;
		if (type === "daily") {
			if (service.pricePerDay) {
				price = service.pricePerDay * duration;
			} else if (service.pricePerHour) {
				price = service.pricePerHour * 8 * duration;
			}

			let discountPercentage = 0;
			if (duration >= 30) discountPercentage = 20;
			else if (duration >= 14) discountPercentage = 15;
			else if (duration >= 7) discountPercentage = 10;
			price = price - (price * discountPercentage) / 100;
		} else {
			if (service.pricePerHour) {
				price = service.pricePerHour * duration;
			} else if (service.pricePerDay) {
				price = (service.pricePerDay / 8) * duration;
			}
		}
		return parseFloat(price.toFixed(2));
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
		if (userRole !== "admin" && booking.provider?.userId !== userId) {
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
			booking.provider?.userId !== userId
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

		if (userRole !== "admin" && booking.provider?.userId !== userId) {
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
	 * Obtenir les statistiques du dashboard pour un producteur
	 */
	async getProducteurDashboardStats(userId) {
		const bookings = await Booking.findAll({
			where: { userId },
		});

		const stats = {
			reservations: {
				total: bookings.length,
				enAttente: bookings.filter((b) => b.status === "pending").length,
				confirmees: bookings.filter((b) => b.status === "confirmed").length,
				enCours: bookings.filter((b) => b.status === "in_progress").length,
				terminees: bookings.filter((b) => b.status === "completed").length,
				annulees: bookings.filter((b) => b.status === "cancelled").length,
			},
			finances: {
				depensesTotales: bookings
					.filter((b) => b.status !== "cancelled")
					.reduce((sum, b) => sum + Number(b.totalPrice), 0),
			},
		};

		return stats;
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
