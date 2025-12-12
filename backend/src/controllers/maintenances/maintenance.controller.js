const maintenanceService = require('../../services/maintenance/maintenance.service');
const { success, paginated } = require('../../utils/response');

/**
 * Créer une maintenance
 * POST /api/maintenances
 */
const createMaintenance = async (req, res, next) => {
  try {
    const maintenance = await maintenanceService.createMaintenance(req.body);
    return success(res, maintenance, 'Maintenance créée avec succès', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir une maintenance par ID
 * GET /api/maintenances/:id
 */
const getMaintenanceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const maintenance = await maintenanceService.getMaintenanceById(id);
    return success(res, maintenance, 'Maintenance récupérée avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir toutes les maintenances
 * GET /api/maintenances
 */
const getAllMaintenances = async (req, res, next) => {
  try {
    const {
      page,
      limit,
      serviceId,
      mechanicId,
      status,
      startDate,
      endDate,
    } = req.query;

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      ...(serviceId && { serviceId }),
      ...(mechanicId && { mechanicId }),
      ...(status && { status }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    };

    const result = await maintenanceService.getAllMaintenances(options);
    return paginated(
      res,
      result.maintenances,
      result.pagination,
      'Maintenances récupérées avec succès'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Mettre à jour une maintenance
 * PUT /api/maintenances/:id
 */
const updateMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const maintenance = await maintenanceService.updateMaintenance(id, req.body);
    return success(res, maintenance, 'Maintenance mise à jour avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Supprimer une maintenance
 * DELETE /api/maintenances/:id
 */
const deleteMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;
    await maintenanceService.deleteMaintenance(id);
    return success(res, null, 'Maintenance supprimée avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir les maintenances d'un service
 * GET /api/maintenances/service/:serviceId
 */
const getMaintenancesByService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const { page, limit, status } = req.query;

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      ...(status && { status }),
    };

    const result = await maintenanceService.getMaintenancesByService(serviceId, options);
    return paginated(
      res,
      result.maintenances,
      result.pagination,
      'Maintenances du service récupérées avec succès'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir les maintenances d'un mécanicien
 * GET /api/maintenances/mechanic/:mechanicId
 */
const getMaintenancesByMechanic = async (req, res, next) => {
  try {
    const { mechanicId } = req.params;
    const { page, limit, status } = req.query;

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      ...(status && { status }),
    };

    const result = await maintenanceService.getMaintenancesByMechanic(mechanicId, options);
    return paginated(
      res,
      result.maintenances,
      result.pagination,
      'Maintenances du mécanicien récupérées avec succès'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Démarrer une maintenance
 * POST /api/maintenances/:id/start
 */
const startMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const maintenance = await maintenanceService.startMaintenance(id);
    return success(res, maintenance, 'Maintenance démarrée avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Compléter une maintenance
 * POST /api/maintenances/:id/complete
 */
const completeMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { endDate, duration, cost, notes } = req.body;
    const maintenance = await maintenanceService.completeMaintenance(
      id,
      endDate,
      duration,
      cost,
      notes
    );
    return success(res, maintenance, 'Maintenance complétée avec succès');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createMaintenance,
  getMaintenanceById,
  getAllMaintenances,
  updateMaintenance,
  deleteMaintenance,
  getMaintenancesByService,
  getMaintenancesByMechanic,
  startMaintenance,
  completeMaintenance,
};

