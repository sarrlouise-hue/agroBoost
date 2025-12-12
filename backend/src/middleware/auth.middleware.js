const authService = require('../services/auth/auth.service');
const { error } = require('../utils/response');
const { AppError, ERROR_MESSAGES } = require('../utils/errors');

/**
 * Authentifier un utilisateur via un token JWT
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const token = authHeader.substring(7); // Retirer le préfixe 'Bearer '

    const decoded = authService.verifyToken(token);

    // Attacher les informations de l'utilisateur à la requête
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    if (err instanceof AppError) {
      return error(res, err.message, err.statusCode);
    }
    return error(res, ERROR_MESSAGES.UNAUTHORIZED, 401);
  }
};

/**
 * Vérifier si l'utilisateur a le rôle requis
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    if (!roles.includes(req.user.role)) {
      return error(res, ERROR_MESSAGES.FORBIDDEN, 403);
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};

