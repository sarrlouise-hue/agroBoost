/**
 * Classe d'erreur personnalisée
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Messages d'erreur communs
 */
const ERROR_MESSAGES = {
  NOT_FOUND: 'Ressource non trouvée',
  UNAUTHORIZED: 'Accès non autorisé',
  FORBIDDEN: 'Accès interdit',
  VALIDATION_ERROR: 'Erreur de validation',
  INTERNAL_ERROR: 'Erreur interne du serveur',
  DUPLICATE_ENTRY: 'La ressource existe déjà',
  INVALID_CREDENTIALS: 'Identifiants invalides',
  TOKEN_EXPIRED: 'Token expiré',
  INVALID_TOKEN: 'Token invalide',
};

module.exports = {
  AppError,
  ERROR_MESSAGES,
};

