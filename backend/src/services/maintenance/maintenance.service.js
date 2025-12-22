const maintenanceRepository = require("../../data-access/maintenance.repository");
const serviceRepository = require("../../data-access/service.repository");
const userRepository = require("../../data-access/user.repository");
const { AppError, ERROR_MESSAGES } = require("../../utils/errors");
const logger = require("../../utils/logger");
const { MAINTENANCE_STATUS, ROLES } = require("../../config/constants");

/**
 * Service pour les opérations sur les maintenances
 */
class MaintenanceService {
	/**
	 * Créer une nouvelle maintenance
	 */
	async createMaintenance(maintenanceData) {
		const {
			serviceId,
			mechanicId,
			startDate,
			endDate,
			duration,
			description,
			cost,
			notes,
		} = maintenanceData;

		// Vérifier que le service existe
		const service = await serviceRepository.findById(serviceId);
		if (!service) {
			throw new AppError("Service non trouvé", 404);
		}

		// Vérifier que le mécanicien existe
		const mechanic = await userRepository.findById(mechanicId);
		if (!mechanic) {
			throw new AppError("Mécanicien non trouvé", 404);
		}

		if (mechanic.role !== ROLES.MECHANIC) {
			throw new AppError("L'utilisateur spécifié n'est pas un mécanicien", 400);
		}

		// Calculer la durée si endDate est fournie mais pas duration
		let calculatedDuration = duration;
		if (endDate && !duration && startDate) {
			const start = new Date(startDate);
			const end = new Date(endDate);
			calculatedDuration = Math.round((end - start) / (1000 * 60 * 60)); // Durée en heures
		}

		// Valider que endDate est après startDate si les deux sont fournis
		if (endDate && startDate) {
			const start = new Date(startDate);
			const end = new Date(endDate);
			if (end <= start) {
				throw new AppError(
					"La date de fin doit être après la date de début",
					400
				);
			}
		}

		const maintenance = await maintenanceRepository.create({
			serviceId,
			mechanicId,
			startDate,
			endDate: endDate || null,
			duration: calculatedDuration || null,
			description: description || null,
			cost: cost || null,
			status: MAINTENANCE_STATUS.PENDING,
			notes: notes || null,
		});

		logger.info(
			`Maintenance créée: ${maintenance.id} pour le service ${serviceId} par le mécanicien ${mechanicId}`
		);

		return maintenanceRepository.findById(maintenance.id);
	}

	/**
	 * Obtenir une maintenance par ID
	 */
	async getMaintenanceById(id) {
		const maintenance = await maintenanceRepository.findById(id);
		if (!maintenance) {
			throw new AppError("Maintenance non trouvée", 404);
		}
		return maintenance;
	}

	/**
	 * Obtenir toutes les maintenances avec filtres
	 */
	async getAllMaintenances(options = {}) {
		return maintenanceRepository.findAll(options);
	}

	/**
	 * Mettre à jour une maintenance
	 */
	async updateMaintenance(id, updateData) {
		const maintenance = await maintenanceRepository.findById(id);
		if (!maintenance) {
			throw new AppError("Maintenance non trouvée", 404);
		}

		const {
			mechanicId,
			startDate,
			endDate,
			duration,
			description,
			cost,
			status,
			notes,
		} = updateData;

		// Vérifier que le mécanicien existe si on le change
		if (mechanicId && mechanicId !== maintenance.mechanicId) {
			const mechanic = await userRepository.findById(mechanicId);
			if (!mechanic) {
				throw new AppError("Mécanicien non trouvé", 404);
			}
			if (mechanic.role !== ROLES.MECHANIC) {
				throw new AppError(
					"L'utilisateur spécifié n'est pas un mécanicien",
					400
				);
			}
		}

		// Calculer la durée si endDate est fournie mais pas duration
		let calculatedDuration = duration;
		if (endDate && !duration && (startDate || maintenance.startDate)) {
			const start = new Date(startDate || maintenance.startDate);
			const end = new Date(endDate);
			calculatedDuration = Math.round((end - start) / (1000 * 60 * 60));
		}

		// Valider que endDate est après startDate si les deux sont fournis
		if (endDate && (startDate || maintenance.startDate)) {
			const start = new Date(startDate || maintenance.startDate);
			const end = new Date(endDate);
			if (end <= start) {
				throw new AppError(
					"La date de fin doit être après la date de début",
					400
				);
			}
		}

		// Si on passe le statut à "completed", s'assurer qu'il y a une endDate
		if (status === MAINTENANCE_STATUS.COMPLETED) {
			const finalEndDate = endDate || maintenance.endDate;
			if (!finalEndDate) {
				throw new AppError(
					"La date de fin est requise pour compléter une maintenance",
					400
				);
			}
			// Calculer automatiquement la durée si elle n'est pas fournie
			if (!calculatedDuration && !duration) {
				const start = new Date(startDate || maintenance.startDate);
				const end = new Date(finalEndDate);
				calculatedDuration = Math.round((end - start) / (1000 * 60 * 60));
			}
		}

		const updatedMaintenance = await maintenanceRepository.update(id, {
			...(mechanicId && { mechanicId }),
			...(startDate && { startDate }),
			...(endDate !== undefined && { endDate: endDate || null }),
			...(calculatedDuration !== undefined && {
				duration: calculatedDuration || null,
			}),
			...(description !== undefined && { description: description || null }),
			...(cost !== undefined && { cost: cost || null }),
			...(status && { status }),
			...(notes !== undefined && { notes: notes || null }),
		});

		logger.info(`Maintenance mise à jour: ${id}`);

		return updatedMaintenance;
	}

	/**
	 * Supprimer une maintenance
	 */
	async deleteMaintenance(id) {
		const maintenance = await maintenanceRepository.findById(id);
		if (!maintenance) {
			throw new AppError("Maintenance non trouvée", 404);
		}

		// Ne pas permettre la suppression si la maintenance est en cours
		if (maintenance.status === MAINTENANCE_STATUS.IN_PROGRESS) {
			throw new AppError(
				"Impossible de supprimer une maintenance en cours",
				400
			);
		}

		await maintenanceRepository.delete(id);
		logger.info(`Maintenance supprimée: ${id}`);
		return { message: "Maintenance supprimée avec succès" };
	}

	/**
	 * Obtenir les maintenances d'un service
	 */
	async getMaintenancesByService(serviceId, options = {}) {
		const service = await serviceRepository.findById(serviceId);
		if (!service) {
			throw new AppError("Service non trouvé", 404);
		}

		return maintenanceRepository.findByServiceId(serviceId, options);
	}

	/**
	 * Obtenir les maintenances d'un mécanicien
	 */
	async getMaintenancesByMechanic(mechanicId, options = {}) {
		const mechanic = await userRepository.findById(mechanicId);
		if (!mechanic) {
			throw new AppError("Mécanicien non trouvé", 404);
		}

		return maintenanceRepository.findByMechanicId(mechanicId, options);
	}

	/**
	 * Démarrer une maintenance (changer le statut à in_progress)
	 */
	async startMaintenance(id) {
		const maintenance = await maintenanceRepository.findById(id);
		if (!maintenance) {
			throw new AppError("Maintenance non trouvée", 404);
		}

		if (maintenance.status !== MAINTENANCE_STATUS.PENDING) {
			throw new AppError(
				"Seules les maintenances en attente peuvent être démarrées",
				400
			);
		}

		return maintenanceRepository.update(id, {
			status: MAINTENANCE_STATUS.IN_PROGRESS,
			startDate: maintenance.startDate || new Date(),
		});
	}

	/**
	 * Compléter une maintenance (changer le statut à completed)
	 */
	async completeMaintenance(id, endDate, duration, cost, notes) {
		const maintenance = await maintenanceRepository.findById(id);
		if (!maintenance) {
			throw new AppError("Maintenance non trouvée", 404);
		}

		if (maintenance.status === MAINTENANCE_STATUS.COMPLETED) {
			throw new AppError("Cette maintenance est déjà complétée", 400);
		}

		if (maintenance.status === MAINTENANCE_STATUS.CANCELLED) {
			throw new AppError(
				"Impossible de compléter une maintenance annulée",
				400
			);
		}

		const finalEndDate = endDate || new Date();
		const start = new Date(maintenance.startDate);
		const end = new Date(finalEndDate);
		const calculatedDuration =
			duration || Math.round((end - start) / (1000 * 60 * 60));

		return maintenanceRepository.update(id, {
			status: MAINTENANCE_STATUS.COMPLETED,
			endDate: finalEndDate,
			duration: calculatedDuration,
			...(cost !== undefined && { cost }),
			...(notes !== undefined && { notes }),
		});
	}

	/**
	 * Obtenir les statistiques de maintenance
	 */
	async getMaintenanceStats() {
		return maintenanceRepository.getStats();
	}
}

module.exports = new MaintenanceService();
