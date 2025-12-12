const maintenanceService = require('../../../src/services/maintenance/maintenance.service');
const maintenanceRepository = require('../../../src/data-access/maintenance.repository');
const serviceRepository = require('../../../src/data-access/service.repository');
const userRepository = require('../../../src/data-access/user.repository');
const { AppError } = require('../../../src/utils/errors');
const { MAINTENANCE_STATUS } = require('../../../src/config/constants');

// Mock des dépendances
jest.mock('../../../src/data-access/maintenance.repository');
jest.mock('../../../src/data-access/service.repository');
jest.mock('../../../src/data-access/user.repository');

describe('Maintenance Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMaintenance', () => {
    it('devrait créer une maintenance avec succès', async () => {
      const serviceId = 'service-id-123';
      const mechanicId = 'mechanic-id-123';
      const maintenanceData = {
        serviceId,
        mechanicId,
        startDate: new Date('2025-01-15T08:00:00Z'),
        endDate: new Date('2025-01-15T17:00:00Z'),
        description: 'Révision complète',
        cost: 50000,
      };

      const mockService = {
        id: serviceId,
        name: 'Tracteur John Deere',
      };

      const mockMechanic = {
        id: mechanicId,
        firstName: 'Mécanicien',
        lastName: 'Test',
      };

      const mockMaintenance = {
        id: 'maintenance-id-123',
        ...maintenanceData,
        status: MAINTENANCE_STATUS.PENDING,
        duration: 9,
      };

      serviceRepository.findById.mockResolvedValue(mockService);
      userRepository.findById.mockResolvedValue(mockMechanic);
      maintenanceRepository.create.mockResolvedValue(mockMaintenance);
      maintenanceRepository.findById.mockResolvedValue(mockMaintenance);

      const result = await maintenanceService.createMaintenance(maintenanceData);

      expect(result).toEqual(mockMaintenance);
      expect(serviceRepository.findById).toHaveBeenCalledWith(serviceId);
      expect(userRepository.findById).toHaveBeenCalledWith(mechanicId);
      expect(maintenanceRepository.create).toHaveBeenCalled();
    });

    it('devrait échouer si le service n\'existe pas', async () => {
      const maintenanceData = {
        serviceId: 'non-existent-id',
        mechanicId: 'mechanic-id-123',
        startDate: new Date('2025-01-15T08:00:00Z'),
      };

      serviceRepository.findById.mockResolvedValue(null);

      await expect(maintenanceService.createMaintenance(maintenanceData)).rejects.toThrow(AppError);
    });

    it('devrait échouer si le mécanicien n\'existe pas', async () => {
      const serviceId = 'service-id-123';
      const maintenanceData = {
        serviceId,
        mechanicId: 'non-existent-id',
        startDate: new Date('2025-01-15T08:00:00Z'),
      };

      const mockService = { id: serviceId };
      serviceRepository.findById.mockResolvedValue(mockService);
      userRepository.findById.mockResolvedValue(null);

      await expect(maintenanceService.createMaintenance(maintenanceData)).rejects.toThrow(AppError);
    });

    it('devrait calculer automatiquement la durée si endDate est fournie', async () => {
      const serviceId = 'service-id-123';
      const mechanicId = 'mechanic-id-123';
      const startDate = new Date('2025-01-15T08:00:00Z');
      const endDate = new Date('2025-01-15T17:00:00Z');
      const maintenanceData = {
        serviceId,
        mechanicId,
        startDate,
        endDate,
      };

      const mockService = { id: serviceId };
      const mockMechanic = { id: mechanicId };
      const mockMaintenance = {
        id: 'maintenance-id-123',
        ...maintenanceData,
        duration: 9,
      };

      serviceRepository.findById.mockResolvedValue(mockService);
      userRepository.findById.mockResolvedValue(mockMechanic);
      maintenanceRepository.create.mockResolvedValue(mockMaintenance);
      maintenanceRepository.findById.mockResolvedValue(mockMaintenance);

      await maintenanceService.createMaintenance(maintenanceData);

      expect(maintenanceRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 9, // 9 heures entre 8h et 17h
        })
      );
    });

    it('devrait échouer si endDate est avant startDate', async () => {
      const serviceId = 'service-id-123';
      const mechanicId = 'mechanic-id-123';
      const maintenanceData = {
        serviceId,
        mechanicId,
        startDate: new Date('2025-01-15T17:00:00Z'),
        endDate: new Date('2025-01-15T08:00:00Z'),
      };

      const mockService = { id: serviceId };
      const mockMechanic = { id: mechanicId };

      serviceRepository.findById.mockResolvedValue(mockService);
      userRepository.findById.mockResolvedValue(mockMechanic);

      await expect(maintenanceService.createMaintenance(maintenanceData)).rejects.toThrow(AppError);
    });
  });

  describe('updateMaintenance', () => {
    it('devrait mettre à jour une maintenance avec succès', async () => {
      const maintenanceId = 'maintenance-id-123';
      const updateData = {
        description: 'Nouvelle description',
        cost: 60000,
      };

      const mockMaintenance = {
        id: maintenanceId,
        description: 'Ancienne description',
        cost: 50000,
        status: MAINTENANCE_STATUS.PENDING,
      };

      const updatedMaintenance = {
        ...mockMaintenance,
        ...updateData,
      };

      maintenanceRepository.findById.mockResolvedValue(mockMaintenance);
      maintenanceRepository.update.mockResolvedValue(updatedMaintenance);

      const result = await maintenanceService.updateMaintenance(maintenanceId, updateData);

      expect(result).toEqual(updatedMaintenance);
      expect(maintenanceRepository.update).toHaveBeenCalledWith(maintenanceId, updateData);
    });

    it('devrait échouer si la maintenance n\'existe pas', async () => {
      const maintenanceId = 'non-existent-id';
      maintenanceRepository.findById.mockResolvedValue(null);

      await expect(maintenanceService.updateMaintenance(maintenanceId, {})).rejects.toThrow(AppError);
    });
  });

  describe('startMaintenance', () => {
    it('devrait démarrer une maintenance en attente', async () => {
      const maintenanceId = 'maintenance-id-123';
      const mockMaintenance = {
        id: maintenanceId,
        status: MAINTENANCE_STATUS.PENDING,
        startDate: new Date('2025-01-15T08:00:00Z'),
      };

      const updatedMaintenance = {
        ...mockMaintenance,
        status: MAINTENANCE_STATUS.IN_PROGRESS,
      };

      maintenanceRepository.findById.mockResolvedValue(mockMaintenance);
      maintenanceRepository.update.mockResolvedValue(updatedMaintenance);

      const result = await maintenanceService.startMaintenance(maintenanceId);

      expect(result).toEqual(updatedMaintenance);
      expect(maintenanceRepository.update).toHaveBeenCalledWith(
        maintenanceId,
        expect.objectContaining({
          status: MAINTENANCE_STATUS.IN_PROGRESS,
        })
      );
    });

    it('devrait échouer si la maintenance n\'est pas en attente', async () => {
      const maintenanceId = 'maintenance-id-123';
      const mockMaintenance = {
        id: maintenanceId,
        status: MAINTENANCE_STATUS.IN_PROGRESS,
      };

      maintenanceRepository.findById.mockResolvedValue(mockMaintenance);

      await expect(maintenanceService.startMaintenance(maintenanceId)).rejects.toThrow(AppError);
    });
  });

  describe('completeMaintenance', () => {
    it('devrait compléter une maintenance avec succès', async () => {
      const maintenanceId = 'maintenance-id-123';
      const startDate = new Date('2025-01-15T08:00:00Z');
      const endDate = new Date('2025-01-15T17:00:00Z');
      const mockMaintenance = {
        id: maintenanceId,
        status: MAINTENANCE_STATUS.IN_PROGRESS,
        startDate,
      };

      const completedMaintenance = {
        ...mockMaintenance,
        status: MAINTENANCE_STATUS.COMPLETED,
        endDate,
        duration: 9,
        cost: 50000,
      };

      maintenanceRepository.findById.mockResolvedValue(mockMaintenance);
      maintenanceRepository.update.mockResolvedValue(completedMaintenance);

      const result = await maintenanceService.completeMaintenance(
        maintenanceId,
        endDate,
        null,
        50000,
        null
      );

      expect(result).toEqual(completedMaintenance);
      expect(maintenanceRepository.update).toHaveBeenCalledWith(
        maintenanceId,
        expect.objectContaining({
          status: MAINTENANCE_STATUS.COMPLETED,
          endDate,
          duration: 9,
          cost: 50000,
        })
      );
    });

    it('devrait échouer si la maintenance est déjà complétée', async () => {
      const maintenanceId = 'maintenance-id-123';
      const mockMaintenance = {
        id: maintenanceId,
        status: MAINTENANCE_STATUS.COMPLETED,
      };

      maintenanceRepository.findById.mockResolvedValue(mockMaintenance);

      await expect(
        maintenanceService.completeMaintenance(maintenanceId, new Date(), null, null, null)
      ).rejects.toThrow(AppError);
    });
  });

  describe('deleteMaintenance', () => {
    it('devrait supprimer une maintenance avec succès', async () => {
      const maintenanceId = 'maintenance-id-123';
      const mockMaintenance = {
        id: maintenanceId,
        status: MAINTENANCE_STATUS.PENDING,
      };

      maintenanceRepository.findById.mockResolvedValue(mockMaintenance);
      maintenanceRepository.delete.mockResolvedValue(mockMaintenance);

      const result = await maintenanceService.deleteMaintenance(maintenanceId);

      expect(result).toEqual({ message: 'Maintenance supprimée avec succès' });
      expect(maintenanceRepository.delete).toHaveBeenCalledWith(maintenanceId);
    });

    it('devrait échouer si la maintenance est en cours', async () => {
      const maintenanceId = 'maintenance-id-123';
      const mockMaintenance = {
        id: maintenanceId,
        status: MAINTENANCE_STATUS.IN_PROGRESS,
      };

      maintenanceRepository.findById.mockResolvedValue(mockMaintenance);

      await expect(maintenanceService.deleteMaintenance(maintenanceId)).rejects.toThrow(AppError);
    });
  });
});

