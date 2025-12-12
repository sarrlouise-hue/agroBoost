const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes');
const errorMiddleware = require('../../src/middleware/error.middleware');
const User = require('../../src/models/User');
const { connectTestDB, disconnectTestDB, clearTestDB } = require('../helpers/database');
const authService = require('../../src/services/auth/auth.service');

// Créer une application Express pour les tests
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);
app.use(errorMiddleware);

describe('Routes Utilisateurs - Tests avec vraie base de données', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    try {
      await connectTestDB();
    } catch (error) {
      if (error.message === 'DATABASE_NOT_CONFIGURED' || error.message.includes('password must be a string') || error.message.includes('SASL')) {
        console.warn('⚠️  Tests d\'intégration ignorés: base de données non configurée');
        return;
      }
      throw error;
    }
  });

  beforeEach(async () => {
    try {
      await clearTestDB();
      
      // Utiliser un numéro de téléphone unique pour chaque test (avec timestamp)
      const uniquePhone = `+22177${Date.now().toString().slice(-6)}`;
      
      // Créer un utilisateur de test et obtenir un token
      const userData = {
        phoneNumber: uniquePhone,
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
        language: 'fr',
      };
      
      const registerResult = await authService.register(userData);
      testUser = registerResult.user;
      authToken = registerResult.token;
    } catch (error) {
      if (error.message !== 'DATABASE_NOT_CONFIGURED') {
        throw error;
      }
    }
  });

  afterAll(async () => {
    try {
      await disconnectTestDB();
    } catch (error) {
      // Ignorer les erreurs de déconnexion
    }
  });

  describe('GET /api/users/profile', () => {
    it('devrait récupérer le profil de l\'utilisateur connecté', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.phoneNumber).toBe(testUser.phoneNumber);
      expect(response.body.data.firstName).toBe('Test');
      expect(response.body.data.lastName).toBe('User');
    });

    it('devrait échouer sans token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('devrait mettre à jour le profil de l\'utilisateur', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com',
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe('Updated');
      expect(response.body.data.lastName).toBe('Name');
      expect(response.body.data.email).toBe('updated@example.com');

      // Vérifier dans la base de données
      const userInDB = await User.findByPk(testUser.id);
      expect(userInDB.firstName).toBe('Updated');
      expect(userInDB.lastName).toBe('Name');
    });
  });

  describe('PUT /api/users/location', () => {
    it('devrait mettre à jour la localisation de l\'utilisateur', async () => {
      const locationData = {
        latitude: 14.7167,
        longitude: -17.4677,
        address: 'Dakar, Sénégal',
      };

      const response = await request(app)
        .put('/api/users/location')
        .set('Authorization', `Bearer ${authToken}`)
        .send(locationData)
        .expect(200);

      expect(response.body.success).toBe(true);
      // Les valeurs DECIMAL sont retournées comme des chaînes par Sequelize
      expect(parseFloat(response.body.data.latitude)).toBeCloseTo(14.7167, 4);
      expect(parseFloat(response.body.data.longitude)).toBeCloseTo(-17.4677, 4);
      expect(response.body.data.address).toBe('Dakar, Sénégal');

      // Vérifier dans la base de données
      const userInDB = await User.findByPk(testUser.id);
      expect(parseFloat(userInDB.latitude)).toBe(14.7167);
      expect(parseFloat(userInDB.longitude)).toBe(-17.4677);
    });

    it('devrait échouer avec des coordonnées invalides', async () => {
      const invalidLocation = {
        latitude: 100, // Invalide (> 90)
        longitude: -17.4677,
      };

      await request(app)
        .put('/api/users/location')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidLocation)
        .expect(400);
    });
  });

  describe('PUT /api/users/language', () => {
    it('devrait changer la langue de l\'utilisateur', async () => {
      const languageData = {
        language: 'wolof',
      };

      const response = await request(app)
        .put('/api/users/language')
        .set('Authorization', `Bearer ${authToken}`)
        .send(languageData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.language).toBe('wolof');

      // Vérifier dans la base de données
      const userInDB = await User.findByPk(testUser.id);
      expect(userInDB.language).toBe('wolof');
    });

    it('devrait échouer avec une langue invalide', async () => {
      const invalidLanguage = {
        language: 'english', // Invalide
      };

      await request(app)
        .put('/api/users/language')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidLanguage)
        .expect(400);
    });
  });
});

