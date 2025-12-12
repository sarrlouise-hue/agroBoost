const logger = require('../utils/logger');
const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

const errorMiddleware = (err, req, res, next) => {
  // Logger l'erreur
  logger.error('Erreur:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Erreur par défaut
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erreur interne du serveur';

  // Erreurs de validation Sequelize
  if (err instanceof ValidationError) {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(', ');
  }

  // Erreur de contrainte unique Sequelize
  if (err instanceof UniqueConstraintError) {
    statusCode = 409;
    const field = err.errors[0]?.path || 'champ';
    message = `La ressource existe déjà avec ce ${field}`;
  }

  // Erreur de contrainte de clé étrangère Sequelize
  if (err instanceof ForeignKeyConstraintError) {
    statusCode = 400;
    message = 'Référence invalide dans la base de données';
  }

  // Erreur Sequelize DatabaseError (ex: connexion, syntaxe SQL)
  if (err.name === 'SequelizeDatabaseError') {
    statusCode = 500;
    message = 'Erreur de base de données';
  }

  // Erreur Sequelize ConnectionError
  if (err.name === 'SequelizeConnectionError') {
    statusCode = 503;
    message = 'Impossible de se connecter à la base de données';
  }

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token invalide';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expiré';
  }

  // Envoyer la réponse d'erreur
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;
