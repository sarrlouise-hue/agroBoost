const otpService = require('../../../src/services/auth/otp.service');
const otpRepository = require('../../../src/data-access/otp.repository');
const { AppError } = require('../../../src/utils/errors');

// Mock des dépendances
jest.mock('../../../src/data-access/otp.repository');
jest.mock('../../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('OTP Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateOTP', () => {
    it('devrait générer un code OTP de 6 chiffres par défaut', () => {
      const code = otpService.generateOTP();

      expect(code).toHaveLength(6);
      expect(code).toMatch(/^\d{6}$/);
    });

    it('devrait générer un code OTP de longueur personnalisée', () => {
      const length = 4;
      const code = otpService.generateOTP(length);

      expect(code).toHaveLength(length);
      expect(code).toMatch(/^\d{4}$/);
    });
  });

  describe('createOTP', () => {
    it('devrait créer un nouvel OTP', async () => {
      const phoneNumber = '+221771234567';
      const mockOTP = {
        id: 'otp-id-123',
        phoneNumber,
        code: '123456',
        expiresAt: new Date(),
        isUsed: false,
      };

      otpRepository.invalidateByPhoneNumber.mockResolvedValue({ modifiedCount: 1 });
      otpRepository.create.mockResolvedValue(mockOTP);

      const result = await otpService.createOTP(phoneNumber);

      expect(result).toHaveProperty('phoneNumber', phoneNumber);
      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('expiresAt');
      expect(otpRepository.invalidateByPhoneNumber).toHaveBeenCalledWith(phoneNumber);
      expect(otpRepository.create).toHaveBeenCalled();
    });

    it('devrait invalider les OTP précédents', async () => {
      const phoneNumber = '+221771234567';
      const mockOTP = {
        id: 'otp-id-123',
        phoneNumber,
        code: '123456',
        expiresAt: new Date(),
        isUsed: false,
      };

      otpRepository.invalidateByPhoneNumber.mockResolvedValue({ modifiedCount: 1 });
      otpRepository.create.mockResolvedValue(mockOTP);

      await otpService.createOTP(phoneNumber);

      expect(otpRepository.invalidateByPhoneNumber).toHaveBeenCalledWith(phoneNumber);
    });
  });

  describe('verifyOTP', () => {
    it('devrait vérifier un OTP valide', async () => {
      const phoneNumber = '+221771234567';
      const code = '123456';
      const mockOTP = {
        id: 'otp-id-123',
        phoneNumber,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes dans le futur
        isUsed: false,
        save: jest.fn().mockResolvedValue(true),
      };

      otpRepository.findByPhoneNumberAndCode.mockResolvedValue(mockOTP);
      otpRepository.save.mockResolvedValue(mockOTP);

      const result = await otpService.verifyOTP(phoneNumber, code);

      expect(result.valid).toBe(true);
      expect(result.message).toBe('OTP vérifié avec succès');
      expect(otpRepository.findByPhoneNumberAndCode).toHaveBeenCalledWith(phoneNumber, code);
      expect(otpRepository.save).toHaveBeenCalled();
    });

    it('devrait échouer avec un OTP invalide', async () => {
      const phoneNumber = '+221771234567';
      const code = '000000';

      otpRepository.findByPhoneNumberAndCode.mockResolvedValue(null);

      const result = await otpService.verifyOTP(phoneNumber, code);

      expect(result.valid).toBe(false);
      expect(result.message).toBe('OTP invalide ou expiré');
    });

    it('devrait échouer avec un OTP expiré', async () => {
      const phoneNumber = '+221771234567';
      const code = '123456';

      otpRepository.findByPhoneNumberAndCode.mockResolvedValue(null);

      const result = await otpService.verifyOTP(phoneNumber, code);

      expect(result.valid).toBe(false);
    });
  });

  describe('checkOTP', () => {
    it('devrait retourner true si un OTP valide existe', async () => {
      const phoneNumber = '+221771234567';
      const mockOTP = {
        id: 'otp-id-123',
        phoneNumber,
        code: '123456',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        isUsed: false,
      };

      otpRepository.findValidByPhoneNumber.mockResolvedValue(mockOTP);

      const result = await otpService.checkOTP(phoneNumber);

      expect(result).toBe(true);
      expect(otpRepository.findValidByPhoneNumber).toHaveBeenCalledWith(phoneNumber);
    });

    it('devrait retourner false si aucun OTP valide n\'existe', async () => {
      const phoneNumber = '+221771234567';

      otpRepository.findValidByPhoneNumber.mockResolvedValue(null);

      const result = await otpService.checkOTP(phoneNumber);

      expect(result).toBe(false);
      expect(otpRepository.findValidByPhoneNumber).toHaveBeenCalledWith(phoneNumber);
    });
  });
});
