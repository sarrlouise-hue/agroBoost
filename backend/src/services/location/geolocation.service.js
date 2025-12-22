const { AppError } = require('../../utils/errors');
const logger = require('../../utils/logger');
const { getDistance } = require('geolib');

/**
 * Service de géolocalisation
 */
class GeolocationService {
  /**
   * Calculer la distance entre deux points GPS (en kilomètres)
   * @param {number} lat1 - Latitude du premier point
   * @param {number} lng1 - Longitude du premier point
   * @param {number} lat2 - Latitude du second point
   * @param {number} lng2 - Longitude du second point
   * @returns {number} Distance en kilomètres
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    try {
      if (!lat1 || !lng1 || !lat2 || !lng2) {
        throw new AppError('Les coordonnées GPS sont requises', 400);
      }

      const distance = getDistance(
        { latitude: parseFloat(lat1), longitude: parseFloat(lng1) },
        { latitude: parseFloat(lat2), longitude: parseFloat(lng2) }
      );

      // getDistance retourne la distance en mètres, on convertit en kilomètres
      return distance / 1000;
    } catch (error) {
      logger.error('Erreur lors du calcul de distance:', error);
      throw new AppError('Erreur lors du calcul de la distance', 500);
    }
  }

  /**
   * Vérifier si des coordonnées GPS sont valides
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {boolean} True si valides
   */
  isValidCoordinates(latitude, longitude) {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    return (
      !Number.isNaN(lat) &&
      !Number.isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  }

  /**
   * Normaliser les coordonnées GPS
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {object} Coordonnées normalisées
   */
  normalizeCoordinates(latitude, longitude) {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!this.isValidCoordinates(lat, lng)) {
      throw new AppError('Coordonnées GPS invalides', 400);
    }

    return {
      latitude: parseFloat(lat.toFixed(8)),
      longitude: parseFloat(lng.toFixed(8)),
    };
  }

  /**
   * Calculer la distance depuis un point vers plusieurs services
   * @param {number} userLat - Latitude de l'utilisateur
   * @param {number} userLng - Longitude de l'utilisateur
   * @param {Array} services - Liste des services avec latitude/longitude
   * @returns {Array} Services avec distance ajoutée
   */
  calculateDistancesToServices(userLat, userLng, services) {
    if (!userLat || !userLng) {
      return services.map((service) => ({
        ...service.toJSON ? service.toJSON() : service,
        distance: null,
      }));
    }

    return services.map((service) => {
      const serviceData = service.toJSON ? service.toJSON() : service;
      let distance = null;

      if (serviceData.latitude && serviceData.longitude) {
        try {
          distance = this.calculateDistance(
            userLat,
            userLng,
            serviceData.latitude,
            serviceData.longitude
          );
        } catch (error) {
          logger.warn('Erreur calcul distance service:', error);
        }
      }

      return {
        ...serviceData,
        distance: distance !== null ? parseFloat(distance.toFixed(2)) : null,
      };
    });
  }

  /**
   * Trier les services par distance
   * @param {Array} services - Liste des services avec distance
   * @returns {Array} Services triés par distance (plus proche en premier)
   */
  sortByDistance(services) {
    return services.sort((a, b) => {
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
  }
}

module.exports = new GeolocationService();

