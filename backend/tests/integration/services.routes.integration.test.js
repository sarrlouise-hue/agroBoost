const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes');
const errorMiddleware = require('../../src/middleware/error.middleware');
const User = require('../../src/models/User');
const Provider = require('../../src/models/Provider');
const Service = require('../../src/models/Service');
const { connectTestDB, disconnectTestDB, clearTestDB } = require('../helpers/database');
const authService = require('../../src/services/auth/auth.service');

// Créer une application Express pour les tests
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);
app.use(errorMiddleware);

describe('Routes Services - Tests avec vraie base de données', () => {
  let providerToken;
  let testProvider;
  let testService;
  let userToken;

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
      
      // Créer un prestataire
      const providerData = {
        phoneNumber: `+22177${uniqueSuffix}0`,
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
        isApproved: true,
      });
      
      // Mettre à jour le rôle de l'utilisateur en prestataire
      const providerUserInDB = await User.findByPk(providerUser.id);
      providerUserInDB.role = 'provider';
      await providerUserInDB.save();
      
      // Régénérer le token avec le nouveau rôle
      providerToken = authService.generateToken(providerUserInDB.id, providerUserInDB.role);

      // Créer un service de test
      testService = await Service.create({
        providerId: testProvider.id,
        serviceType: 'tractor',
        name: 'Test Tractor',
        description: 'Test description',
        pricePerHour: 5000,
        pricePerDay: 40000,
        availability: true,
        latitude: 14.7167,
        longitude: -17.4677,
      });

      // Créer un utilisateur normal
      const userData = {
        phoneNumber: `+22177${uniqueSuffix}1`,
        firstName: 'User',
        lastName: 'Test',
        email: `user${timestamp}@example.com`,
        language: 'fr',
      };
      const userRegisterResult = await authService.register(userData);
      userToken = userRegisterResult.token;
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

  describe('POST /api/services', () => {
    it('devrait créer un nouveau service', async () => {
      const serviceData = {
        serviceType: 'semoir',
        name: 'New Semoir Service',
        description: 'New service description',
        pricePerHour: 3000,
        pricePerDay: 25000,
        availability: true,
        latitude: 14.7167,
        longitude: -17.4677,
      };

      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${providerToken}`)
        .send(serviceData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('New Semoir Service');
      expect(response.body.data.serviceType).toBe('semoir');
      // Les valeurs DECIMAL sont retournées comme des chaînes par Sequelize
      expect(parseFloat(response.body.data.pricePerHour)).toBe(3000);

      // Vérifier dans la base de données
      const serviceInDB = await Service.findOne({ where: { name: 'New Semoir Service' } });
      expect(serviceInDB).toBeTruthy();
      expect(serviceInDB.providerId).toBe(testProvider.id);
    });

    it('devrait échouer si l\'utilisateur n\'est pas prestataire', async () => {
      const serviceData = {
        serviceType: 'tractor',
        name: 'Test Service',
        pricePerHour: 5000,
      };

      await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${userToken}`)
        .send(serviceData)
        .expect(403);
    });

    it('devrait échouer avec des données invalides', async () => {
      const invalidData = {
        serviceType: 'invalid', // Type invalide
        name: 'A', // Trop court
      };

      await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${providerToken}`)
        .send(invalidData)
        .expect(400);
    });
  });

  describe('GET /api/services/:id', () => {
    it('devrait récupérer un service par ID', async () => {
      const response = await request(app)
        .get(`/api/services/${testService.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testService.id);
      expect(response.body.data.name).toBe('Test Tractor');
      expect(response.body.data.provider).toBeTruthy();
    });

    it('devrait échouer si le service n\'existe pas', async () => {
      await request(app)
        .get('/api/services/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('GET /api/services', () => {
    it('devrait récupérer tous les services', async () => {
      const response = await request(app)
        .get('/api/services')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('devrait filtrer par type de service', async () => {
      const response = await request(app)
        .get('/api/services?serviceType=tractor')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((service) => {
        expect(service.serviceType).toBe('tractor');
      });
    });

    it('devrait filtrer par disponibilité', async () => {
      const response = await request(app)
        .get('/api/services?availability=true')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((service) => {
        expect(service.availability).toBe(true);
      });
    });

    it('devrait filtrer par prix', async () => {
      const response = await request(app)
        .get('/api/services?minPrice=1000&maxPrice=10000')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((service) => {
        if (service.pricePerHour) {
          // Les valeurs DECIMAL sont retournées comme des chaînes par Sequelize
          const price = parseFloat(service.pricePerHour);
          expect(price).toBeGreaterThanOrEqual(1000);
          expect(price).toBeLessThanOrEqual(10000);
        }
      });
    });

    it('devrait rechercher par proximité géographique', async () => {
      const response = await request(app)
        .get('/api/services?latitude=14.7167&longitude=-17.4677&radius=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/services/my-services', () => {
    it('devrait récupérer les services du prestataire connecté', async () => {
      const response = await request(app)
        .get('/api/services/my-services')
        .set('Authorization', `Bearer ${providerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      response.body.data.forEach((service) => {
        expect(service.providerId).toBe(testProvider.id);
      });
    });
  });

  describe('PUT /api/services/:id', () => {
    it('devrait mettre à jour un service', async () => {
      const updateData = {
        name: 'Updated Service Name',
        pricePerHour: 6000,
      };

      const response = await request(app)
        .put(`/api/services/${testService.id}`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Service Name');
      // Les valeurs DECIMAL sont retournées comme des chaînes par Sequelize
      expect(parseFloat(response.body.data.pricePerHour)).toBe(6000);

      // Vérifier dans la base de données
      const serviceInDB = await Service.findByPk(testService.id);
      expect(serviceInDB.name).toBe('Updated Service Name');
      // Les valeurs DECIMAL sont retournées comme des chaînes par Sequelize
      expect(parseFloat(serviceInDB.pricePerHour)).toBe(6000);
    });

    it('devrait échouer si le service n\'appartient pas au prestataire', async () => {
      // Créer un autre prestataire et service
      const otherProvider = await Provider.create({
        userId: (await User.create({
          phoneNumber: '+221771234999',
          firstName: 'Other',
          lastName: 'Provider',
        })).id,
        businessName: 'Other Provider',
        isApproved: true,
      });

      const otherService = await Service.create({
        providerId: otherProvider.id,
        serviceType: 'tractor',
        name: 'Other Service',
        pricePerHour: 5000,
      });

      await request(app)
        .put(`/api/services/${otherService.id}`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send({ name: 'Updated' })
        .expect(403);
    });
  });

  describe('PUT /api/services/:id/availability', () => {
    it('devrait mettre à jour la disponibilité d\'un service', async () => {
      const updateData = {
        availability: false,
      };

      const response = await request(app)
        .put(`/api/services/${testService.id}/availability`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.availability).toBe(false);

      // Vérifier dans la base de données
      const serviceInDB = await Service.findByPk(testService.id);
      expect(serviceInDB.availability).toBe(false);
    });
  });

  describe('DELETE /api/services/:id', () => {
    it('devrait supprimer un service', async () => {
      const response = await request(app)
        .delete(`/api/services/${testService.id}`)
        .set('Authorization', `Bearer ${providerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Vérifier que le service n'existe plus dans la base de données
      const serviceInDB = await Service.findByPk(testService.id);
      expect(serviceInDB).toBeNull();
    });
  });
});

