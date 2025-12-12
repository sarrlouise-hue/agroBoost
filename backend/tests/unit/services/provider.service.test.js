const providerService = require('../../../src/services/provider/provider.service');
const providerRepository = require('../../../src/data-access/provider.repository');
const userRepository = require('../../../src/data-access/user.repository');
const { AppError } = require('../../../src/utils/errors');
const { ROLES } = require('../../../src/config/constants');

// Mock des dépendances
jest.mock('../../../src/data-access/provider.repository');
jest.mock('../../../src/data-access/user.repository');

describe('Provider Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerProvider', () => {
    it('devrait inscrire un prestataire avec succès', async () => {
      const userId = 'user-id-123';
      const providerData = {
        businessName: 'Agri Services',
        description: 'Services agricoles de qualité',
        documents: ['doc1.pdf'],
      };

      const mockUser = {
        id: userId,
        phoneNumber: '+221771234567',
        role: ROLES.USER,
      };

      const mockProvider = {
        id: 'provider-id-123',
        userId,
        ...providerData,
        isApproved: false,
        rating: 0,
        totalBookings: 0,
      };

      userRepository.findById.mockResolvedValue(mockUser);
      providerRepository.findByUserId.mockResolvedValue(null);
      userRepository.updateById.mockResolvedValue({ ...mockUser, role: ROLES.PROVIDER });
      providerRepository.create.mockResolvedValue(mockProvider);

      const result = await providerService.registerProvider(userId, providerData);

      expect(result).toEqual(mockProvider);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.updateById).toHaveBeenCalledWith(userId, { role: ROLES.PROVIDER });
      expect(providerRepository.create).toHaveBeenCalledWith({
        userId,
        ...providerData,
      });
    });

    it('devrait échouer si l\'utilisateur n\'existe pas', async () => {
      const userId = 'non-existent-id';
      const providerData = { businessName: 'Test' };

      userRepository.findById.mockResolvedValue(null);

      await expect(providerService.registerProvider(userId, providerData)).rejects.toThrow(AppError);
    });

    it('devrait échouer si l\'utilisateur est déjà prestataire', async () => {
      const userId = 'user-id-123';
      const providerData = { businessName: 'Test' };
      const mockUser = { id: userId };
      const mockProvider = { id: 'provider-id', userId };

      userRepository.findById.mockResolvedValue(mockUser);
      providerRepository.findByUserId.mockResolvedValue(mockProvider);

      await expect(providerService.registerProvider(userId, providerData)).rejects.toThrow(AppError);
    });
  });

  describe('getProfile', () => {
    it('devrait retourner le profil du prestataire', async () => {
      const providerId = 'provider-id-123';
      const mockProvider = {
        id: providerId,
        businessName: 'Agri Services',
        isApproved: true,
        rating: 4.5,
      };

      providerRepository.findById.mockResolvedValue(mockProvider);

      const result = await providerService.getProfile(providerId);

      expect(result).toEqual(mockProvider);
      expect(providerRepository.findById).toHaveBeenCalledWith(providerId);
    });

    it('devrait lancer une erreur si le prestataire n\'existe pas', async () => {
      const providerId = 'non-existent-id';

      providerRepository.findById.mockResolvedValue(null);

      await expect(providerService.getProfile(providerId)).rejects.toThrow(AppError);
    });
  });

  describe('getProfileByUserId', () => {
    it('devrait retourner le profil du prestataire par userId', async () => {
      const userId = 'user-id-123';
      const mockProvider = {
        id: 'provider-id-123',
        userId,
        businessName: 'Agri Services',
      };

      providerRepository.findByUserId.mockResolvedValue(mockProvider);

      const result = await providerService.getProfileByUserId(userId);

      expect(result).toEqual(mockProvider);
      expect(providerRepository.findByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateProfile', () => {
    it('devrait mettre à jour le profil avec succès', async () => {
      const providerId = 'provider-id-123';
      const updateData = {
        businessName: 'New Business Name',
        description: 'New description',
      };

      const mockUpdatedProvider = {
        id: providerId,
        ...updateData,
      };

      providerRepository.updateById.mockResolvedValue(mockUpdatedProvider);

      const result = await providerService.updateProfile(providerId, updateData);

      expect(result).toEqual(mockUpdatedProvider);
      expect(providerRepository.updateById).toHaveBeenCalledWith(providerId, updateData);
    });

    it('devrait filtrer les champs non autorisés', async () => {
      const providerId = 'provider-id-123';
      const updateData = {
        businessName: 'New Name',
        isApproved: true, // Ne devrait pas être mis à jour via cette méthode
        rating: 5, // Ne devrait pas être mis à jour via cette méthode
      };

      const filteredData = {
        businessName: 'New Name',
      };

      const mockUpdatedProvider = {
        id: providerId,
        ...filteredData,
      };

      providerRepository.updateById.mockResolvedValue(mockUpdatedProvider);

      await providerService.updateProfile(providerId, updateData);

      expect(providerRepository.updateById).toHaveBeenCalledWith(providerId, filteredData);
    });
  });

  describe('getAllProviders', () => {
    it('devrait retourner tous les prestataires avec pagination', async () => {
      const options = { page: 1, limit: 10 };
      const mockProviders = [
        { id: 'provider-1', businessName: 'Provider 1' },
        { id: 'provider-2', businessName: 'Provider 2' },
      ];
      const mockCount = 2;

      providerRepository.findAll.mockResolvedValue({
        count: mockCount,
        rows: mockProviders,
      });

      const result = await providerService.getAllProviders(options);

      expect(result.providers).toEqual(mockProviders);
      expect(result.pagination.total).toBe(mockCount);
    });
  });

  describe('approveProvider', () => {
    it('devrait approuver un prestataire', async () => {
      const providerId = 'provider-id-123';
      const mockProvider = {
        id: providerId,
        isApproved: true,
      };

      providerRepository.updateById.mockResolvedValue(mockProvider);

      const result = await providerService.approveProvider(providerId);

      expect(result).toEqual(mockProvider);
      expect(providerRepository.updateById).toHaveBeenCalledWith(providerId, { isApproved: true });
    });
  });

  describe('rejectProvider', () => {
    it('devrait rejeter un prestataire', async () => {
      const providerId = 'provider-id-123';
      const mockProvider = {
        id: providerId,
        isApproved: false,
      };

      providerRepository.updateById.mockResolvedValue(mockProvider);

      const result = await providerService.rejectProvider(providerId);

      expect(result).toEqual(mockProvider);
      expect(providerRepository.updateById).toHaveBeenCalledWith(providerId, { isApproved: false });
    });
  });
});

