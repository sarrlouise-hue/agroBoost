const Notification = require('../models/Notification');
const { Op } = require('sequelize');

/**
 * Repository pour les opérations sur les notifications
 */
class NotificationRepository {
  async create(data) {
    return Notification.create(data);
  }

  async findById(id) {
    return Notification.findByPk(id);
  }

  async findForUser(userId, options = {}) {
    const { page = 1, limit = 20, isRead = null } = options;
    const offset = (page - 1) * limit;

    const where = { userId };
    if (isRead !== null) {
      where.isRead = isRead;
    }

    return Notification.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
    });
  }

  async markAsRead(id, userId) {
    const notification = await Notification.findOne({
      where: { id, userId },
    });
    if (!notification) return null;
    await notification.update({ isRead: true });
    return notification;
  }

  async markAllAsRead(userId) {
    await Notification.update(
      { isRead: true },
      {
        where: { userId, isRead: false },
      }
    );
  }

  async deleteById(id) {
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return false;
    }
    await notification.destroy();
    return true;
  }

  async findAll(options = {}) {
    const { page = 1, limit = 20, userId = null, type = null, isRead = null, startDate = null, endDate = null } = options;
    const offset = (page - 1) * limit;

    const where = {};
    if (userId) where.userId = userId;
    if (type) where.type = type;
    if (isRead !== null) where.isRead = isRead;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    return Notification.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
    });
  }
}

module.exports = new NotificationRepository();


