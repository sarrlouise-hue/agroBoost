const serviceRepository = require('../../data-access/service.repository');
const providerRepository = require('../../data-access/provider.repository');
const { AppError, ERROR_MESSAGES } = require('../../utils/errors');
const { SERVICE_TYPES, PAGINATION } = require('../../config/constants');

/**
 * Service pour les opérations sur les services agricoles
 */
class ServiceService {
  /**
   * Créer un nouveau service
   */
  async createService(providerId, serviceData) {
    // Vérifier que le prestataire existe et est approuvé
    const provider = await providerRepository.findById(providerId);
    if (!provider) {
      throw new AppError('Prestataire non trouvé', 404);
    }
    if (!provider.isApproved) {
      throw new AppError('Le prestataire n\'est pas encore approuvé', 403);
    }

    // Vérifier le type de service
    if (!Object.values(SERVICE_TYPES).includes(serviceData.serviceType)) {
      throw new AppError('Type de service invalide', 400);
    }

    // Vérifier que au moins un prix est défini
    if (!serviceData.pricePerHour && !serviceData.pricePerDay) {
      throw new AppError('Au moins un prix (par heure ou par jour) doit être défini', 400);
    }

    const service = await serviceRepository.create({
      providerId,
      ...serviceData,
    });

    return service;
  }

  /**
   * Obtenir un service par ID
   */
  async getServiceById(serviceId) {
    const service = await serviceRepository.findById(serviceId);
    if (!service) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }
    return service;
  }

  /**
   * Mettre à jour un service
   */
  async updateService(serviceId, providerId, updateData) {
    // Vérifier que le service existe et appartient au prestataire
    const service = await serviceRepository.findById(serviceId);
    if (!service) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }
    // Comparer les UUID en tant que strings
    if (String(service.providerId) !== String(providerId)) {
      throw new AppError('Vous n\'êtes pas autorisé à modifier ce service', 403);
    }

    const allowedFields = [
      'name',
      'description',
      'serviceType',
      'pricePerHour',
      'pricePerDay',
      'images',
      'availability',
      'latitude',
      'longitude',
    ];
    const filteredData = {};
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    // Vérifier le type de service si fourni
    if (filteredData.serviceType && !Object.values(SERVICE_TYPES).includes(filteredData.serviceType)) {
      throw new AppError('Type de service invalide', 400);
    }

    const updatedService = await serviceRepository.updateById(serviceId, filteredData);
    return updatedService;
  }

  /**
   * Supprimer un service
   */
  async deleteService(serviceId, providerId) {
    const service = await serviceRepository.findById(serviceId);
    if (!service) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }
    // Comparer les UUID en tant que strings
    if (String(service.providerId) !== String(providerId)) {
      throw new AppError('Vous n\'êtes pas autorisé à supprimer ce service', 403);
    }

    const deleted = await serviceRepository.deleteById(serviceId);
    return deleted;
  }

  /**
   * Obtenir tous les services avec filtres
   */
  async getAllServices(options = {}) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      serviceType = null,
      availability = null,
      minPrice = null,
      maxPrice = null,
      latitude = null,
      longitude = null,
      radius = null,
    } = options;

    const { count, rows } = await serviceRepository.findAll({
      page,
      limit,
      serviceType,
      availability,
      minPrice,
      maxPrice,
      latitude,
      longitude,
      radius,
    });

    return {
      services: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Obtenir les services d'un prestataire
   */
  async getServicesByProvider(providerId, options = {}) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = options;

    const { count, rows } = await serviceRepository.findByProviderId(providerId, {
      page,
      limit,
    });

    return {
      services: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Mettre à jour la disponibilité d'un service
   */
  async updateAvailability(serviceId, providerId, availability) {
    return this.updateService(serviceId, providerId, { availability });
  }
}

module.exports = new ServiceService();

