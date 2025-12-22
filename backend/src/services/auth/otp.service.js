const otpRepository = require('../../data-access/otp.repository');
const userRepository = require('../../data-access/user.repository');
const emailService = require('../email/email.service');
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
const createOTP = async (email) => {
  try {
    // Vérifier que l'utilisateur existe
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Aucun utilisateur trouvé avec cet email', 404);
    }

    // Invalider les OTP précédents pour cet email
    await otpRepository.invalidateByEmail(email);

    // Générer un nouvel OTP
    const code = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(OTP_CONFIG.EXPIRES_IN, 10));

    // Sauvegarder l'OTP
    const otp = await otpRepository.create({
      email,
      code,
      expiresAt,
    });

    // Envoyer l'OTP par email
    try {
      await emailService.sendOTPEmail(email, code, user.firstName);
      logger.info(`OTP créé et envoyé par email à ${email}`);
    } catch (emailError) {
      logger.error('Erreur lors de l\'envoi de l\'email OTP:', emailError);
      // On continue même si l'email échoue, l'OTP est créé
    }

    return otp;
  } catch (error) {
    logger.error('Erreur lors de la création de l\'OTP:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Échec de la création de l\'OTP', 500);
  }
};

/**
 * Vérifier un OTP
 */
const verifyOTP = async (email, code) => {
  try {
    const otp = await otpRepository.findByEmailAndCode(email, code);

    if (!otp) {
      return { valid: false, message: 'OTP invalide ou expiré' };
    }

    // Marquer l'OTP comme utilisé
    otp.isUsed = true;
    await otpRepository.save(otp);

    logger.info(`OTP vérifié pour ${email}`);

    return { valid: true, message: 'OTP vérifié avec succès' };
  } catch (error) {
    logger.error('Erreur lors de la vérification de l\'OTP:', error);
    throw new AppError('Échec de la vérification de l\'OTP', 500);
  }
};

/**
 * Vérifier si un OTP existe et est valide
 */
const checkOTP = async (email) => {
  try {
    const otp = await otpRepository.findValidByEmail(email);

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
