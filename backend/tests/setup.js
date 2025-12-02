// Configuration globale pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jwt-tokens';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-refresh-tokens';
process.env.DATABASE_URL = process.env.DATABASE_URL || process.env.DB_URI || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'agroboost_test'}`;
process.env.DB_NAME = 'agroboost_test';
process.env.OTP_EXPIRES_IN = '5m';
process.env.OTP_LENGTH = '6';

// Augmenter le timeout pour les tests de base de données
jest.setTimeout(30000);
