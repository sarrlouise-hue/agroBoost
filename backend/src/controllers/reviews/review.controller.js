const reviewService = require('../../services/review/review.service');
const { success, paginated } = require('../../utils/response');
const { ROLES } = require('../../config/constants');

/**
 * Créer un avis pour une réservation
 * POST /api/reviews
 */
const createReview = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const review = await reviewService.createReview(userId, req.body);
    return success(res, review, 'Avis créé avec succès', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir les avis d'un service
 * GET /api/reviews/service/:serviceId
 */
const getServiceReviews = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const { page, limit } = req.query;
    const result = await reviewService.getServiceReviews(serviceId, { page, limit });
    return paginated(res, result.reviews, result.pagination, 'Avis du service récupérés avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir les avis d'un prestataire
 * GET /api/reviews/provider/:providerId
 */
const getProviderReviews = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const { page, limit } = req.query;
    const result = await reviewService.getProviderReviews(providerId, { page, limit });
    return paginated(res, result.reviews, result.pagination, 'Avis du prestataire récupérés avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Mettre à jour un avis
 * PUT /api/reviews/:id
 */
const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const review = await reviewService.updateReview(id, userId, req.body);
    return success(res, review, 'Avis mis à jour avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Supprimer un avis
 * DELETE /api/reviews/:id
 */
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    // Si admin, utiliser la méthode admin qui ne vérifie pas l'auteur
    if (req.user.role === ROLES.ADMIN) {
      const result = await reviewService.deleteReviewByAdmin(id);
      return success(res, result, 'Avis supprimé avec succès');
    }
    await reviewService.deleteReview(id, userId);
    return success(res, null, 'Avis supprimé avec succès');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReview,
  getServiceReviews,
  getProviderReviews,
  updateReview,
  deleteReview,
};


