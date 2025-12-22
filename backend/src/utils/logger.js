const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { NODE_ENV } = require('../config/env');

// Détecter si on est sur Vercel (serverless)
const isVercel = process.env.VERCEL === '1';

// Définir le format des logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Format console pour le développement
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Créer les transports
const transports = [];

// Transport console (toujours activé)
transports.push(
  new winston.transports.Console({
    format: NODE_ENV === 'development' ? consoleFormat : logFormat,
  })
);

// Transports fichiers (uniquement en production et pas sur Vercel)
// Sur Vercel, le système de fichiers est en lecture seule, on utilise uniquement la console
if (NODE_ENV === 'production' && !isVercel) {
  // Fichier de log des erreurs
  transports.push(
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      format: logFormat,
      maxSize: '20m',
      maxFiles: '14d',
    })
  );

  // Fichier de log combiné
  transports.push(
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      format: logFormat,
      maxSize: '20m',
      maxFiles: '14d',
    })
  );
}

// Créer le logger
const logger = winston.createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports,
  exitOnError: false,
});

module.exports = logger;

