const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes');
const errorMiddleware = require('../../src/middleware/error.middleware');
const User = require('../../src/models/User');
const Provider = require('../../src/models/Provider');
const Service = require('../../src/models/Service');
const Maintenance = require('../../src/models/Maintenance');
const { connectTestDB, disconnectTestDB, clearTestDB } = require('../helpers/database');
const authService = require('../../src/services/auth/auth.service');
const { MAINTENANCE_STATUS } = require('../../src/config/constants');

// Créer une application Express pour les tests
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);
app.use(errorMiddleware);

describe('Routes Maintenances - Tests avec vraie base de données', () => {
  let providerToken;
  let testProvider;
  let testService;
  let mechanicUser;
  let mechanicToken;

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
      });

      // Créer un mécanicien
      const mechanicData = {
        phoneNumber: `+22177${uniqueSuffix}1`,
        firstName: 'Mécanicien',
        lastName: 'Test',
        email: `mechanic${timestamp}@example.com`,
        language: 'fr',
      };
      const mechanicRegisterResult = await authService.register(mechanicData);
      mechanicUser = mechanicRegisterResult.user;
      mechanicToken = authService.generateToken(mechanicUser.id, mechanicUser.role);
    } catch (error) {
      if (error.message === 'DATABASE_NOT_CONFIGURED') {
        console.warn('⚠️  Tests d\'intégration ignorés: base de données non configurée');
        return;
      }
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await disconnectTestDB();
    } catch (error) {
      // Ignorer les erreurs de déconnexion
    }
  });

  describe('POST /api/maintenances', () => {
    it('devrait créer une maintenance avec succès', async () => {
      const maintenanceData = {
        serviceId: testService.id,
        mechanicId: mechanicUser.id,
        startDate: new Date('2025-01-15T08:00:00Z').toISOString(),
        endDate: new Date('2025-01-15T17:00:00Z').toISOString(),
        description: 'Révision complète du tracteur',
        cost: 50000,
        notes: 'Changement d\'huile et filtres',
      };

      const response = await request(app)
        .post('/api/maintenances')
        .set('Authorization', `Bearer ${providerToken}`)
        .send(maintenanceData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.serviceId).toBe(testService.id);
      expect(response.body.data.mechanicId).toBe(mechanicUser.id);
      expect(response.body.data.status).toBe(MAINTENANCE_STATUS.PENDING);
      expect(response.body.data.description).toBe(maintenanceData.description);
    });

    it('devrait échouer sans authentification', async () => {
      const maintenanceData = {
        serviceId: testService.id,
        mechanicId: mechanicUser.id,
        startDate: new Date('2025-01-15T08:00:00Z').toISOString(),
      };

      await request(app)
        .post('/api/maintenances')
        .send(maintenanceData)
        .expect(401);
    });

    it('devrait échouer avec des données invalides', async () => {
      const maintenanceData = {
        serviceId: 'invalid-id',
        mechanicId: mechanicUser.id,
        startDate: 'invalid-date',
      };

      const response = await request(app)
        .post('/api/maintenances')
        .set('Authorization', `Bearer ${providerToken}`)
        .send(maintenanceData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/maintenances', () => {
    it('devrait récupérer toutes les maintenances', async () => {
      // Créer quelques maintenances de test
      const maintenance1 = await Maintenance.create({
        serviceId: testService.id,
        mechanicId: mechanicUser.id,
        startDate: new Date('2025-01-15T08:00:00Z'),
        status: MAINTENANCE_STATUS.PENDING,
      });

      const maintenance2 = await Maintenance.create({
        serviceId: testService.id,
        mechanicId: mechanicUser.id,
        startDate: new Date('2025-01-16T08:00:00Z'),
        status: MAINTENANCE_STATUS.IN_PROGRESS,
      });

      const response = await request(app)
        .get('/api/maintenances')
        .set('Authorization', `Bearer ${providerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      expect(response.body.pagination).toBeDefined();
    });

    it('devrait filtrer par statut', async () => {
      await Maintenance.create({
        serviceId: testService.id,
        mechanicId: mechanicUser.id,
        startDate: new Date('2025-01-15T08:00:00Z'),
        status: MAINTENANCE_STATUS.PENDING,
      });

      await Maintenance.create({
        serviceId: testService.id,
        mechanicId: mechanicUser.id,
        startDate: new Date('2025-01-16T08:00:00Z'),
        status: MAINTENANCE_STATUS.COMPLETED,
      });

      const response = await request(app)
        .get('/api/maintenances?status=pending')
        .set('Authorization', `Bearer ${providerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((maintenance) => {
        expect(maintenance.status).toBe(MAINTENANCE_STATUS.PENDING);
      });
    });
  });

  describe('GET /api/maintenances/:id', () => {
    it('devrait récupérer une maintenance par ID', async () => {
      const maintenance = await Maintenance.create({
        serviceId: testService.id,
        mechanicId: mechanicUser.id,
        startDate: new Date('2025-01-15T08:00:00Z'),
        description: 'Test maintenance',
        status: MAINTENANCE_STATUS.PENDING,
      });

      const response = await request(app)
        .get(`/api/maintenances/${maintenance.id}`)
        .set('Authorization', `Bearer ${providerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(maintenance.id);
      expect(response.body.data.description).toBe('Test maintenance');
    });

    it('devrait retourner 404 pour une maintenance inexistante', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app)
        .get(`/api/maintenances/${fakeId}`)
        .set('Authorization', `Bearer ${providerToken}`)
        .expect(404);
    });
  });

  describe('PUT /api/maintenances/:id', () => {
    it('devrait mettre à jour une maintenance', async () => {
      const maintenance = await Maintenance.create({
        serviceId: testService.id,
        mechanicId: mechanicUser.id,
        startDate: new Date('2025-01-15T08:00:00Z'),
        status: MAINTENANCE_STATUS.PENDING,
      });

      const updateData = {
        description: 'Description mise à jour',
        cost: 60000,
      };

      const response = await request(app)
        .put(`/api/maintenances/${maintenance.id}`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.description).toBe(updateData.description);
      expect(parseFloat(response.body.data.cost)).toBe(60000);
    });
  });

  describe('POST /api/maintenances/:id/start', () => {
    it('devrait démarrer une maintenance', async () => {
      const maintenance = await Maintenance.create({
        serviceId: testService.id,
        mechanicId: mechanicUser.id,
        startDate: new Date('2025-01-15T08:00:00Z'),
        status: MAINTENANCE_STATUS.PENDING,
      });

      const response = await request(app)
        .post(`/api/maintenances/${maintenance.id}/start`)
        .set('Authorization', `Bearer ${providerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(MAINTENANCE_STATUS.IN_PROGRESS);
    });
  });

  describe('POST /api/maintenances/:id/complete', () => {
    it('devrait compléter une maintenance', async () => {
      const startDate = new Date('2025-01-15T08:00:00Z');
      const maintenance = await Maintenance.create({
        serviceId: testService.id,
        mechanicId: mechanicUser.id,
        startDate,
        status: MAINTENANCE_STATUS.IN_PROGRESS,
      });

      const completeData = {
        endDate: new Date('2025-01-15T17:00:00Z').toISOString(),
        cost: 50000,
        notes: 'Maintenance terminée avec succès',
      };

      const response = await request(app)
        .post(`/api/maintenances/${maintenance.id}/complete`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send(completeData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(MAINTENANCE_STATUS.COMPLETED);
      expect(response.body.data.endDate).toBeDefined();
      expect(response.body.data.duration).toBeDefined();
    });
  });

  describe('GET /api/maintenances/service/:serviceId', () => {
    it('devrait récupérer les maintenances d\'un service', async () => {
      await Maintenance.create({
        serviceId: testService.id,
        mechanicId: mechanicUser.id,
        startDate: new Date('2025-01-15T08:00:00Z'),
        status: MAINTENANCE_STATUS.PENDING,
      });

      const response = await request(app)
        .get(`/api/maintenances/service/${testService.id}`)
        .set('Authorization', `Bearer ${providerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      response.body.data.forEach((maintenance) => {
        expect(maintenance.serviceId).toBe(testService.id);
      });
    });
  });

  describe('GET /api/maintenances/mechanic/:mechanicId', () => {
    it('devrait récupérer les maintenances d\'un mécanicien', async () => {
      await Maintenance.create({
        serviceId: testService.id,
        mechanicId: mechanicUser.id,
        startDate: new Date('2025-01-15T08:00:00Z'),
        status: MAINTENANCE_STATUS.PENDING,
      });

      const response = await request(app)
        .get(`/api/maintenances/mechanic/${mechanicUser.id}`)
        .set('Authorization', `Bearer ${providerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      response.body.data.forEach((maintenance) => {
        expect(maintenance.mechanicId).toBe(mechanicUser.id);
      });
    });
  });

  describe('DELETE /api/maintenances/:id', () => {
    it('devrait supprimer une maintenance en attente', async () => {
      const maintenance = await Maintenance.create({
        serviceId: testService.id,
        mechanicId: mechanicUser.id,
        startDate: new Date('2025-01-15T08:00:00Z'),
        status: MAINTENANCE_STATUS.PENDING,
      });

      const response = await request(app)
        .delete(`/api/maintenances/${maintenance.id}`)
        .set('Authorization', `Bearer ${providerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Vérifier que la maintenance a été supprimée
      const deletedMaintenance = await Maintenance.findByPk(maintenance.id);
      expect(deletedMaintenance).toBeNull();
    });

    it('devrait échouer si la maintenance est en cours', async () => {
      const maintenance = await Maintenance.create({
        serviceId: testService.id,
        mechanicId: mechanicUser.id,
        startDate: new Date('2025-01-15T08:00:00Z'),
        status: MAINTENANCE_STATUS.IN_PROGRESS,
      });

      await request(app)
        .delete(`/api/maintenances/${maintenance.id}`)
        .set('Authorization', `Bearer ${providerToken}`)
        .expect(400);
    });
  });
});

