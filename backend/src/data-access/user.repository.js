const User = require('../models/User');
const { Op } = require('sequelize');

/**
 * Repository pour les opérations sur les utilisateurs
 * Encapsule toutes les requêtes PostgreSQL pour les utilisateurs
 */
class UserRepository {
  /**
   * Trouver un utilisateur par numéro de téléphone
   */
  async findByPhoneNumber(phoneNumber) {
    return User.findOne({ where: { phoneNumber } });
  }

  /**
   * Trouver un utilisateur par ID
   */
  async findById(userId) {
    return User.findByPk(userId);
  }

  /**
   * Trouver un utilisateur par ID avec mot de passe (pour authentification)
   */
  async findByIdWithPassword(userId) {
    return User.scope('withPassword').findByPk(userId);
  }

  /**
   * Trouver un utilisateur par numéro de téléphone avec mot de passe
   */
  async findByPhoneNumberWithPassword(phoneNumber) {
    return User.scope('withPassword').findOne({ where: { phoneNumber } });
  }

  /**
   * Créer un nouvel utilisateur
   */
  async create(userData) {
    return User.create(userData);
  }

  /**
   * Mettre à jour un utilisateur
   */
  async updateById(userId, updateData) {
    const user = await User.findByPk(userId);
    if (!user) {
      return null;
    }
    await user.update(updateData);
    return user.reload();
  }

  /**
   * Sauvegarder un utilisateur (pour les modifications sur une instance existante)
   */
  async save(user) {
    return user.save();
  }

  /**
   * Vérifier si un utilisateur existe par numéro de téléphone
   */
  async existsByPhoneNumber(phoneNumber) {
    const user = await User.findOne({ where: { phoneNumber } });
    return !!user;
  }

  /**
   * Trouver un utilisateur par email
   */
  async findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  /**
   * Trouver un utilisateur par email avec mot de passe (pour authentification)
   */
  async findByEmailWithPassword(email) {
    return User.scope('withPassword').findOne({ where: { email } });
  }

  /**
   * Trouver tous les utilisateurs avec filtres (pour admin)
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 20,
      role = null,
      isVerified = null,
      search = null,
      startDate = null,
      endDate = null,
    } = options;

    const where = {};

    if (role) {
      where.role = role;
    }
    if (isVerified !== null) {
      where.isVerified = isVerified;
    }
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phoneNumber: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.createdAt[Op.lte] = new Date(endDate);
      }
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] },
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

  /**
   * Supprimer un utilisateur par ID
   */
  async deleteById(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      return false;
    }
    await user.destroy();
    return true;
  }
}

module.exports = new UserRepository();
