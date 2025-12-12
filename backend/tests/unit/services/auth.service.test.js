const authService = require('../../../src/services/auth/auth.service');
const userRepository = require('../../../src/data-access/user.repository');
const { AppError } = require('../../../src/utils/errors');

// Mock des dépendances
jest.mock('../../../src/data-access/user.repository');
jest.mock('../../../src/services/auth/password.service', () => ({
  comparePassword: jest.fn(),
}));
jest.mock('../../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('devrait inscrire un nouvel utilisateur avec succès', async () => {
      const userData = {
        phoneNumber: '+221771234567',
        firstName: 'Amadou',
        lastName: 'Diallo',
        email: 'amadou@example.com',
        language: 'fr',
      };

      const mockUser = {
        id: 'user-id-123',
        ...userData,
        role: 'user',
        isVerified: false,
      };

      userRepository.findByPhoneNumber.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(mockUser);

      const result = await authService.register(userData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.phoneNumber).toBe(userData.phoneNumber);
      expect(userRepository.findByPhoneNumber).toHaveBeenCalledWith(userData.phoneNumber);
      expect(userRepository.create).toHaveBeenCalled();
    });

    it('devrait échouer si l\'utilisateur existe déjà', async () => {
      const userData = {
        phoneNumber: '+221771234567',
        firstName: 'Amadou',
        lastName: 'Diallo',
      };

      userRepository.findByPhoneNumber.mockResolvedValue({ id: 'existing-user' });

      await expect(authService.register(userData)).rejects.toThrow(AppError);
      await expect(authService.register(userData)).rejects.toThrow(
        'Un utilisateur existe déjà avec ce numéro de téléphone'
      );
    });
  });

  describe('login', () => {
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

      userRepository.findByPhoneNumber.mockResolvedValue(mockUser);

      const result = await authService.login(phoneNumber);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.phoneNumber).toBe(phoneNumber);
      expect(userRepository.findByPhoneNumber).toHaveBeenCalledWith(phoneNumber);
    });

    it('devrait échouer si l\'utilisateur n\'existe pas', async () => {
      const phoneNumber = '+221771234567';

      userRepository.findByPhoneNumber.mockResolvedValue(null);

      await expect(authService.login(phoneNumber)).rejects.toThrow(AppError);
      await expect(authService.login(phoneNumber)).rejects.toThrow(
        'Utilisateur non trouvé'
      );
    });
  });

  describe('verifyToken', () => {
    it('devrait vérifier un token valide', () => {
      const userId = 'user-id-123';
      const role = 'user';
      const token = authService.generateToken(userId, role);

      const decoded = authService.verifyToken(token);

      expect(decoded).toHaveProperty('userId', userId);
      expect(decoded).toHaveProperty('role', role);
    });

    it('devrait échouer avec un token invalide', () => {
      const invalidToken = 'invalid-token';

      expect(() => authService.verifyToken(invalidToken)).toThrow(AppError);
    });
  });

  describe('loginWithPassword', () => {
    it('devrait connecter un utilisateur avec un mot de passe correct', async () => {
      const phoneNumber = '+221771234567';
      const password = 'password123';
      const mockUser = {
        id: 'user-id-123',
        phoneNumber,
        firstName: 'Amadou',
        lastName: 'Diallo',
        email: 'amadou@example.com',
        language: 'fr',
        role: 'user',
        isVerified: true,
        password: 'hashed-password',
      };

      const { comparePassword } = require('../../../src/services/auth/password.service');
      comparePassword.mockResolvedValue(true);

      userRepository.findByPhoneNumberWithPassword.mockResolvedValue(mockUser);

      const result = await authService.loginWithPassword(phoneNumber, password);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.phoneNumber).toBe(phoneNumber);
      expect(userRepository.findByPhoneNumberWithPassword).toHaveBeenCalledWith(phoneNumber);
    });

    it('devrait échouer avec un mot de passe incorrect', async () => {
      const phoneNumber = '+221771234567';
      const password = 'wrongpassword';

      const { comparePassword } = require('../../../src/services/auth/password.service');
      comparePassword.mockResolvedValue(false);

      const mockUser = {
        id: 'user-id-123',
        phoneNumber,
        password: 'hashed-password',
      };

      userRepository.findByPhoneNumberWithPassword.mockResolvedValue(mockUser);

      await expect(
        authService.loginWithPassword(phoneNumber, password)
      ).rejects.toThrow(AppError);
    });

    it('devrait échouer si aucun mot de passe n\'est défini', async () => {
      const phoneNumber = '+221771234567';
      const password = 'password123';

      const mockUser = {
        id: 'user-id-123',
        phoneNumber,
        password: null,
      };

      userRepository.findByPhoneNumberWithPassword.mockResolvedValue(mockUser);

      await expect(
        authService.loginWithPassword(phoneNumber, password)
      ).rejects.toThrow(AppError);
    });
  });

  describe('refreshAccessToken', () => {
    it('devrait rafraîchir un token d\'accès', async () => {
      const userId = 'user-id-123';
      const refreshToken = authService.generateRefreshToken(userId);
      const mockUser = {
        id: userId,
        role: 'user',
      };

      userRepository.findById.mockResolvedValue(mockUser);

      const result = await authService.refreshAccessToken(refreshToken);

      expect(result).toHaveProperty('token');
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('devrait échouer si l\'utilisateur n\'existe pas', async () => {
      const userId = 'non-existent-user';
      const refreshToken = authService.generateRefreshToken(userId);

      userRepository.findById.mockResolvedValue(null);

      await expect(
        authService.refreshAccessToken(refreshToken)
      ).rejects.toThrow(AppError);
    });
  });
});
