const OTP = require('../models/OTP');
const { Op } = require('sequelize');

/**
 * Repository pour les opérations sur les OTP
 * Encapsule toutes les requêtes PostgreSQL pour les OTP
 */
class OTPRepository {
  /**
   * Trouver un OTP par email et code (non utilisé)
   */
  async findByEmailAndCode(email, code) {
    return OTP.findOne({
      where: {
        email,
        code,
        isUsed: false,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Trouver un OTP valide par email
   */
  async findValidByEmail(email) {
    return OTP.findOne({
      where: {
        email,
        isUsed: false,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Créer un nouvel OTP
   */
  async create(otpData) {
    return OTP.create(otpData);
  }

  /**
   * Invalider tous les OTP précédents pour un email
   */
  async invalidateByEmail(email) {
    return OTP.update(
      { isUsed: true },
      {
        where: {
          email,
          isUsed: false,
        },
      }
    );
  }

  /**
   * Marquer un OTP comme utilisé
   */
  async markAsUsed(otpId) {
    const otp = await OTP.findByPk(otpId);
    if (!otp) {
      return null;
    }
    await otp.update({ isUsed: true });
    return otp.reload();
  }

  /**
   * Sauvegarder un OTP (pour les modifications sur une instance existante)
   */
  async save(otp) {
    return otp.save();
  }
}

module.exports = new OTPRepository();
