const bookingRepository = require('../../data-access/booking.repository');
const serviceRepository = require('../../data-access/service.repository');
const providerRepository = require('../../data-access/provider.repository');
const { AppError, ERROR_MESSAGES } = require('../../utils/errors');
const logger = require('../../utils/logger');
const Booking = require('../../models/Booking');

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
      throw new AppError('Service non trouvé', 404);
    }

    // Vérifier que le service est disponible
    if (!service.availability) {
      throw new AppError('Ce service n\'est pas disponible', 400);
    }

    // Vérifier que le prestataire est approuvé
    const provider = await providerRepository.findById(service.providerId);
    if (!provider || !provider.isApproved) {
      throw new AppError('Le prestataire n\'est pas approuvé', 400);
    }

    // Calculer l'heure de fin si non fournie
    let calculatedEndTime = endTime;
    if (!calculatedEndTime && duration) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);
      startDate.setHours(startDate.getHours() + duration);
      calculatedEndTime = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;
    }

    if (!calculatedEndTime) {
      throw new AppError('L\'heure de fin ou la durée est requise', 400);
    }

    // Vérifier la disponibilité (anti-double réservation)
    const isAvailable = await bookingRepository.checkAvailability(
      serviceId,
      bookingDate,
      startTime,
      calculatedEndTime
    );

    if (!isAvailable) {
      throw new AppError('Ce service n\'est pas disponible à cette date/heure', 409);
    }

    // Calculer le prix total
    const totalPrice = this._calculatePrice(service, duration, startTime, calculatedEndTime);

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

    logger.info(`Réservation créée: ${booking.id} pour le service ${serviceId}`);

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
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      
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

    throw new AppError('Impossible de calculer le prix (durée ou prix manquant)', 400);
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
   * Obtenir toutes les réservations avec filtres
   */
  async getAllBookings(options = {}) {
    const { count, rows } = await bookingRepository.findAll(options);

    return {
      bookings: rows,
      pagination: {
        page: parseInt(options.page || 1),
        limit: parseInt(options.limit || 20),
        total: count,
        totalPages: Math.ceil(count / (options.limit || 20)),
      },
    };
  }

  /**
   * Confirmer une réservation (provider)
   */
  async confirmBooking(bookingId, providerId) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    if (booking.providerId !== providerId) {
      throw new AppError('Vous n\'êtes pas autorisé à confirmer cette réservation', 403);
    }

    if (booking.status !== Booking.STATUS.PENDING) {
      throw new AppError('Cette réservation ne peut pas être confirmée', 400);
    }

    return bookingRepository.updateById(bookingId, {
      status: Booking.STATUS.CONFIRMED,
    });
  }

  /**
   * Annuler une réservation
   */
  async cancelBooking(bookingId, userId) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    // Vérifier que l'utilisateur est le propriétaire ou le prestataire
    if (booking.userId !== userId && booking.providerId !== userId) {
      throw new AppError('Vous n\'êtes pas autorisé à annuler cette réservation', 403);
    }

    if ([Booking.STATUS.COMPLETED, Booking.STATUS.CANCELLED].includes(booking.status)) {
      throw new AppError('Cette réservation ne peut pas être annulée', 400);
    }

    return bookingRepository.updateById(bookingId, {
      status: Booking.STATUS.CANCELLED,
    });
  }

  /**
   * Marquer une réservation comme terminée (provider)
   */
  async completeBooking(bookingId, providerId) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    if (booking.providerId !== providerId) {
      throw new AppError('Vous n\'êtes pas autorisé à terminer cette réservation', 403);
    }

    if (booking.status !== Booking.STATUS.CONFIRMED) {
      throw new AppError('Cette réservation doit être confirmée avant d\'être terminée', 400);
    }

    return bookingRepository.updateById(bookingId, {
      status: Booking.STATUS.COMPLETED,
    });
  }
}

module.exports = new BookingService();

