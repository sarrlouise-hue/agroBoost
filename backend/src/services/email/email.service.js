const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
const { EMAIL } = require('../../config/env');
const logger = require('../../utils/logger');
const { AppError } = require('../../utils/errors');

/**
 * Vérifier si la configuration email est valide
 */
const isEmailConfigured = () => {
  return !!(EMAIL.USER && EMAIL.PASSWORD && EMAIL.FROM_EMAIL);
};

/**
 * Créer un transporteur email
 */
const createTransporter = () => {
  if (!isEmailConfigured()) {
    throw new AppError('Configuration email incomplète. Veuillez configurer EMAIL_USER, EMAIL_PASSWORD et EMAIL_FROM_EMAIL dans votre fichier .env', 500);
  }

  return nodemailer.createTransport({
    host: EMAIL.HOST,
    port: EMAIL.PORT,
    secure: EMAIL.SECURE, // true pour 465, false pour les autres ports
    auth: {
      user: EMAIL.USER,
      pass: EMAIL.PASSWORD,
    },
  });
};

/**
 * Charger un template HTML
 */
const loadTemplate = async (templateName, variables = {}) => {
  try {
    const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
    let html = await fs.readFile(templatePath, 'utf-8');

    // Remplacer les variables dans le template
    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, variables[key]);
    });

    return html;
  } catch (error) {
    logger.error(`Erreur lors du chargement du template ${templateName}:`, error);
    throw new AppError(`Impossible de charger le template ${templateName}`, 500);
  }
};

/**
 * Envoyer un email
 */
const sendEmail = async (to, subject, html, text = null) => {
  try {
    // Vérifier si l'email est configuré
    if (!isEmailConfigured()) {
      logger.warn(`⚠️  Email non configuré. Impossible d'envoyer l'email à ${to}. Configurez EMAIL_USER, EMAIL_PASSWORD et EMAIL_FROM_EMAIL dans votre .env`);
      return null; // Retourner null au lieu de lancer une erreur
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"${EMAIL.FROM_NAME}" <${EMAIL.FROM_EMAIL}>`,
      to,
      subject,
      html,
      text: text || subject, // Version texte pour les clients qui ne supportent pas HTML
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`✅ Email envoyé à ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    // Si c'est une erreur de configuration, logger un avertissement
    if (error.message && error.message.includes('Configuration email incomplète')) {
      logger.warn(`⚠️  ${error.message}`);
      return null;
    }
    
    // Pour les autres erreurs (connexion, authentification, etc.)
    logger.error(`❌ Erreur lors de l'envoi de l'email à ${to}:`, error.message || error);
    
    // Ne pas faire planter l'application, juste logger l'erreur
    // L'utilisateur peut toujours utiliser l'application même si l'email échoue
    return null;
  }
};

/**
 * Envoyer un email de bienvenue (création de compte)
 */
const sendWelcomeEmail = async (user) => {
  const html = await loadTemplate('welcome', {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    appName: EMAIL.APP_NAME || 'AlloTracteur',
    supportEmail: EMAIL.SUPPORT_EMAIL || EMAIL.FROM_EMAIL,
  });

  return sendEmail(
    user.email,
    `Bienvenue sur ${EMAIL.APP_NAME || 'AlloTracteur'} !`,
    html
  );
};

/**
 * Envoyer un email avec code OTP
 */
const sendOTPEmail = async (email, otpCode, firstName = '') => {
  // Extraire les minutes depuis OTP_EXPIRES_IN (format: "5m" ou "5")
  const expiresIn = process.env.OTP_EXPIRES_IN || '5m';
  const expirationMinutes = expiresIn.replace(/[^0-9]/g, '') || '5';

  const html = await loadTemplate('otp', {
    firstName: firstName || 'Utilisateur',
    otpCode,
    appName: EMAIL.APP_NAME || 'AlloTracteur',
    expirationMinutes,
  });

  return sendEmail(
    email,
    `Votre code de vérification - ${EMAIL.APP_NAME || 'AlloTracteur'}`,
    html
  );
};

/**
 * Envoyer un email de réinitialisation de mot de passe (demande)
 */
const sendPasswordResetRequestEmail = async (user, resetToken) => {
  const resetUrl = `${EMAIL.FRONTEND_URL || process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;
  
  const html = await loadTemplate('password-reset-request', {
    firstName: user.firstName,
    resetUrl,
    appName: EMAIL.APP_NAME || 'AlloTracteur',
    expirationHours: '1',
    supportEmail: EMAIL.SUPPORT_EMAIL || EMAIL.FROM_EMAIL,
  });

  return sendEmail(
    user.email,
    `Réinitialisation de votre mot de passe - ${EMAIL.APP_NAME || 'AlloTracteur'}`,
    html
  );
};

/**
 * Envoyer un email de confirmation de réinitialisation de mot de passe
 */
const sendPasswordResetConfirmationEmail = async (user) => {
  const html = await loadTemplate('password-reset-confirmation', {
    firstName: user.firstName,
    appName: EMAIL.APP_NAME || 'AlloTracteur',
    supportEmail: EMAIL.SUPPORT_EMAIL || EMAIL.FROM_EMAIL,
    frontendUrl: EMAIL.FRONTEND_URL || process.env.FRONTEND_URL || 'http://localhost:3001',
  });

  return sendEmail(
    user.email,
    `Votre mot de passe a été modifié - ${EMAIL.APP_NAME || 'AlloTracteur'}`,
    html
  );
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOTPEmail,
  sendPasswordResetRequestEmail,
  sendPasswordResetConfirmationEmail,
  loadTemplate,
  isEmailConfigured,
};

