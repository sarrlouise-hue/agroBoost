const passwordService = require('../../../src/services/auth/password.service');
const passwordResetTokenRepository = require('../../../src/data-access/passwordResetToken.repository');
const userRepository = require('../../../src/data-access/user.repository');
const { AppError } = require('../../../src/utils/errors');

// Mock des dépendances
jest.mock('../../../src/data-access/passwordResetToken.repository');
jest.mock('../../../src/data-access/user.repository');
jest.mock('../../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('Password Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('devrait hasher un mot de passe', async () => {
      const password = 'password123';
      const hashedPassword = await passwordService.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(20);
    });
  });

  describe('comparePassword', () => {
    it('devrait retourner true pour un mot de passe correct', async () => {
      const password = 'password123';
      const hashedPassword = await passwordService.hashPassword(password);

      const result = await passwordService.comparePassword(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('devrait retourner false pour un mot de passe incorrect', async () => {
      const password = 'password123';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = await passwordService.hashPassword(password);

      const result = await passwordService.comparePassword(wrongPassword, hashedPassword);
      expect(result).toBe(false);
    });
  });

  describe('createPasswordResetToken', () => {
    it('devrait créer un token de réinitialisation', async () => {
      const userId = 'user-id-123';
      const mockToken = {
        id: 'token-id-123',
        userId,
        token: 'reset-token-123',
        expiresAt: new Date(),
        isUsed: false,
      };

      passwordResetTokenRepository.invalidateByUserId.mockResolvedValue({ modifiedCount: 1 });
      passwordResetTokenRepository.create.mockResolvedValue(mockToken);

      const token = await passwordService.createPasswordResetToken(userId);

      expect(token).toBe(mockToken.token);
      expect(passwordResetTokenRepository.invalidateByUserId).toHaveBeenCalledWith(userId);
      expect(passwordResetTokenRepository.create).toHaveBeenCalled();
    });
  });

  describe('verifyPasswordResetToken', () => {
    it('devrait vérifier un token valide', async () => {
      const token = 'valid-token';
      const mockResetToken = {
        id: 'token-id-123',
        userId: 'user-id-123',
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 heure dans le futur
        isUsed: false,
      };

      passwordResetTokenRepository.findValidByToken.mockResolvedValue(mockResetToken);

      const result = await passwordService.verifyPasswordResetToken(token);

      expect(result.valid).toBe(true);
      expect(result.resetToken).toBe(mockResetToken);
      expect(passwordResetTokenRepository.findValidByToken).toHaveBeenCalledWith(token);
    });

    it('devrait retourner invalid pour un token expiré', async () => {
      const token = 'expired-token';

      passwordResetTokenRepository.findValidByToken.mockResolvedValue(null);

      const result = await passwordService.verifyPasswordResetToken(token);

      expect(result.valid).toBe(false);
      expect(result.message).toContain('invalide ou expiré');
    });
  });

  describe('resetPassword', () => {
    it('devrait réinitialiser le mot de passe avec un token valide', async () => {
      const token = 'valid-token';
      const newPassword = 'newpassword123';
      const mockResetToken = {
        id: 'token-id-123',
        userId: 'user-id-123',
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        isUsed: false,
        save: jest.fn().mockResolvedValue(true),
      };

      const mockUser = {
        id: 'user-id-123',
        phoneNumber: '+221771234567',
        password: 'old-hashed-password',
        save: jest.fn().mockResolvedValue(true),
      };

      passwordResetTokenRepository.findValidByToken.mockResolvedValue(mockResetToken);
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);
      passwordResetTokenRepository.save.mockResolvedValue(mockResetToken);

      const result = await passwordService.resetPassword(token, newPassword);

      expect(result).toBe(mockUser);
      expect(userRepository.save).toHaveBeenCalled();
      expect(mockResetToken.isUsed).toBe(true);
      expect(passwordResetTokenRepository.save).toHaveBeenCalled();
    });

    it('devrait échouer avec un token invalide', async () => {
      const token = 'invalid-token';
      const newPassword = 'newpassword123';

      passwordResetTokenRepository.findValidByToken.mockResolvedValue(null);

      await expect(
        passwordService.resetPassword(token, newPassword)
      ).rejects.toThrow(AppError);
    });
  });

  describe('changePassword', () => {
    it('devrait changer le mot de passe avec un mot de passe actuel correct', async () => {
      const userId = 'user-id-123';
      const currentPassword = 'currentpassword';
      const newPassword = 'newpassword123';

      const hashedCurrentPassword = await passwordService.hashPassword(currentPassword);

      const mockUser = {
        id: userId,
        phoneNumber: '+221771234567',
        password: hashedCurrentPassword,
        save: jest.fn().mockResolvedValue(true),
      };

      // Mock select() pour retourner le mockUser
      userRepository.findByIdWithPassword.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await passwordService.changePassword(userId, currentPassword, newPassword);

      expect(result).toBe(mockUser);
      expect(userRepository.findByIdWithPassword).toHaveBeenCalledWith(userId);
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('devrait échouer avec un mot de passe actuel incorrect', async () => {
      const userId = 'user-id-123';
      const currentPassword = 'wrongpassword';
      const newPassword = 'newpassword123';

      const hashedPassword = await passwordService.hashPassword('correctpassword');

      const mockUser = {
        id: userId,
        phoneNumber: '+221771234567',
        password: hashedPassword,
      };

      userRepository.findByIdWithPassword.mockResolvedValue(mockUser);

      await expect(
        passwordService.changePassword(userId, currentPassword, newPassword)
      ).rejects.toThrow(AppError);
    });

    it('devrait échouer si aucun mot de passe n\'est défini', async () => {
      const userId = 'user-id-123';
      const currentPassword = 'currentpassword';
      const newPassword = 'newpassword123';

      const mockUser = {
        id: userId,
        phoneNumber: '+221771234567',
        password: null,
      };

      userRepository.findByIdWithPassword.mockResolvedValue(mockUser);

      await expect(
        passwordService.changePassword(userId, currentPassword, newPassword)
      ).rejects.toThrow(AppError);
    });
  });
});

