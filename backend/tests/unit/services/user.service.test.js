const userService = require('../../../src/services/user/user.service');
const userRepository = require('../../../src/data-access/user.repository');
const { AppError } = require('../../../src/utils/errors');

// Mock des dépendances
jest.mock('../../../src/data-access/user.repository');

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('devrait retourner le profil de l\'utilisateur', async () => {
      const userId = 'user-id-123';
      const mockUser = {
        id: userId,
        phoneNumber: '+221771234567',
        firstName: 'Amadou',
        lastName: 'Diallo',
        email: 'amadou@example.com',
        language: 'fr',
      };

      userRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getProfile(userId);

      expect(result).toEqual(mockUser);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('devrait lancer une erreur si l\'utilisateur n\'existe pas', async () => {
      const userId = 'non-existent-id';

      userRepository.findById.mockResolvedValue(null);

      await expect(userService.getProfile(userId)).rejects.toThrow(AppError);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateProfile', () => {
    it('devrait mettre à jour le profil avec succès', async () => {
      const userId = 'user-id-123';
      const updateData = {
        firstName: 'Amadou',
        lastName: 'Diallo',
        email: 'newemail@example.com',
      };

      const mockUpdatedUser = {
        id: userId,
        ...updateData,
        phoneNumber: '+221771234567',
      };

      userRepository.updateById.mockResolvedValue(mockUpdatedUser);

      const result = await userService.updateProfile(userId, updateData);

      expect(result).toEqual(mockUpdatedUser);
      expect(userRepository.updateById).toHaveBeenCalledWith(userId, updateData);
    });

    it('devrait filtrer les champs non autorisés', async () => {
      const userId = 'user-id-123';
      const updateData = {
        firstName: 'Amadou',
        password: 'should-not-be-updated',
        role: 'admin', // Ne devrait pas être mis à jour
      };

      const filteredData = {
        firstName: 'Amadou',
      };

      const mockUpdatedUser = {
        id: userId,
        firstName: 'Amadou',
        phoneNumber: '+221771234567',
      };

      userRepository.updateById.mockResolvedValue(mockUpdatedUser);

      await userService.updateProfile(userId, updateData);

      expect(userRepository.updateById).toHaveBeenCalledWith(userId, filteredData);
    });

    it('devrait lancer une erreur si l\'utilisateur n\'existe pas', async () => {
      const userId = 'non-existent-id';
      const updateData = { firstName: 'NewName' };

      userRepository.updateById.mockResolvedValue(null);

      await expect(userService.updateProfile(userId, updateData)).rejects.toThrow(AppError);
    });
  });

  describe('updateLocation', () => {
    it('devrait mettre à jour la localisation avec succès', async () => {
      const userId = 'user-id-123';
      const locationData = {
        latitude: 14.7167,
        longitude: -17.4677,
        address: 'Dakar, Sénégal',
      };

      const mockUpdatedUser = {
        id: userId,
        ...locationData,
        phoneNumber: '+221771234567',
      };

      userRepository.updateById.mockResolvedValue(mockUpdatedUser);

      const result = await userService.updateLocation(userId, locationData);

      expect(result).toEqual(mockUpdatedUser);
      expect(userRepository.updateById).toHaveBeenCalledWith(userId, locationData);
    });

    it('devrait valider la latitude', async () => {
      const userId = 'user-id-123';
      const locationData = {
        latitude: 100, // Invalide (> 90)
        longitude: -17.4677,
      };

      await expect(userService.updateLocation(userId, locationData)).rejects.toThrow(AppError);
    });

    it('devrait valider la longitude', async () => {
      const userId = 'user-id-123';
      const locationData = {
        latitude: 14.7167,
        longitude: 200, // Invalide (> 180)
      };

      await expect(userService.updateLocation(userId, locationData)).rejects.toThrow(AppError);
    });
  });

  describe('updateLanguage', () => {
    it('devrait mettre à jour la langue avec succès', async () => {
      const userId = 'user-id-123';
      const language = 'wolof';

      const mockUpdatedUser = {
        id: userId,
        language,
        phoneNumber: '+221771234567',
      };

      userRepository.updateById.mockResolvedValue(mockUpdatedUser);

      const result = await userService.updateLanguage(userId, language);

      expect(result).toEqual(mockUpdatedUser);
      expect(userRepository.updateById).toHaveBeenCalledWith(userId, { language });
    });

    it('devrait rejeter une langue non supportée', async () => {
      const userId = 'user-id-123';
      const language = 'english'; // Langue non supportée

      await expect(userService.updateLanguage(userId, language)).rejects.toThrow(AppError);
    });
  });

  describe('getAllUsers', () => {
    it('devrait retourner tous les utilisateurs avec pagination', async () => {
      const options = { page: 1, limit: 10 };
      const mockUsers = [
        { id: 'user-1', phoneNumber: '+221771234567' },
        { id: 'user-2', phoneNumber: '+221771234568' },
      ];
      const mockCount = 2;

      // Mock du modèle User directement
      const User = require('../../../src/models/User');
      User.findAndCountAll = jest.fn().mockResolvedValue({
        count: mockCount,
        rows: mockUsers,
      });

      const result = await userService.getAllUsers(options);

      expect(result.users).toEqual(mockUsers);
      expect(result.pagination.total).toBe(mockCount);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });
  });
});

