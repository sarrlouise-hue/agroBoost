const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const passwordResetTokenRepository = require('../../data-access/passwordResetToken.repository');
const userRepository = require('../../data-access/user.repository');
const emailService = require('../email/email.service');
const { AppError } = require('../../utils/errors');
const logger = require('../../utils/logger');

/**
 * Générer un token de réinitialisation de mot de passe
 */
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hasher un mot de passe
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Comparer un mot de passe avec le hash
 */
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Créer un token de réinitialisation de mot de passe
 */
const createPasswordResetToken = async (userId) => {
  try {
    // Invalider les tokens précédents
    await passwordResetTokenRepository.invalidateByUserId(userId);

    // Créer un nouveau token
    const token = generateResetToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expire dans 1 heure

    const resetToken = await passwordResetTokenRepository.create({
      userId,
      token,
      expiresAt,
      isUsed: false,
    });

    logger.info(`Token de réinitialisation créé pour l'utilisateur: ${userId}`);

    return resetToken.token;
  } catch (error) {
    logger.error('Erreur lors de la création du token de réinitialisation:', error);
    throw new AppError('Échec de la création du token de réinitialisation', 500);
  }
};

/**
 * Vérifier un token de réinitialisation de mot de passe
 */
const verifyPasswordResetToken = async (token) => {
  try {
    const resetToken = await passwordResetTokenRepository.findValidByToken(token);

    if (!resetToken) {
      return { valid: false, message: 'Token invalide ou expiré' };
    }

    return {
      valid: true,
      resetToken,
      message: 'Token valide',
    };
  } catch (error) {
    logger.error('Erreur lors de la vérification du token:', error);
    return { valid: false, message: 'Erreur lors de la vérification du token' };
  }
};

/**
 * Réinitialiser le mot de passe avec un token
 */
const resetPassword = async (token, newPassword) => {
  try {
    // Vérifier le token
    const tokenResult = await verifyPasswordResetToken(token);

    if (!tokenResult.valid) {
      throw new AppError(tokenResult.message, 400);
    }

    const { resetToken } = tokenResult;

    // Trouver l'utilisateur
    const user = await userRepository.findById(resetToken.userId);
    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await hashPassword(newPassword);

    // Mettre à jour le mot de passe
    user.password = hashedPassword;
    await userRepository.save(user);

    // Marquer le token comme utilisé
    resetToken.isUsed = true;
    await passwordResetTokenRepository.save(resetToken);

    // Envoyer l'email de confirmation
    try {
      await emailService.sendPasswordResetConfirmationEmail(user);
      logger.info(`Email de confirmation de réinitialisation envoyé à ${user.email}`);
    } catch (emailError) {
      logger.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
      // On continue même si l'email échoue
    }

    logger.info(`Mot de passe réinitialisé pour l'utilisateur: ${user.email || user.phoneNumber}`);

    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Erreur lors de la réinitialisation du mot de passe:', error);
    throw new AppError('Échec de la réinitialisation du mot de passe', 500);
  }
};

/**
 * Changer le mot de passe (utilisateur connecté)
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    // Trouver l'utilisateur avec le mot de passe
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    // Vérifier que l'utilisateur a un mot de passe
    if (!user.password) {
      throw new AppError('Aucun mot de passe défini. Utilisez la réinitialisation de mot de passe.', 400);
    }

    // Vérifier le mot de passe actuel
    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError('Mot de passe actuel incorrect', 401);
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await hashPassword(newPassword);

    // Mettre à jour le mot de passe
    user.password = hashedPassword;
    await userRepository.save(user);

    logger.info(`Mot de passe changé pour l'utilisateur: ${user.phoneNumber}`);

    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Erreur lors du changement de mot de passe:', error);
    throw new AppError('Échec du changement de mot de passe', 500);
  }
};

/**
 * Définir un mot de passe pour un utilisateur (première fois)
 */
const setPassword = async (userId, password) => {
  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Définir le mot de passe
    user.password = hashedPassword;
    await userRepository.save(user);

    logger.info(`Mot de passe défini pour l'utilisateur: ${user.phoneNumber}`);

    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Erreur lors de la définition du mot de passe:', error);
    throw new AppError('Échec de la définition du mot de passe', 500);
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateResetToken,
  createPasswordResetToken,
  verifyPasswordResetToken,
  resetPassword,
  changePassword,
  setPassword,
};

