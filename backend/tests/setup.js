// Charger dotenv AVANT toute autre chose pour s'assurer que les variables d'environnement sont disponibles
require('dotenv').config();

// Configuration globale pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jwt-tokens';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-refresh-tokens';

// Configuration de la base de données de test
// Utiliser la vraie base de données locale pour les tests d'intégration
// S'assurer que le mot de passe est toujours une chaîne (même vide)
const dbPassword = String(process.env.DB_PASSWORD || '');
const dbUser = process.env.DB_USER || 'postgres';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || 5432;
// Utiliser la base de données locale réelle pour les tests d'intégration
const dbName = process.env.DB_NAME || (process.env.NODE_ENV === 'test' ? 'agroboost' : 'agroboost_test');

// Encoder le mot de passe pour l'URL si nécessaire (pour les caractères spéciaux)
const encodedPassword = encodeURIComponent(dbPassword);

// Construire DATABASE_URL en s'assurant que le mot de passe est bien une chaîne
process.env.DATABASE_URL = process.env.DATABASE_URL || process.env.DB_URI || `postgresql://${dbUser}:${encodedPassword}@${dbHost}:${dbPort}/${dbName}`;
process.env.DB_NAME = dbName;
process.env.DB_PASSWORD = dbPassword; // S'assurer que c'est une chaîne
process.env.DB_USER = dbUser;
process.env.DB_HOST = dbHost;
process.env.DB_PORT = dbPort;
process.env.OTP_EXPIRES_IN = '5m';
process.env.OTP_LENGTH = '6';

// Augmenter le timeout pour les tests de base de données
jest.setTimeout(60000); // 60 secondes pour les tests d'intégration avec vraie base de données
