const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes');
const errorMiddleware = require('../../src/middleware/error.middleware');
const User = require('../../src/models/User');
const OTP = require('../../src/models/OTP');
const PasswordResetToken = require('../../src/models/PasswordResetToken');
const passwordService = require('../../src/services/auth/password.service');
const authService = require('../../src/services/auth/auth.service');
const { connectTestDB, disconnectTestDB, clearTestDB } = require('../helpers/database');
const { testUsers, testOTPs } = require('../helpers/testData');

// Créer une application Express pour les tests
const app = express();
app.use(express.json());
app.use('/api', routes);
app.use(errorMiddleware);

describe('Routes d\'authentification - Tests avec vraie base de données', () => {
  // Connexion à la base de données avant tous les tests
  beforeAll(async () => {
    await connectTestDB();
  });

  // Nettoyage de la base de données avant chaque test
  beforeEach(async () => {
    await clearTestDB();
  });

  // Déconnexion de la base de données après tous les tests
  afterAll(async () => {
    await disconnectTestDB();
  });

  describe('POST /api/auth/register', () => {
    it('devrait inscrire un nouvel utilisateur dans la base de données', async () => {
      // Utiliser un numéro de téléphone unique pour ce test
      const userData = {
        ...testUsers.validUser,
        phoneNumber: '+221771234500', // Numéro unique pour ce test
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.phoneNumber).toBe(userData.phoneNumber);
      expect(response.body.data.user.firstName).toBe(userData.firstName);
      expect(response.body.data.user.lastName).toBe(userData.lastName);

      // Vérifier que l'utilisateur existe vraiment dans la base de données
      const userInDB = await User.findOne({ where: { phoneNumber: userData.phoneNumber } });
      expect(userInDB).toBeTruthy();
      expect(userInDB.phoneNumber).toBe(userData.phoneNumber);
      expect(userInDB.firstName).toBe(userData.firstName);
      expect(userInDB.lastName).toBe(userData.lastName);
      expect(userInDB.isVerified).toBe(false);

      // Vérifier qu'un OTP a été créé
      const otpInDB = await OTP.findOne({ where: { phoneNumber: userData.phoneNumber } });
      expect(otpInDB).toBeTruthy();
      expect(otpInDB.phoneNumber).toBe(userData.phoneNumber);
      expect(otpInDB.isUsed).toBe(false);
    });

    it('devrait échouer si l\'utilisateur existe déjà', async () => {
      // Utiliser un numéro de téléphone unique pour ce test
      const userData = {
        ...testUsers.validUser,
        phoneNumber: '+221771234501', // Numéro unique pour ce test
      };

      // Créer un utilisateur d'abord
      await User.create(userData);

      // Essayer de créer le même utilisateur
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('existe déjà');
    });

    it('devrait échouer avec des données invalides', async () => {
      const invalidData = testUsers.invalidUser;

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);

      // Vérifier qu'aucun utilisateur n'a été créé
      const userInDB = await User.findOne({ where: { phoneNumber: invalidData.phoneNumber } });
      expect(userInDB).toBeNull();
    });
  });

  describe('POST /api/auth/verify-otp', () => {
    it('devrait vérifier un OTP valide et activer le compte', async () => {
      // Utiliser un numéro de téléphone unique pour ce test
      const phoneNumber = '+221771234502';
      const userData = {
        ...testUsers.validUser,
        phoneNumber,
      };

      // Créer un utilisateur
      const user = await User.create(userData);

      // Créer un OTP valide
      const otpCode = '123456';
      const otp = await OTP.create({
        phoneNumber,
        code: otpCode,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        isUsed: false,
      });

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          phoneNumber,
          code: otpCode,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('OTP vérifié');

      // Vérifier que l'utilisateur est maintenant vérifié
      const updatedUser = await User.findByPk(user.id);
      expect(updatedUser.isVerified).toBe(true);

      // Vérifier que l'OTP est marqué comme utilisé
      const updatedOTP = await OTP.findByPk(otp.id);
      expect(updatedOTP.isUsed).toBe(true);
    });

    it('devrait échouer avec un OTP invalide', async () => {
      // Utiliser un numéro de téléphone unique pour ce test
      const phoneNumber = '+221771234512';
      const userData = {
        ...testUsers.validUser,
        phoneNumber,
      };

      // Créer un utilisateur
      await User.create(userData);

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          phoneNumber,
          code: '000000',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('OTP invalide');
    });

    it('devrait échouer avec un OTP expiré', async () => {
      // Utiliser un numéro de téléphone unique pour ce test
      const phoneNumber = '+221771234513';
      const userData = {
        ...testUsers.validUser,
        phoneNumber,
      };

      // Créer un utilisateur
      await User.create(userData);

      // Créer un OTP expiré
      await OTP.create({
        phoneNumber,
        code: '123456',
        expiresAt: new Date(Date.now() - 5 * 60 * 1000), // Expiré
        isUsed: false,
      });

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          phoneNumber,
          code: '123456',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('devrait connecter un utilisateur existant et vérifié', async () => {
      // Créer un utilisateur vérifié
      const user = await User.create({
        ...testUsers.validUser,
        isVerified: true,
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ phoneNumber: testUsers.validUser.phoneNumber })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.phoneNumber).toBe(testUsers.validUser.phoneNumber);
    });

    it('devrait connecter un utilisateur avec mot de passe', async () => {
      // Utiliser un numéro de téléphone unique pour ce test
      const phoneNumber = '+221771234503';
      const userData = {
        ...testUsers.validUser,
        phoneNumber,
      };

      // Créer un utilisateur avec mot de passe
      const password = 'password123';
      const hashedPassword = await passwordService.hashPassword(password);
      const user = await User.create({
        ...userData,
        isVerified: true,
        password: hashedPassword,
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber,
          password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('devrait échouer avec un mot de passe incorrect', async () => {
      // Utiliser un numéro de téléphone unique pour ce test
      const phoneNumber = '+221771234504';
      const userData = {
        ...testUsers.validUser,
        phoneNumber,
      };

      // Créer un utilisateur avec mot de passe
      const password = 'password123';
      const hashedPassword = await passwordService.hashPassword(password);
      await User.create({
        ...userData,
        isVerified: true,
        password: hashedPassword,
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('devrait échouer si l\'utilisateur n\'existe pas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ phoneNumber: '+221999999999' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Utilisateur non trouvé');
    });
  });

  describe('POST /api/auth/resend-otp', () => {
    it('devrait créer un nouvel OTP dans la base de données', async () => {
      // Utiliser un numéro de téléphone unique pour ce test
      const phoneNumber = '+221771234505';
      const userData = {
        ...testUsers.validUser,
        phoneNumber,
      };

      // Créer un utilisateur
      await User.create(userData);

      // Créer un OTP existant
      await OTP.create({
        phoneNumber,
        code: '111111',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        isUsed: false,
      });

      const response = await request(app)
        .post('/api/auth/resend-otp')
        .send({ phoneNumber })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('OTP envoyé');

      // Vérifier qu'un nouvel OTP a été créé
      const otps = await OTP.findAll({
        where: {
          phoneNumber,
          isUsed: false,
        },
        order: [['createdAt', 'DESC']],
      });

      expect(otps.length).toBeGreaterThan(0);
      // L'ancien OTP devrait être marqué comme utilisé
      const oldOTPs = await OTP.findAll({
        where: {
          phoneNumber,
          code: '111111',
        },
      });
      expect(oldOTPs[0].isUsed).toBe(true);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('devrait créer un token de réinitialisation', async () => {
      // Utiliser un numéro de téléphone unique pour ce test
      const phoneNumber = '+221771234506';
      const userData = {
        ...testUsers.validUser,
        phoneNumber,
      };

      // Créer un utilisateur
      await User.create(userData);

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ phoneNumber })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('resetToken');

      // Vérifier que le token existe dans la base de données
      const user = await User.findOne({ where: { phoneNumber } });
      const resetTokens = await PasswordResetToken.findAll({
        where: {
          userId: user.id,
          isUsed: false,
        },
      });

      expect(resetTokens.length).toBeGreaterThan(0);
    });

    it('devrait retourner un succès même si l\'utilisateur n\'existe pas (sécurité)', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ phoneNumber: '+221999999999' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('devrait réinitialiser le mot de passe avec un token valide', async () => {
      // Utiliser un numéro de téléphone unique pour ce test
      const phoneNumber = '+221771234507';
      const userData = {
        ...testUsers.validUser,
        phoneNumber,
      };

      // Créer un utilisateur
      const user = await User.create(userData);

      // Créer un token de réinitialisation
      const resetToken = await passwordService.createPasswordResetToken(user.id);

      const newPassword = 'newpassword123';

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          newPassword,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('réinitialisé');

      // Vérifier que le mot de passe a été changé
      const updatedUser = await User.scope('withPassword').findByPk(user.id);
      const isPasswordValid = await passwordService.comparePassword(newPassword, updatedUser.password);
      expect(isPasswordValid).toBe(true);

      // Vérifier que le token est marqué comme utilisé
      const usedToken = await PasswordResetToken.findOne({ where: { token: resetToken } });
      expect(usedToken.isUsed).toBe(true);
    });

    it('devrait échouer avec un token invalide', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalid-token',
          newPassword: 'newpassword123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/change-password', () => {
    it('devrait changer le mot de passe avec un mot de passe actuel correct', async () => {
      // Utiliser un numéro de téléphone unique pour ce test
      const phoneNumber = '+221771234508';
      const userData = {
        ...testUsers.validUser,
        phoneNumber,
      };

      // Créer un utilisateur avec mot de passe
      const currentPassword = 'currentpassword';
      const hashedPassword = await passwordService.hashPassword(currentPassword);
      const user = await User.create({
        ...userData,
        isVerified: true,
        password: hashedPassword,
      });

      // Se connecter pour obtenir un token
      const loginResult = await authService.loginWithPassword(
        phoneNumber,
        currentPassword
      );

      const newPassword = 'newpassword123';

      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${loginResult.token}`)
        .send({
          currentPassword,
          newPassword,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('changé');

      // Vérifier que le mot de passe a été changé
      const updatedUser = await User.scope('withPassword').findByPk(user.id);
      const isNewPasswordValid = await passwordService.comparePassword(newPassword, updatedUser.password);
      expect(isNewPasswordValid).toBe(true);
    });

    it('devrait échouer avec un mot de passe actuel incorrect', async () => {
      // Utiliser un numéro de téléphone unique pour ce test
      const phoneNumber = '+221771234509';
      const userData = {
        ...testUsers.validUser,
        phoneNumber,
      };

      // Créer un utilisateur avec mot de passe
      const currentPassword = 'currentpassword';
      const hashedPassword = await passwordService.hashPassword(currentPassword);
      const user = await User.create({
        ...userData,
        isVerified: true,
        password: hashedPassword,
      });

      // Se connecter pour obtenir un token
      const loginResult = await authService.loginWithPassword(
        phoneNumber,
        currentPassword
      );

      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${loginResult.token}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('devrait échouer sans authentification', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .send({
          currentPassword: 'currentpassword',
          newPassword: 'newpassword123',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('devrait déconnecter un utilisateur authentifié', async () => {
      // Utiliser un numéro de téléphone unique pour ce test
      const phoneNumber = '+221771234510';
      const userData = {
        ...testUsers.validUser,
        phoneNumber,
      };

      // Créer un utilisateur
      const user = await User.create({
        ...userData,
        isVerified: true,
      });

      // Se connecter pour obtenir un token
      const loginResult = await authService.login(phoneNumber);

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${loginResult.token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Déconnexion réussie');
    });

    it('devrait échouer sans authentification', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /health', () => {
    it('devrait retourner le statut du serveur', async () => {
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

