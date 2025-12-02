const otpRepository = require('../../data-access/otp.repository');
const { OTP: OTP_CONFIG } = require('../../config/env');
const { AppError } = require('../../utils/errors');
const logger = require('../../utils/logger');

/**
 * Générer un code OTP aléatoire
 */
const generateOTP = (length = OTP_CONFIG.LENGTH) => {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < length; i += 1) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
};

/**
 * Créer et sauvegarder un OTP
 */
const createOTP = async (phoneNumber) => {
  try {
    // Invalider les OTP précédents pour ce numéro de téléphone
    await otpRepository.invalidateByPhoneNumber(phoneNumber);

    // Générer un nouvel OTP
    const code = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(OTP_CONFIG.EXPIRES_IN, 10));

    // Sauvegarder l'OTP
    const otp = await otpRepository.create({
      phoneNumber,
      code,
      expiresAt,
    });

    logger.info(`OTP créé pour ${phoneNumber}`);

    return otp;
  } catch (error) {
    logger.error('Erreur lors de la création de l\'OTP:', error);
    throw new AppError('Échec de la création de l\'OTP', 500);
  }
};

/**
 * Vérifier un OTP
 */
const verifyOTP = async (phoneNumber, code) => {
  try {
    const otp = await otpRepository.findByPhoneNumberAndCode(phoneNumber, code);

    if (!otp) {
      return { valid: false, message: 'OTP invalide ou expiré' };
    }

    // Marquer l'OTP comme utilisé
    otp.isUsed = true;
    await otpRepository.save(otp);

    logger.info(`OTP vérifié pour ${phoneNumber}`);

    return { valid: true, message: 'OTP vérifié avec succès' };
  } catch (error) {
    logger.error('Erreur lors de la vérification de l\'OTP:', error);
    throw new AppError('Échec de la vérification de l\'OTP', 500);
  }
};

/**
 * Vérifier si un OTP existe et est valide
 */
const checkOTP = async (phoneNumber) => {
  try {
    const otp = await otpRepository.findValidByPhoneNumber(phoneNumber);

    return !!otp;
  } catch (error) {
    logger.error('Erreur lors de la vérification de l\'OTP:', error);
    return false;
  }
};

module.exports = {
  generateOTP,
  createOTP,
  verifyOTP,
  checkOTP,
};
