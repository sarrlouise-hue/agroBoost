const serviceService = require('../../services/service/service.service');
const providerService = require('../../services/provider/provider.service');
const { success, paginated } = require('../../utils/response');

/**
 * Créer un nouveau service
 * POST /api/services
 */
const createService = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // Obtenir le providerId depuis le profil prestataire
    const provider = await providerService.getProfileByUserId(userId);
    const service = await serviceService.createService(provider.id, req.body);
    return success(res, service, 'Service créé avec succès', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir un service par ID
 * GET /api/services/:id
 */
const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await serviceService.getServiceById(id);
    return success(res, service, 'Service récupéré avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Mettre à jour un service
 * PUT /api/services/:id
 */
const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    // Obtenir le providerId depuis le profil prestataire
    const provider = await providerService.getProfileByUserId(userId);
    const updatedService = await serviceService.updateService(id, provider.id, req.body);
    return success(res, updatedService, 'Service mis à jour avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Supprimer un service
 * DELETE /api/services/:id
 */
const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    // Obtenir le providerId depuis le profil prestataire
    const provider = await providerService.getProfileByUserId(userId);
    await serviceService.deleteService(id, provider.id);
    return success(res, null, 'Service supprimé avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir tous les services avec filtres
 * GET /api/services
 */
const getAllServices = async (req, res, next) => {
  try {
    const {
      page,
      limit,
      serviceType,
      availability,
      minPrice,
      maxPrice,
      latitude,
      longitude,
      radius,
    } = req.query;

    const result = await serviceService.getAllServices({
      page,
      limit,
      serviceType,
      availability: availability !== undefined ? availability === 'true' : null,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      radius: radius ? parseFloat(radius) : null,
    });

    return paginated(
      res,
      result.services,
      result.pagination,
      'Services récupérés avec succès'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir les services d'un prestataire
 * GET /api/services/provider/:providerId
 */
const getServicesByProvider = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const { page, limit } = req.query;
    const result = await serviceService.getServicesByProvider(providerId, {
      page,
      limit,
    });
    return paginated(
      res,
      result.services,
      result.pagination,
      'Services du prestataire récupérés avec succès'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir les services du prestataire connecté
 * GET /api/services/my-services
 */
const getMyServices = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const provider = await providerService.getProfileByUserId(userId);
    const { page, limit } = req.query;
    const result = await serviceService.getServicesByProvider(provider.id, {
      page,
      limit,
    });
    return paginated(
      res,
      result.services,
      result.pagination,
      'Vos services récupérés avec succès'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Mettre à jour la disponibilité d'un service
 * PUT /api/services/:id/availability
 */
const updateAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { availability } = req.body;
    const userId = req.user.userId;
    // Obtenir le providerId depuis le profil prestataire
    const provider = await providerService.getProfileByUserId(userId);
    const updatedService = await serviceService.updateAvailability(
      id,
      provider.id,
      availability
    );
    return success(res, updatedService, 'Disponibilité mise à jour avec succès');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createService,
  getServiceById,
  updateService,
  deleteService,
  getAllServices,
  getServicesByProvider,
  getMyServices,
  updateAvailability,
};

