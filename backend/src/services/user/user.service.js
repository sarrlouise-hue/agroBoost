const userRepository = require('../../data-access/user.repository');
const { AppError, ERROR_MESSAGES } = require('../../utils/errors');
const { PAGINATION } = require('../../config/constants');

/**
 * Service pour les opérations sur les utilisateurs
 */
class UserService {
  /**
   * Obtenir le profil d'un utilisateur
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }
    return user;
  }

  /**
   * Mettre à jour le profil d'un utilisateur
   */
  async updateProfile(userId, updateData) {
    const allowedFields = ['firstName', 'lastName', 'email', 'address'];
    const filteredData = {};
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    const user = await userRepository.updateById(userId, filteredData);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }
    return user;
  }

  /**
   * Mettre à jour la localisation d'un utilisateur
   */
  async updateLocation(userId, locationData) {
    const { latitude, longitude, address } = locationData;

    if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
      throw new AppError('La latitude doit être entre -90 et 90', 400);
    }
    if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
      throw new AppError('La longitude doit être entre -180 et 180', 400);
    }

    const updateData = {};
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    if (address !== undefined) updateData.address = address;

    const user = await userRepository.updateById(userId, updateData);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }
    return user;
  }

  /**
   * Changer la langue de l'utilisateur
   */
  async updateLanguage(userId, language) {
    const { LANGUAGES } = require('../../config/constants');
    if (!Object.values(LANGUAGES).includes(language)) {
      throw new AppError('Langue non supportée', 400);
    }

    const user = await userRepository.updateById(userId, { language });
    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }
    return user;
  }

  /**
   * Obtenir tous les utilisateurs (pour admin)
   */
  async getAllUsers(options = {}) {
    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = options;
    
    // Pour l'instant, on utilise une méthode simple
    // On pourrait créer une méthode findAll dans le repository si nécessaire
    const User = require('../../models/User');
    const offset = (page - 1) * limit;
    
    const { count, rows } = await User.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    return {
      users: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
}

module.exports = new UserService();

