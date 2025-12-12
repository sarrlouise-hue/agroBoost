const Provider = require('../models/Provider');
const { Op } = require('sequelize');

/**
 * Repository pour les opérations sur les prestataires
 */
class ProviderRepository {
  /**
   * Trouver un prestataire par ID
   */
  async findById(providerId) {
    return Provider.findByPk(providerId, {
      include: [{ association: 'user', attributes: { exclude: ['password'] } }],
    });
  }

  /**
   * Trouver un prestataire par userId
   */
  async findByUserId(userId) {
    return Provider.findOne({
      where: { userId },
      include: [{ association: 'user', attributes: { exclude: ['password'] } }],
    });
  }

  /**
   * Créer un nouveau prestataire
   */
  async create(providerData) {
    return Provider.create(providerData, {
      include: [{ association: 'user', attributes: { exclude: ['password'] } }],
    });
  }

  /**
   * Mettre à jour un prestataire
   */
  async updateById(providerId, updateData) {
    const provider = await Provider.findByPk(providerId);
    if (!provider) {
      return null;
    }
    await provider.update(updateData);
    return provider.reload({
      include: [{ association: 'user', attributes: { exclude: ['password'] } }],
    });
  }

  /**
   * Trouver tous les prestataires avec pagination
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 20,
      isApproved = null,
      minRating = null,
    } = options;

    const where = {};
    if (isApproved !== null) {
      where.isApproved = isApproved;
    }
    if (minRating !== null) {
      where.rating = { [Op.gte]: minRating };
    }

    const offset = (page - 1) * limit;

    return Provider.findAndCountAll({
      where,
      include: [{ association: 'user', attributes: { exclude: ['password'] } }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Trouver les prestataires approuvés
   */
  async findApproved(options = {}) {
    return this.findAll({ ...options, isApproved: true });
  }

  /**
   * Sauvegarder un prestataire
   */
  async save(provider) {
    return provider.save();
  }

  /**
   * Supprimer un prestataire
   */
  async deleteById(providerId) {
    const provider = await Provider.findByPk(providerId);
    if (!provider) {
      return false;
    }
    await provider.destroy();
    return true;
  }
}

module.exports = new ProviderRepository();

