const bookingRepository = require('../../data-access/booking.repository');
const reviewRepository = require('../../data-access/review.repository');
const providerRepository = require('../../data-access/provider.repository');
const { AppError, ERROR_MESSAGES } = require('../../utils/errors');
const Booking = require('../../models/Booking');
const logger = require('../../utils/logger');

/**
 * Service métier pour la gestion des avis
 */
class ReviewService {
  /**
   * Créer un avis pour une réservation complétée
   */
  async createReview(userId, data) {
    const { bookingId, rating, comment } = data;

    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND || 'Réservation non trouvée', 404);
    }

    if (booking.userId !== userId) {
      throw new AppError('Vous n\'êtes pas autorisé à noter cette réservation', 403);
    }

    if (booking.status !== Booking.STATUS.COMPLETED) {
      throw new AppError('La réservation doit être terminée avant de laisser un avis', 400);
    }

    const existingReview = await reviewRepository.findByBookingId(bookingId);
    if (existingReview) {
      throw new AppError('Un avis existe déjà pour cette réservation', 400);
    }

    const review = await reviewRepository.create({
      bookingId,
      userId,
      providerId: booking.providerId,
      serviceId: booking.serviceId,
      rating,
      comment,
    });

    // Mettre à jour la note moyenne et le nombre d'avis du prestataire
    await this._updateProviderRating(booking.providerId);

    logger.info(`Avis créé: ${review.id} pour la réservation ${bookingId}`);

    return reviewRepository.findById(review.id);
  }

  async getServiceReviews(serviceId, options = {}) {
    const { count, rows } = await reviewRepository.findForService(serviceId, options);
    return {
      reviews: rows,
      pagination: {
        page: parseInt(options.page || 1),
        limit: parseInt(options.limit || 20),
        total: count,
        totalPages: Math.ceil(count / (options.limit || 20)),
      },
    };
  }

  async getProviderReviews(providerId, options = {}) {
    const { count, rows } = await reviewRepository.findForProvider(providerId, options);
    return {
      reviews: rows,
      pagination: {
        page: parseInt(options.page || 1),
        limit: parseInt(options.limit || 20),
        total: count,
        totalPages: Math.ceil(count / (options.limit || 20)),
      },
    };
  }

  async getUserReviews(userId, options = {}) {
    const { count, rows } = await reviewRepository.findForUser(userId, options);
    return {
      reviews: rows,
      pagination: {
        page: parseInt(options.page || 1),
        limit: parseInt(options.limit || 20),
        total: count,
        totalPages: Math.ceil(count / (options.limit || 20)),
      },
    };
  }

  async updateReview(reviewId, userId, data) {
    const review = await reviewRepository.findById(reviewId);
    if (!review) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND || 'Avis non trouvé', 404);
    }

    if (review.userId !== userId) {
      throw new AppError('Vous n\'êtes pas autorisé à modifier cet avis', 403);
    }

    const updated = await reviewRepository.updateById(reviewId, {
      rating: data.rating !== undefined ? data.rating : review.rating,
      comment: data.comment !== undefined ? data.comment : review.comment,
    });

    await this._updateProviderRating(review.providerId);

    return updated;
  }

  async deleteReview(reviewId, userId) {
    const review = await reviewRepository.findById(reviewId);
    if (!review) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND || 'Avis non trouvé', 404);
    }

    if (review.userId !== userId) {
      throw new AppError('Vous n\'êtes pas autorisé à supprimer cet avis', 403);
    }

    const providerId = review.providerId;
    await reviewRepository.deleteById(reviewId);
    await this._updateProviderRating(providerId);
  }

  /**
   * Supprimer un avis (admin seulement)
   */
  async deleteReviewByAdmin(reviewId) {
    const review = await reviewRepository.findById(reviewId);
    if (!review) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND || 'Avis non trouvé', 404);
    }

    const providerId = review.providerId;
    await reviewRepository.deleteById(reviewId);
    await this._updateProviderRating(providerId);
    return { deleted: true, reviewId };
  }

  async _updateProviderRating(providerId) {
    const stats = await reviewRepository.getProviderStats(providerId);
    const provider = await providerRepository.updateById(providerId, {
      rating: stats.avgRating,
      totalBookings: stats.count,
    });

    if (provider) {
      logger.info(
        `Mise à jour rating prestataire ${providerId}: rating=${stats.avgRating}, totalBookings=${stats.count}`
      );
    }
  }
}

module.exports = new ReviewService();


