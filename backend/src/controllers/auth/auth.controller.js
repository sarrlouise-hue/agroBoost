const authService = require('../../services/auth/auth.service');
const otpService = require('../../services/auth/otp.service');
const passwordService = require('../../services/auth/password.service');
const userRepository = require('../../data-access/user.repository');
const { success, error } = require('../../utils/response');
const { AppError } = require('../../utils/errors');
const logger = require('../../utils/logger');

/**
 * Inscrire un nouvel utilisateur
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { phoneNumber, firstName, lastName, email, language } = req.body;

    // Inscrire l'utilisateur
    const result = await authService.register({
      phoneNumber,
      firstName,
      lastName,
      email,
      language,
    });

    // Générer et envoyer l'OTP
    await otpService.createOTP(phoneNumber);

    return success(res, result, 'Utilisateur inscrit avec succès. Veuillez vérifier l\'OTP.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Vérifier l'OTP et activer le compte
 * POST /api/auth/verify-otp
 */
const verifyOTP = async (req, res, next) => {
  try {
    const { phoneNumber, code } = req.body;

    // Vérifier l'OTP
    const otpResult = await otpService.verifyOTP(phoneNumber, code);

    if (!otpResult.valid) {
      return error(res, otpResult.message, 400);
    }

    // Vérifier le compte utilisateur
    const user = await authService.login(phoneNumber);
    await authService.verifyUser(user.user.id);

    // Retourner l'utilisateur mis à jour avec les tokens
    const result = await authService.login(phoneNumber);

    return success(res, result, 'OTP vérifié avec succès. Compte activé.');
  } catch (err) {
    next(err);
  }
};

/**
 * Renvoyer l'OTP
 * POST /api/auth/resend-otp
 */
const resendOTP = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    // Créer un nouvel OTP
    await otpService.createOTP(phoneNumber);

    // TODO: Envoyer l'OTP via le service SMS

    return success(res, null, 'OTP envoyé avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Connecter un utilisateur
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;

    // Si un mot de passe est fourni, utiliser loginWithPassword
    if (password) {
      const result = await authService.loginWithPassword(phoneNumber, password);
      return success(res, result, 'Connexion réussie');
    }

    // Sinon, utiliser la connexion par OTP (sans mot de passe)
    const result = await authService.login(phoneNumber);
    return success(res, result, 'Connexion réussie');
  } catch (err) {
    next(err);
  }
};

/**
 * Demander la réinitialisation du mot de passe
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    // Trouver l'utilisateur
    const user = await userRepository.findByPhoneNumber(phoneNumber);
    if (!user) {
      // Ne pas révéler si l'utilisateur existe ou non pour la sécurité
      return success(res, null, 'Si ce numéro existe, un email avec les instructions sera envoyé.');
    }

    // Créer un token de réinitialisation
    const resetToken = await passwordService.createPasswordResetToken(user.id);

    // TODO: Envoyer l'email avec le lien de réinitialisation
    // Pour l'instant, on retourne le token (à supprimer en production)
    logger.info(`Token de réinitialisation créé pour ${phoneNumber}: ${resetToken}`);

    return success(res, { resetToken }, 'Instructions de réinitialisation envoyées');
  } catch (err) {
    next(err);
  }
};

/**
 * Réinitialiser le mot de passe avec un token
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    await passwordService.resetPassword(token, newPassword);

    return success(res, null, 'Mot de passe réinitialisé avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Changer le mot de passe (utilisateur connecté)
 * POST /api/auth/change-password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId; // Depuis le middleware d'authentification

    await passwordService.changePassword(userId, currentPassword, newPassword);

    return success(res, null, 'Mot de passe changé avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Rafraîchir le token d'accès
 * POST /api/auth/refresh-token
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return error(res, 'Le refresh token est requis', 400);
    }

    const result = await authService.refreshAccessToken(refreshToken);

    return success(res, result, 'Token rafraîchi avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Déconnecter un utilisateur
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  try {
    // Dans un système JWT sans état, la déconnexion est principalement gérée côté client
    // Le token est supprimé du stockage côté client
    // Optionnellement, on peut implémenter une blacklist de tokens ici

    // TODO: Ajouter le token à une blacklist si nécessaire (Redis, DB, etc.)
    // const token = req.headers.authorization?.replace('Bearer ', '');
    // if (token) {
    //   await blacklistToken(token);
    // }

    logger.info(`Utilisateur déconnecté: ${req.user?.userId || 'Unknown'}`);

    return success(res, null, 'Déconnexion réussie');
  } catch (err) {
    // Même en cas d'erreur, on retourne un succès pour ne pas bloquer le client
    return success(res, null, 'Déconnexion réussie');
  }
};

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
};

