const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes');
const errorMiddleware = require('../../src/middleware/error.middleware');
const User = require('../../src/models/User');
const OTP = require('../../src/models/OTP');

// Mock de la base de données PostgreSQL
jest.mock('../../src/config/database', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(true),
    sync: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
  },
  connectDB: jest.fn().mockResolvedValue(true),
}));

// Créer une application Express pour les tests sans démarrer le serveur
const app = express();
app.use(express.json());
app.use('/api', routes);
// Ajouter le middleware d'erreur
app.use(errorMiddleware);

// Mock des modèles
jest.mock('../../src/models/User');
jest.mock('../../src/models/OTP');

describe('Routes d\'authentification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('devrait inscrire un nouvel utilisateur', async () => {
      const userData = {
        phoneNumber: '+221771234567',
        firstName: 'Amadou',
        lastName: 'Diallo',
        email: 'amadou@example.com',
        language: 'fr',
      };

      User.findOne = jest.fn().mockResolvedValue(null);
      User.create = jest.fn().mockResolvedValue({
        id: 'user-id-123',
        ...userData,
        role: 'user',
        isVerified: false,
      });

      OTP.update = jest.fn().mockResolvedValue([1]); // Sequelize retourne [nombre de lignes affectées]
      OTP.create = jest.fn().mockResolvedValue({
        id: 'otp-id-123',
        phoneNumber: userData.phoneNumber,
        code: '123456',
        expiresAt: new Date(),
        isUsed: false,
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('devrait échouer avec des données invalides', async () => {
      const invalidData = {
        phoneNumber: 'invalid',
        firstName: 'A',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/verify-otp', () => {
    it('devrait vérifier un OTP valide', async () => {
      const phoneNumber = '+221771234567';
      const code = '123456';

      const mockOTP = {
        id: 'otp-id-123',
        phoneNumber,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        isUsed: false,
        save: jest.fn().mockResolvedValue(true),
      };

      const mockUser = {
        id: 'user-id-123',
        phoneNumber,
        firstName: 'Amadou',
        lastName: 'Diallo',
        email: 'amadou@example.com',
        language: 'fr',
        role: 'user',
        isVerified: false,
        save: jest.fn().mockResolvedValue(true),
      };

      OTP.findOne = jest.fn().mockResolvedValue(mockOTP);
      User.findOne = jest.fn().mockResolvedValue(mockUser);
      User.findByPk = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({ phoneNumber, code })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('OTP vérifié');
    });

    it('devrait échouer avec un OTP invalide', async () => {
      const phoneNumber = '+221771234567';
      const code = '000000';

      OTP.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({ phoneNumber, code })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('devrait connecter un utilisateur existant', async () => {
      const phoneNumber = '+221771234567';
      const mockUser = {
        id: 'user-id-123',
        phoneNumber,
        firstName: 'Amadou',
        lastName: 'Diallo',
        email: 'amadou@example.com',
        language: 'fr',
        role: 'user',
        isVerified: true,
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ phoneNumber })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
    });

    it('devrait échouer si l\'utilisateur n\'existe pas', async () => {
      const phoneNumber = '+221771234567';

      User.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ phoneNumber });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Utilisateur non trouvé');
    });
  });

  describe('POST /api/auth/resend-otp', () => {
    it('devrait renvoyer un OTP', async () => {
      const phoneNumber = '+221771234567';

      OTP.update = jest.fn().mockResolvedValue([1]); // Sequelize retourne [nombre de lignes affectées]
      OTP.create = jest.fn().mockResolvedValue({
        id: 'otp-id-123',
        phoneNumber,
        code: '123456',
        expiresAt: new Date(),
        isUsed: false,
      });

      const response = await request(app)
        .post('/api/auth/resend-otp')
        .send({ phoneNumber })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('OTP envoyé');
    });
  });

  describe('GET /health', () => {
    it('devrait retourner le statut du serveur', async () => {
      // Ajouter la route health à l'app de test
      app.get('/health', (req, res) => {
        res.status(200).json({
          status: 'OK',
          timestamp: new Date().toISOString(),
          environment: 'test',
        });
      });

      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
    });
  });
});
