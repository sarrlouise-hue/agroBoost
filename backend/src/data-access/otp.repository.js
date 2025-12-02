const OTP = require('../models/OTP');
const { Op } = require('sequelize');

/**
 * Repository pour les opérations sur les OTP
 * Encapsule toutes les requêtes PostgreSQL pour les OTP
 */
class OTPRepository {
  /**
   * Trouver un OTP par numéro de téléphone et code (non utilisé)
   */
  async findByPhoneNumberAndCode(phoneNumber, code) {
    return OTP.findOne({
      where: {
        phoneNumber,
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
   * Trouver un OTP valide par numéro de téléphone
   */
  async findValidByPhoneNumber(phoneNumber) {
    return OTP.findOne({
      where: {
        phoneNumber,
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
   * Invalider tous les OTP précédents pour un numéro de téléphone
   */
  async invalidateByPhoneNumber(phoneNumber) {
    return OTP.update(
      { isUsed: true },
      {
        where: {
          phoneNumber,
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
