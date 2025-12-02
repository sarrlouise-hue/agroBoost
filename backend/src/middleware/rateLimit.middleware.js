const rateLimit = require('express-rate-limit');
const { RATE_LIMIT } = require('../config/env');

// Middleware no-op pour les tests
const noOpMiddleware = (req, res, next) => next();

// Limiteur de taux global (désactivé en mode test)
const rateLimiter = process.env.NODE_ENV === 'test'
  ? noOpMiddleware
  : rateLimit({
      windowMs: RATE_LIMIT.WINDOW_MS,
      max: RATE_LIMIT.MAX_REQUESTS,
      message: {
        success: false,
        message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

// Limiteur de taux plus strict pour les endpoints d'authentification (désactivé en mode test)
const authRateLimiter = process.env.NODE_ENV === 'test'
  ? noOpMiddleware
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 requêtes par fenêtre
      message: {
        success: false,
        message: 'Trop de tentatives d\'authentification, veuillez réessayer plus tard.',
      },
    });

module.exports = {
  rateLimiter,
  authRateLimiter,
};

