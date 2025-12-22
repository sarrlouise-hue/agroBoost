const PasswordResetToken = require('../models/PasswordResetToken');
const { Op } = require('sequelize');

/**
 * Repository pour les opérations sur les tokens de réinitialisation de mot de passe
 * Encapsule toutes les requêtes PostgreSQL pour les PasswordResetToken
 */
class PasswordResetTokenRepository {
  /**
   * Trouver un token valide par token string
   */
  async findValidByToken(token) {
    return PasswordResetToken.findOne({
      where: {
        token,
        isUsed: false,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Créer un nouveau token de réinitialisation
   */
  async create(tokenData) {
    return PasswordResetToken.create(tokenData);
  }

  /**
   * Invalider tous les tokens précédents pour un utilisateur
   */
  async invalidateByUserId(userId) {
    return PasswordResetToken.update(
      { isUsed: true },
      {
        where: {
          userId,
          isUsed: false,
        },
      }
    );
  }

  /**
   * Marquer un token comme utilisé
   */
  async markAsUsed(tokenId) {
    const token = await PasswordResetToken.findByPk(tokenId);
    if (!token) {
      return null;
    }
    await token.update({ isUsed: true });
    return token.reload();
  }

  /**
   * Sauvegarder un token (pour les modifications sur une instance existante)
   */
  async save(token) {
    return token.save();
  }
}

module.exports = new PasswordResetTokenRepository();
