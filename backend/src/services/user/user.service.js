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
    return userRepository.findAll(options);
  }

  /**
   * Obtenir un utilisateur par ID (pour admin)
   */
  async getUserById(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }
    // Exclure le mot de passe
    const userData = user.toJSON();
    delete userData.password;
    return userData;
  }

  /**
   * Mettre à jour un utilisateur (pour admin)
   */
  async updateUserById(userId, updateData) {
    const allowedFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'role', 'isVerified', 'address', 'language'];
    const filteredData = {};
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    // Validation du rôle si fourni
    if (filteredData.role) {
      const { ROLES } = require('../../config/constants');
      if (!Object.values(ROLES).includes(filteredData.role)) {
        throw new AppError('Rôle invalide', 400);
      }
    }

    // Validation de la langue si fournie
    if (filteredData.language) {
      const { LANGUAGES } = require('../../config/constants');
      if (!Object.values(LANGUAGES).includes(filteredData.language)) {
        throw new AppError('Langue non supportée', 400);
      }
    }

    const user = await userRepository.updateById(userId, filteredData);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }
    
    // Exclure le mot de passe
    const userData = user.toJSON();
    delete userData.password;
    return userData;
  }

  /**
   * Supprimer un utilisateur (pour admin)
   */
  async deleteUserById(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    const deleted = await userRepository.deleteById(userId);
    if (!deleted) {
      throw new AppError('Erreur lors de la suppression de l\'utilisateur', 500);
    }

    return { deleted: true, userId };
  }
}

module.exports = new UserService();

