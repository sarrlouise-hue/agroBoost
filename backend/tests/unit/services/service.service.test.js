const serviceService = require('../../../src/services/service/service.service');
const serviceRepository = require('../../../src/data-access/service.repository');
const providerRepository = require('../../../src/data-access/provider.repository');
const { AppError } = require('../../../src/utils/errors');
const { SERVICE_TYPES } = require('../../../src/config/constants');

// Mock des dépendances
jest.mock('../../../src/data-access/service.repository');
jest.mock('../../../src/data-access/provider.repository');

describe('Service Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createService', () => {
    it('devrait créer un service avec succès', async () => {
      const providerId = 'provider-id-123';
      const serviceData = {
        serviceType: SERVICE_TYPES.TRACTOR,
        name: 'Tracteur John Deere',
        description: 'Tracteur puissant',
        pricePerHour: 5000,
        pricePerDay: 40000,
        availability: true,
      };

      const mockProvider = {
        id: providerId,
        isApproved: true,
      };

      const mockService = {
        id: 'service-id-123',
        providerId,
        ...serviceData,
      };

      providerRepository.findById.mockResolvedValue(mockProvider);
      serviceRepository.create.mockResolvedValue(mockService);

      const result = await serviceService.createService(providerId, serviceData);

      expect(result).toEqual(mockService);
      expect(providerRepository.findById).toHaveBeenCalledWith(providerId);
      expect(serviceRepository.create).toHaveBeenCalledWith({
        providerId,
        ...serviceData,
      });
    });

    it('devrait échouer si le prestataire n\'existe pas', async () => {
      const providerId = 'non-existent-id';
      const serviceData = {
        serviceType: SERVICE_TYPES.TRACTOR,
        name: 'Test',
        pricePerHour: 5000,
      };

      providerRepository.findById.mockResolvedValue(null);

      await expect(serviceService.createService(providerId, serviceData)).rejects.toThrow(AppError);
    });

    it('devrait échouer si le prestataire n\'est pas approuvé', async () => {
      const providerId = 'provider-id-123';
      const serviceData = {
        serviceType: SERVICE_TYPES.TRACTOR,
        name: 'Test',
        pricePerHour: 5000,
      };

      const mockProvider = {
        id: providerId,
        isApproved: false,
      };

      providerRepository.findById.mockResolvedValue(mockProvider);

      await expect(serviceService.createService(providerId, serviceData)).rejects.toThrow(AppError);
    });

    it('devrait échouer si aucun prix n\'est défini', async () => {
      const providerId = 'provider-id-123';
      const serviceData = {
        serviceType: SERVICE_TYPES.TRACTOR,
        name: 'Test',
        // Pas de prix
      };

      const mockProvider = {
        id: providerId,
        isApproved: true,
      };

      providerRepository.findById.mockResolvedValue(mockProvider);

      await expect(serviceService.createService(providerId, serviceData)).rejects.toThrow(AppError);
    });

    it('devrait échouer avec un type de service invalide', async () => {
      const providerId = 'provider-id-123';
      const serviceData = {
        serviceType: 'invalid-type',
        name: 'Test',
        pricePerHour: 5000,
      };

      const mockProvider = {
        id: providerId,
        isApproved: true,
      };

      providerRepository.findById.mockResolvedValue(mockProvider);

      await expect(serviceService.createService(providerId, serviceData)).rejects.toThrow(AppError);
    });
  });

  describe('getServiceById', () => {
    it('devrait retourner un service par ID', async () => {
      const serviceId = 'service-id-123';
      const mockService = {
        id: serviceId,
        name: 'Tracteur John Deere',
        serviceType: SERVICE_TYPES.TRACTOR,
      };

      serviceRepository.findById.mockResolvedValue(mockService);

      const result = await serviceService.getServiceById(serviceId);

      expect(result).toEqual(mockService);
      expect(serviceRepository.findById).toHaveBeenCalledWith(serviceId);
    });

    it('devrait lancer une erreur si le service n\'existe pas', async () => {
      const serviceId = 'non-existent-id';

      serviceRepository.findById.mockResolvedValue(null);

      await expect(serviceService.getServiceById(serviceId)).rejects.toThrow(AppError);
    });
  });

  describe('updateService', () => {
    it('devrait mettre à jour un service avec succès', async () => {
      const serviceId = 'service-id-123';
      const providerId = 'provider-id-123';
      const updateData = {
        name: 'Nouveau nom',
        pricePerHour: 6000,
      };

      const mockService = {
        id: serviceId,
        providerId,
        name: 'Ancien nom',
      };

      const mockUpdatedService = {
        id: serviceId,
        providerId,
        ...updateData,
      };

      serviceRepository.findById.mockResolvedValue(mockService);
      serviceRepository.updateById.mockResolvedValue(mockUpdatedService);

      const result = await serviceService.updateService(serviceId, providerId, updateData);

      expect(result).toEqual(mockUpdatedService);
      expect(serviceRepository.findById).toHaveBeenCalledWith(serviceId);
      expect(serviceRepository.updateById).toHaveBeenCalledWith(serviceId, updateData);
    });

    it('devrait échouer si le service n\'appartient pas au prestataire', async () => {
      const serviceId = 'service-id-123';
      const providerId = 'provider-id-123';
      const otherProviderId = 'other-provider-id';
      const updateData = { name: 'New Name' };

      const mockService = {
        id: serviceId,
        providerId: otherProviderId,
      };

      serviceRepository.findById.mockResolvedValue(mockService);

      await expect(serviceService.updateService(serviceId, providerId, updateData)).rejects.toThrow(AppError);
    });
  });

  describe('deleteService', () => {
    it('devrait supprimer un service avec succès', async () => {
      const serviceId = 'service-id-123';
      const providerId = 'provider-id-123';

      const mockService = {
        id: serviceId,
        providerId,
      };

      serviceRepository.findById.mockResolvedValue(mockService);
      serviceRepository.deleteById.mockResolvedValue(true);

      const result = await serviceService.deleteService(serviceId, providerId);

      expect(result).toBe(true);
      expect(serviceRepository.deleteById).toHaveBeenCalledWith(serviceId);
    });

    it('devrait échouer si le service n\'appartient pas au prestataire', async () => {
      const serviceId = 'service-id-123';
      const providerId = 'provider-id-123';
      const otherProviderId = 'other-provider-id';

      const mockService = {
        id: serviceId,
        providerId: otherProviderId,
      };

      serviceRepository.findById.mockResolvedValue(mockService);

      await expect(serviceService.deleteService(serviceId, providerId)).rejects.toThrow(AppError);
    });
  });

  describe('getAllServices', () => {
    it('devrait retourner tous les services avec filtres', async () => {
      const options = {
        page: 1,
        limit: 10,
        serviceType: SERVICE_TYPES.TRACTOR,
        availability: true,
      };

      const mockServices = [
        { id: 'service-1', name: 'Service 1' },
        { id: 'service-2', name: 'Service 2' },
      ];
      const mockCount = 2;

      serviceRepository.findAll.mockResolvedValue({
        count: mockCount,
        rows: mockServices,
      });

      const result = await serviceService.getAllServices(options);

      expect(result.services).toEqual(mockServices);
      expect(result.pagination.total).toBe(mockCount);
      // Le service ajoute des valeurs par défaut pour les paramètres optionnels
      expect(serviceRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
          serviceType: SERVICE_TYPES.TRACTOR,
          availability: true,
        })
      );
    });
  });

  describe('getServicesByProvider', () => {
    it('devrait retourner les services d\'un prestataire', async () => {
      const providerId = 'provider-id-123';
      const options = { page: 1, limit: 10 };

      const mockServices = [
        { id: 'service-1', providerId },
        { id: 'service-2', providerId },
      ];
      const mockCount = 2;

      serviceRepository.findByProviderId.mockResolvedValue({
        count: mockCount,
        rows: mockServices,
      });

      const result = await serviceService.getServicesByProvider(providerId, options);

      expect(result.services).toEqual(mockServices);
      expect(result.pagination.total).toBe(mockCount);
      expect(serviceRepository.findByProviderId).toHaveBeenCalledWith(providerId, options);
    });
  });

  describe('updateAvailability', () => {
    it('devrait mettre à jour la disponibilité', async () => {
      const serviceId = 'service-id-123';
      const providerId = 'provider-id-123';
      const availability = false;

      const mockService = {
        id: serviceId,
        providerId,
      };

      const mockUpdatedService = {
        id: serviceId,
        providerId,
        availability,
      };

      serviceRepository.findById.mockResolvedValue(mockService);
      serviceRepository.updateById.mockResolvedValue(mockUpdatedService);

      const result = await serviceService.updateAvailability(serviceId, providerId, availability);

      expect(result).toEqual(mockUpdatedService);
    });
  });
});

