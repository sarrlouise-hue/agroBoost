const Maintenance = require('../models/Maintenance');
const { Op } = require('sequelize');

/**
 * Repository pour les opérations sur les maintenances
 * Encapsule toutes les requêtes PostgreSQL pour les maintenances
 */
class MaintenanceRepository {
  /**
   * Créer une nouvelle maintenance
   */
  async create(maintenanceData) {
    return Maintenance.create(maintenanceData);
  }

  /**
   * Trouver une maintenance par ID avec les relations
   */
  async findById(id) {
    return Maintenance.findByPk(id, {
      include: [
        {
          association: 'service',
          include: [
            {
              association: 'provider',
              include: ['user'],
            },
          ],
        },
        {
          association: 'mechanic',
        },
      ],
    });
  }

  /**
   * Trouver toutes les maintenances avec filtres
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 20,
      serviceId,
      mechanicId,
      status,
      startDate,
      endDate,
    } = options;

    const where = {};
    if (serviceId) where.serviceId = serviceId;
    if (mechanicId) where.mechanicId = mechanicId;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.startDate = {};
      if (startDate) where.startDate[Op.gte] = new Date(startDate);
      if (endDate) where.startDate[Op.lte] = new Date(endDate);
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Maintenance.findAndCountAll({
      where,
      include: [
        {
          association: 'service',
          include: [
            {
              association: 'provider',
              include: ['user'],
            },
          ],
        },
        {
          association: 'mechanic',
        },
      ],
      order: [['startDate', 'DESC']],
      limit,
      offset,
    });

    return {
      maintenances: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Mettre à jour une maintenance
   */
  async update(id, updateData) {
    const maintenance = await Maintenance.findByPk(id);
    if (!maintenance) {
      return null;
    }
    await maintenance.update(updateData);
    return maintenance.reload({
      include: [
        {
          association: 'service',
          include: [
            {
              association: 'provider',
              include: ['user'],
            },
          ],
        },
        {
          association: 'mechanic',
        },
      ],
    });
  }

  /**
   * Supprimer une maintenance
   */
  async delete(id) {
    const maintenance = await Maintenance.findByPk(id);
    if (!maintenance) {
      return null;
    }
    await maintenance.destroy();
    return maintenance;
  }

  /**
   * Trouver les maintenances par service
   */
  async findByServiceId(serviceId, options = {}) {
    const { page = 1, limit = 20, status } = options;
    const where = { serviceId };
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    const { count, rows } = await Maintenance.findAndCountAll({
      where,
      include: [
        {
          association: 'mechanic',
        },
      ],
      order: [['startDate', 'DESC']],
      limit,
      offset,
    });

    return {
      maintenances: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Trouver les maintenances par mécanicien
   */
  async findByMechanicId(mechanicId, options = {}) {
    const { page = 1, limit = 20, status } = options;
    const where = { mechanicId };
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    const { count, rows } = await Maintenance.findAndCountAll({
      where,
      include: [
        {
          association: 'service',
          include: [
            {
              association: 'provider',
              include: ['user'],
            },
          ],
        },
      ],
      order: [['startDate', 'DESC']],
      limit,
      offset,
    });

    return {
      maintenances: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Trouver les maintenances en cours
   */
  async findInProgress() {
    return Maintenance.findAll({
      where: {
        status: 'in_progress',
      },
      include: [
        {
          association: 'service',
          include: [
            {
              association: 'provider',
              include: ['user'],
            },
          ],
        },
        {
          association: 'mechanic',
        },
      ],
      order: [['startDate', 'ASC']],
    });
  }
}

module.exports = new MaintenanceRepository();

