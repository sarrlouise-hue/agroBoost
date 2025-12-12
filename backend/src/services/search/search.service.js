const serviceRepository = require('../../data-access/service.repository');
const geolocationService = require('../location/geolocation.service');
const { AppError } = require('../../utils/errors');
const logger = require('../../utils/logger');

/**
 * Service de recherche avancée
 */
class SearchService {
  /**
   * Rechercher des services avec filtres avancés
   * @param {object} searchOptions - Options de recherche
   * @returns {object} Résultats de la recherche
   */
  async searchServices(searchOptions = {}) {
    const {
      query = null, // Recherche textuelle
      serviceType = null,
      availability = true,
      minPrice = null,
      maxPrice = null,
      latitude = null,
      longitude = null,
      radius = null, // en km
      sortBy = 'relevance', // relevance, distance, priceAsc, priceDesc, rating
      page = 1,
      limit = 20,
    } = searchOptions;

    try {
      // Préparer les filtres de base
      const filterOptions = {
        serviceType,
        availability,
        minPrice,
        maxPrice,
        latitude,
        longitude,
        radius,
        page,
        limit,
      };

      // Recherche par texte (dans le nom et la description)
      let servicesResult;
      if (query && query.trim()) {
        // Recherche avec filtre texte
        servicesResult = await this._searchByText(query, filterOptions);
      } else {
        // Recherche standard avec filtres
        servicesResult = await serviceRepository.findAll(filterOptions);
      }

      let { count, rows: services } = servicesResult;

      // Calculer les distances si latitude/longitude fournies
      if (latitude && longitude) {
        services = geolocationService.calculateDistancesToServices(
          latitude,
          longitude,
          services
        );
      }

      // Trier selon le critère demandé
      services = this._sortServices(services, sortBy, latitude, longitude);

      return {
        services,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      logger.error('Erreur lors de la recherche de services:', error);
      throw new AppError('Erreur lors de la recherche de services', 500);
    }
  }

  /**
   * Recherche par texte (nom et description)
   * @private
   */
  async _searchByText(query, filterOptions) {
    // Utiliser Sequelize pour rechercher dans le nom et la description
    const { Op } = require('sequelize');
    const Service = require('../../models/Service');
    const Provider = require('../../models/Provider');
    const User = require('../../models/User');

    const searchTerm = `%${query.trim()}%`;

    const whereConditions = {
      [Op.or]: [
        { name: { [Op.iLike]: searchTerm } },
        { description: { [Op.iLike]: searchTerm } },
      ],
    };

    // Appliquer les autres filtres
    if (filterOptions.serviceType) {
      whereConditions.serviceType = filterOptions.serviceType;
    }
    if (filterOptions.availability !== null) {
      whereConditions.availability = filterOptions.availability;
    }

    const offset = (filterOptions.page - 1) * filterOptions.limit;

    // Recherche géographique si coordonnées fournies
    if (filterOptions.latitude && filterOptions.longitude && filterOptions.radius) {
      // La logique géographique sera gérée par le repository
    }

    const result = await Service.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Provider,
          where: { isApproved: true },
          required: true,
          include: [
            {
              model: User,
              attributes: { exclude: ['password'] },
            },
          ],
        },
      ],
      limit: parseInt(filterOptions.limit),
      offset: parseInt(offset),
      distinct: true,
      col: 'Service.id',
    });

    return result;
  }

  /**
   * Trier les services selon le critère
   * @private
   */
  _sortServices(services, sortBy, userLat = null, userLng = null) {
    const servicesArray = [...services];

    switch (sortBy) {
      case 'distance':
        if (userLat && userLng) {
          return geolocationService.sortByDistance(servicesArray);
        }
        // Si pas de coordonnées, trier par date (par défaut)
        return servicesArray.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });

      case 'priceAsc':
        return servicesArray.sort((a, b) => {
          const priceA = a.pricePerHour || a.pricePerDay || Infinity;
          const priceB = b.pricePerHour || b.pricePerDay || Infinity;
          return priceA - priceB;
        });

      case 'priceDesc':
        return servicesArray.sort((a, b) => {
          const priceA = a.pricePerHour || a.pricePerDay || 0;
          const priceB = b.pricePerHour || b.pricePerDay || 0;
          return priceB - priceA;
        });

      case 'rating':
        return servicesArray.sort((a, b) => {
          const ratingA = a.provider?.rating || 0;
          const ratingB = b.provider?.rating || 0;
          return ratingB - ratingA;
        });

      case 'relevance':
      default:
        // Tri par pertinence : distance d'abord si disponible, puis par note
        if (userLat && userLng) {
          const sortedByDistance = geolocationService.sortByDistance(servicesArray);
          // Puis par note si distance similaire
          return sortedByDistance.sort((a, b) => {
            if (a.distance !== null && b.distance !== null) {
              const diff = Math.abs(a.distance - b.distance);
              if (diff < 5) {
                // Si distance similaire (< 5km), trier par note
                const ratingA = a.provider?.rating || 0;
                const ratingB = b.provider?.rating || 0;
                return ratingB - ratingA;
              }
            }
            return 0;
          });
        }
        // Par défaut : par note décroissante
        return servicesArray.sort((a, b) => {
          const ratingA = a.provider?.rating || 0;
          const ratingB = b.provider?.rating || 0;
          return ratingB - ratingA;
        });
    }
  }

  /**
   * Rechercher les services à proximité
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @param {number} radius - Rayon en km
   * @param {object} options - Options supplémentaires
   * @returns {object} Services à proximité
   */
  async searchNearby(latitude, longitude, radius = 10, options = {}) {
    if (!latitude || !longitude) {
      throw new AppError('Les coordonnées GPS sont requises', 400);
    }

    return this.searchServices({
      ...options,
      latitude,
      longitude,
      radius,
      sortBy: 'distance',
    });
  }
}

module.exports = new SearchService();

