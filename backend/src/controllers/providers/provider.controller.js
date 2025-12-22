const providerService = require('../../services/provider/provider.service');
const bookingService = require('../../services/booking/booking.service');
const reviewService = require('../../services/review/review.service');
const { success, paginated } = require('../../utils/response');

/**
 * Inscription d'un prestataire
 * POST /api/providers/register
 */
const registerProvider = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const provider = await providerService.registerProvider(userId, req.body);
    return success(res, provider, 'Inscription prestataire réussie', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir le profil du prestataire connecté
 * GET /api/providers/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const provider = await providerService.getProfileByUserId(userId);
    return success(res, provider, 'Profil prestataire récupéré avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir le profil d'un prestataire par ID
 * GET /api/providers/:id
 */
const getProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const provider = await providerService.getProfile(id);
    return success(res, provider, 'Profil prestataire récupéré avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Mettre à jour le profil du prestataire connecté
 * PUT /api/providers/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const provider = await providerService.getProfileByUserId(userId);
    const updatedProvider = await providerService.updateProfile(provider.id, req.body);
    return success(res, updatedProvider, 'Profil prestataire mis à jour avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir tous les prestataires
 * GET /api/providers
 */
const getAllProviders = async (req, res, next) => {
  try {
    const { page, limit, isApproved, minRating, search, userId, startDate, endDate } = req.query;
    const result = await providerService.getAllProviders({
      page,
      limit,
      isApproved: isApproved !== undefined ? isApproved === 'true' : null,
      minRating: minRating ? parseFloat(minRating) : null,
      search,
      userId,
      startDate,
      endDate,
    });
    return paginated(
      res,
      result.providers,
      result.pagination,
      'Prestataires récupérés avec succès'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Mettre à jour un prestataire par ID (admin seulement)
 * PUT /api/providers/:id
 */
const updateProviderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedProvider = await providerService.updateProviderById(id, req.body);
    return success(res, updatedProvider, 'Prestataire mis à jour avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Supprimer un prestataire (admin seulement)
 * DELETE /api/providers/:id
 */
const deleteProviderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await providerService.deleteProviderById(id);
    return success(res, result, 'Prestataire supprimé avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir les prestataires approuvés
 * GET /api/providers/approved
 */
const getApprovedProviders = async (req, res, next) => {
  try {
    const { page, limit, minRating } = req.query;
    const result = await providerService.getApprovedProviders({
      page,
      limit,
      minRating: minRating ? parseFloat(minRating) : null,
    });
    return paginated(
      res,
      result.providers,
      result.pagination,
      'Prestataires approuvés récupérés avec succès'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Approuver un prestataire (admin seulement)
 * PUT /api/providers/:id/approve
 */
const approveProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const provider = await providerService.approveProvider(id);
    return success(res, provider, 'Prestataire approuvé avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Rejeter un prestataire (admin seulement)
 * PUT /api/providers/:id/reject
 */
const rejectProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const provider = await providerService.rejectProvider(id);
    return success(res, provider, 'Prestataire rejeté avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Mettre à jour la géolocalisation du prestataire
 * PUT /api/providers/profile/location
 */
const updateLocation = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { latitude, longitude } = req.body;
    const provider = await providerService.updateLocation(userId, { latitude, longitude });
    return success(res, provider, 'Géolocalisation mise à jour avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Réservations reçues par le prestataire connecté
 * GET /api/providers/bookings
 */
const getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page, limit, status } = req.query;
    const provider = await providerService.getProfileByUserId(userId);
    const result = await bookingService.getAllBookings({
      page,
      limit,
      providerId: provider.id,
      status,
    });
    return paginated(
      res,
      result.bookings,
      result.pagination,
      'Réservations du prestataire récupérées avec succès'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Avis reçus par le prestataire connecté
 * GET /api/providers/reviews
 */
const getMyReviews = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page, limit } = req.query;
    const provider = await providerService.getProfileByUserId(userId);
    const result = await reviewService.getProviderReviews(provider.id, { page, limit });
    return paginated(
      res,
      result.reviews,
      result.pagination,
      'Avis du prestataire récupérés avec succès'
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerProvider,
  getProfile,
  getProfileById,
  updateProfile,
  updateProviderById,
  getAllProviders,
  getApprovedProviders,
  approveProvider,
  rejectProvider,
  deleteProviderById,
  updateLocation,
  getMyBookings,
  getMyReviews,
};

