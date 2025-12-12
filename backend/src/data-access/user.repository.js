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
}

module.exports = new UserRepository();
