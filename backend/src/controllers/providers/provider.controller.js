const providerService = require('../../services/provider/provider.service');
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
    const { page, limit, isApproved, minRating } = req.query;
    const result = await providerService.getAllProviders({
      page,
      limit,
      isApproved: isApproved !== undefined ? isApproved === 'true' : null,
      minRating: minRating ? parseFloat(minRating) : null,
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

module.exports = {
  registerProvider,
  getProfile,
  getProfileById,
  updateProfile,
  getAllProviders,
  getApprovedProviders,
  approveProvider,
  rejectProvider,
};

