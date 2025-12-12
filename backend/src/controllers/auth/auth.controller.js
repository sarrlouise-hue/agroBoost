const authService = require('../../services/auth/auth.service');
const otpService = require('../../services/auth/otp.service');
const passwordService = require('../../services/auth/password.service');
const emailService = require('../../services/email/email.service');
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

    if (!email) {
      return error(res, 'L\'email est requis pour l\'inscription', 400);
    }

    // Inscrire l'utilisateur
    const result = await authService.register({
      phoneNumber,
      firstName,
      lastName,
      email,
      language,
    });

    // Générer et envoyer l'OTP par email
    await otpService.createOTP(email);

    // Envoyer l'email de bienvenue
    try {
      const user = await userRepository.findByEmail(email);
      if (user) {
        await emailService.sendWelcomeEmail(user);
      }
    } catch (emailError) {
      logger.error('Erreur lors de l\'envoi de l\'email de bienvenue:', emailError);
      // On continue même si l'email de bienvenue échoue
    }

    return success(res, result, 'Utilisateur inscrit avec succès. Veuillez vérifier votre email pour le code OTP.', 201);
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
    const { email, code } = req.body;

    if (!email) {
      return error(res, 'L\'email est requis', 400);
    }

    // Vérifier l'OTP
    const otpResult = await otpService.verifyOTP(email, code);

    if (!otpResult.valid) {
      return error(res, otpResult.message, 400);
    }

    // Trouver l'utilisateur par email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return error(res, 'Utilisateur non trouvé', 404);
    }

    // Vérifier le compte utilisateur
    await authService.verifyUser(user.id);

    // Retourner l'utilisateur mis à jour avec les tokens
    const result = await authService.loginWithEmail(email);

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
    const { email } = req.body;

    if (!email) {
      return error(res, 'L\'email est requis', 400);
    }

    // Créer un nouvel OTP et l'envoyer par email
    await otpService.createOTP(email);

    return success(res, null, 'Code OTP envoyé par email avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Connecter un utilisateur
 * POST /api/auth/login
 * Accepte phoneNumber ou email, avec ou sans mot de passe
 */
const login = async (req, res, next) => {
  try {
    const { phoneNumber, email, password } = req.body;

    // Si un email est fourni, utiliser l'email pour la connexion
    if (email) {
      // Si un mot de passe est fourni, utiliser loginWithEmailAndPassword
      if (password) {
        const result = await authService.loginWithEmailAndPassword(email, password);
        return success(res, result, 'Connexion réussie');
      }
      // Sinon, utiliser la connexion par email (sans mot de passe)
      const result = await authService.loginWithEmail(email);
      return success(res, result, 'Connexion réussie');
    }

    // Si un numéro de téléphone est fourni
    if (phoneNumber) {
      // Si un mot de passe est fourni, utiliser loginWithPassword
      if (password) {
        const result = await authService.loginWithPassword(phoneNumber, password);
        return success(res, result, 'Connexion réussie');
      }
      // Sinon, utiliser la connexion par OTP (sans mot de passe)
      const result = await authService.login(phoneNumber);
      return success(res, result, 'Connexion réussie');
    }

    // Si ni email ni phoneNumber n'est fourni
    return error(res, 'L\'email ou le numéro de téléphone est requis', 400);
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
    const { email } = req.body;

    if (!email) {
      return error(res, 'L\'email est requis', 400);
    }

    // Trouver l'utilisateur
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Ne pas révéler si l'utilisateur existe ou non pour la sécurité
      return success(res, null, 'Si cet email existe, un email avec les instructions sera envoyé.');
    }

    // Créer un token de réinitialisation
    const resetToken = await passwordService.createPasswordResetToken(user.id);

    // Envoyer l'email avec le lien de réinitialisation
    try {
      await emailService.sendPasswordResetRequestEmail(user, resetToken.token);
      logger.info(`Email de réinitialisation envoyé à ${email}`);
    } catch (emailError) {
      logger.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', emailError);
      // On continue même si l'email échoue
    }

    return success(res, null, 'Si cet email existe, un email avec les instructions de réinitialisation sera envoyé.');
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

