const providerRepository = require('../../data-access/provider.repository');
const userRepository = require('../../data-access/user.repository');
const { AppError, ERROR_MESSAGES } = require('../../utils/errors');
const { ROLES, PAGINATION } = require('../../config/constants');

/**
 * Service pour les opérations sur les prestataires
 */
class ProviderService {
  /**
   * Inscription d'un prestataire
   */
  async registerProvider(userId, providerData) {
    // Vérifier que l'utilisateur existe
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    // Vérifier que l'utilisateur n'est pas déjà prestataire
    const existingProvider = await providerRepository.findByUserId(userId);
    if (existingProvider) {
      throw new AppError('Cet utilisateur est déjà un prestataire', 400);
    }

    // Mettre à jour le rôle de l'utilisateur
    await userRepository.updateById(userId, { role: ROLES.PROVIDER });

    // Créer le prestataire
    const provider = await providerRepository.create({
      userId,
      ...providerData,
    });

    return provider;
  }

  /**
   * Obtenir le profil d'un prestataire
   */
  async getProfile(providerId) {
    const provider = await providerRepository.findById(providerId);
    if (!provider) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }
    return provider;
  }

  /**
   * Obtenir le profil d'un prestataire par userId
   */
  async getProfileByUserId(userId) {
    const provider = await providerRepository.findByUserId(userId);
    if (!provider) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }
    return provider;
  }

  /**
   * Mettre à jour le profil d'un prestataire
   */
  async updateProfile(providerId, updateData) {
    const allowedFields = ['businessName', 'description', 'documents'];
    const filteredData = {};
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    const provider = await providerRepository.updateById(providerId, filteredData);
    if (!provider) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }
    return provider;
  }

  /**
   * Obtenir tous les prestataires avec pagination
   */
  async getAllProviders(options = {}) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      isApproved = null,
      minRating = null,
    } = options;

    const { count, rows } = await providerRepository.findAll({
      page,
      limit,
      isApproved,
      minRating,
    });

    return {
      providers: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Obtenir les prestataires approuvés
   */
  async getApprovedProviders(options = {}) {
    return this.getAllProviders({ ...options, isApproved: true });
  }

  /**
   * Approuver un prestataire (admin seulement)
   */
  async approveProvider(providerId) {
    const provider = await providerRepository.updateById(providerId, {
      isApproved: true,
    });
    if (!provider) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }
    return provider;
  }

  /**
   * Rejeter un prestataire (admin seulement)
   */
  async rejectProvider(providerId) {
    const provider = await providerRepository.updateById(providerId, {
      isApproved: false,
    });
    if (!provider) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }
    return provider;
  }
}

module.exports = new ProviderService();

