require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,

  // Database PostgreSQL
  DB: {
    URI: process.env.DATABASE_URL || process.env.DB_URI || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'agroboost'}`,
    HOST: process.env.DB_HOST || '127.0.0.1',
    PORT: process.env.DB_PORT || 5432,
    USER: process.env.DB_USER || 'postgres',
    PASSWORD: process.env.DB_PASSWORD || '',
    NAME: process.env.DB_NAME || 'agroboost',
  },

  // JWT
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your-secret-key',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // OTP
  OTP: {
    EXPIRES_IN: process.env.OTP_EXPIRES_IN || '5m',
    LENGTH: parseInt(process.env.OTP_LENGTH, 10) || 6,
  },

  // Redis
  REDIS: {
    URL: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  // Mobile Money
  WAVE: {
    API_KEY: process.env.WAVE_API_KEY || '',
    API_SECRET: process.env.WAVE_API_SECRET || '',
    BASE_URL: process.env.WAVE_BASE_URL || 'https://api.wave.com',
  },

  ORANGE_MONEY: {
    API_KEY: process.env.ORANGE_MONEY_API_KEY || '',
    API_SECRET: process.env.ORANGE_MONEY_API_SECRET || '',
    BASE_URL: process.env.ORANGE_MONEY_BASE_URL || '',
  },

  FREE_MONEY: {
    API_KEY: process.env.FREE_MONEY_API_KEY || '',
    API_SECRET: process.env.FREE_MONEY_API_SECRET || '',
    BASE_URL: process.env.FREE_MONEY_BASE_URL || '',
  },

  // Google Maps
  GOOGLE_MAPS: {
    API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
  },

  // Firebase
  FIREBASE: {
    SERVER_KEY: process.env.FIREBASE_SERVER_KEY || '',
    PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  },

  // SMS
  SMS: {
    API_KEY: process.env.SMS_API_KEY || '',
    API_URL: process.env.SMS_API_URL || '',
    SENDER_ID: process.env.SMS_SENDER_ID || '',
  },

  // AWS S3
  AWS: {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    BUCKET_NAME: process.env.AWS_BUCKET_NAME || '',
    REGION: process.env.AWS_REGION || 'us-east-1',
  },

  // File Upload
  UPLOAD: {
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880, // 5MB
    PATH: process.env.UPLOAD_PATH || './uploads',
  },

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutes
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  // URLs
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
  ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:3002',
};

