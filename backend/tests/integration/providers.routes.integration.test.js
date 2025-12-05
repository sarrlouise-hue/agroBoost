const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes');
const errorMiddleware = require('../../src/middleware/error.middleware');
const User = require('../../src/models/User');
const Provider = require('../../src/models/Provider');
const { connectTestDB, disconnectTestDB, clearTestDB } = require('../helpers/database');
const authService = require('../../src/services/auth/auth.service');

// Créer une application Express pour les tests
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);
app.use(errorMiddleware);

describe('Routes Prestataires - Tests avec vraie base de données', () => {
  let userToken;
  let providerToken;
  let testUser;
  let testProvider;
  let adminToken;
  let adminUser;

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
      
      // Utiliser des numéros de téléphone uniques pour chaque test
      const timestamp = Date.now();
      const uniqueSuffix = timestamp.toString().slice(-6);
      
      // Créer un utilisateur normal
      const userData = {
        phoneNumber: `+22177${uniqueSuffix}0`,
        firstName: 'Test',
        lastName: 'User',
        email: `test${timestamp}@example.com`,
        language: 'fr',
      };
      const registerResult = await authService.register(userData);
      testUser = registerResult.user;
      userToken = registerResult.token;

      // Créer un prestataire
      const providerData = {
        phoneNumber: `+22177${uniqueSuffix}1`,
        firstName: 'Provider',
        lastName: 'Test',
        email: `provider${timestamp}@example.com`,
        language: 'fr',
      };
      const providerRegisterResult = await authService.register(providerData);
      const providerUser = providerRegisterResult.user;
      providerToken = providerRegisterResult.token;

      // Créer le profil prestataire
      testProvider = await Provider.create({
        userId: providerUser.id,
        businessName: 'Test Provider Business',
        description: 'Test description',
        documents: ['doc1.pdf'],
        isApproved: true,
      });
      
      // Mettre à jour le rôle de l'utilisateur en prestataire
      const providerUserInDB = await User.findByPk(providerUser.id);
      providerUserInDB.role = 'provider';
      await providerUserInDB.save();
      
      // Régénérer le token avec le nouveau rôle
      providerToken = authService.generateToken(providerUserInDB.id, providerUserInDB.role);

      // Créer un admin
      const adminData = {
        phoneNumber: `+22177${uniqueSuffix}2`,
        firstName: 'Admin',
        lastName: 'Test',
        email: `admin${timestamp}@example.com`,
        language: 'fr',
      };
      const adminRegisterResult = await authService.register(adminData);
      adminUser = adminRegisterResult.user;
      
      // Mettre à jour le rôle de l'utilisateur admin
      const adminUserInDB = await User.findByPk(adminUser.id);
      adminUserInDB.role = 'admin';
      await adminUserInDB.save();
      
      // Régénérer le token avec le nouveau rôle
      adminToken = authService.generateToken(adminUserInDB.id, adminUserInDB.role);
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

  describe('POST /api/providers/register', () => {
    it('devrait inscrire un nouveau prestataire', async () => {
      const providerData = {
        businessName: 'New Provider Business',
        description: 'New provider description',
        documents: ['doc1.pdf', 'doc2.pdf'],
      };

      const response = await request(app)
        .post('/api/providers/register')
        .set('Authorization', `Bearer ${userToken}`)
        .send(providerData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.businessName).toBe('New Provider Business');
      expect(response.body.data.isApproved).toBe(false);

      // Vérifier dans la base de données
      const providerInDB = await Provider.findOne({ where: { userId: testUser.id } });
      expect(providerInDB).toBeTruthy();
      expect(providerInDB.businessName).toBe('New Provider Business');
    });

    it('devrait échouer si l\'utilisateur est déjà prestataire', async () => {
      // Créer un prestataire pour cet utilisateur
      await Provider.create({
        userId: testUser.id,
        businessName: 'Existing Provider',
        description: 'Existing',
      });

      const providerData = {
        businessName: 'New Provider Business',
      };

      await request(app)
        .post('/api/providers/register')
        .set('Authorization', `Bearer ${userToken}`)
        .send(providerData)
        .expect(400);
    });
  });

  describe('GET /api/providers/profile', () => {
    it('devrait récupérer le profil du prestataire connecté', async () => {
      const response = await request(app)
        .get('/api/providers/profile')
        .set('Authorization', `Bearer ${providerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.businessName).toBe('Test Provider Business');
      expect(response.body.data.isApproved).toBe(true);
    });

    it('devrait échouer pour un utilisateur non prestataire', async () => {
      await request(app)
        .get('/api/providers/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('GET /api/providers/:id', () => {
    it('devrait récupérer le profil d\'un prestataire par ID', async () => {
      const response = await request(app)
        .get(`/api/providers/${testProvider.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testProvider.id);
      expect(response.body.data.businessName).toBe('Test Provider Business');
    });

    it('devrait échouer si le prestataire n\'existe pas', async () => {
      await request(app)
        .get('/api/providers/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('PUT /api/providers/profile', () => {
    it('devrait mettre à jour le profil du prestataire', async () => {
      const updateData = {
        businessName: 'Updated Business Name',
        description: 'Updated description',
      };

      const response = await request(app)
        .put('/api/providers/profile')
        .set('Authorization', `Bearer ${providerToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.businessName).toBe('Updated Business Name');

      // Vérifier dans la base de données
      const providerInDB = await Provider.findByPk(testProvider.id);
      expect(providerInDB.businessName).toBe('Updated Business Name');
    });
  });

  describe('GET /api/providers', () => {
    it('devrait récupérer tous les prestataires', async () => {
      const response = await request(app)
        .get('/api/providers')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('devrait filtrer par statut d\'approbation', async () => {
      const response = await request(app)
        .get('/api/providers?isApproved=true')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((provider) => {
        expect(provider.isApproved).toBe(true);
      });
    });
  });

  describe('PUT /api/providers/:id/approve', () => {
    it('devrait approuver un prestataire (admin seulement)', async () => {
      // Créer un prestataire non approuvé
      const newProvider = await Provider.create({
        userId: testUser.id,
        businessName: 'Unapproved Provider',
        isApproved: false,
      });

      const response = await request(app)
        .put(`/api/providers/${newProvider.id}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Vérifier dans la base de données
      const providerInDB = await Provider.findByPk(newProvider.id);
      expect(providerInDB.isApproved).toBe(true);
    });

    it('devrait échouer si l\'utilisateur n\'est pas admin', async () => {
      await request(app)
        .put(`/api/providers/${testProvider.id}/approve`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
});

