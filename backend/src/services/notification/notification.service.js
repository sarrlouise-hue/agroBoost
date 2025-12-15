const notificationRepository = require('../../data-access/notification.repository');
const { NOTIFICATION_TYPES } = require('../../config/constants');

/**
 * Service métier pour la gestion des notifications
 */
class NotificationService {
  async createNotification(userId, type, title, message, metadata = {}) {
    return notificationRepository.create({
      userId,
      type,
      title,
      message,
      metadata,
    });
  }

  async getUserNotifications(userId, options = {}) {
    const { count, rows } = await notificationRepository.findForUser(userId, options);

    return {
      notifications: rows,
      pagination: {
        page: parseInt(options.page || 1),
        limit: parseInt(options.limit || 20),
        total: count,
        totalPages: Math.ceil(count / (options.limit || 20)),
      },
    };
  }

  async markAsRead(userId, notificationId) {
    const notification = await notificationRepository.markAsRead(notificationId, userId);
    if (!notification) {
      return null;
    }
    return notification;
  }

  async markAllAsRead(userId) {
    await notificationRepository.markAllAsRead(userId);
  }

  async deleteNotificationByAdmin(notificationId) {
    const deleted = await notificationRepository.deleteById(notificationId);
    if (!deleted) {
      throw new Error('Notification non trouvée');
    }
    return { deleted: true, notificationId };
  }

  async getNotificationById(notificationId) {
    return notificationRepository.findById(notificationId);
  }

  async getAllNotifications(options = {}) {
    const { count, rows } = await notificationRepository.findAll(options);
    return {
      notifications: rows,
      pagination: {
        page: parseInt(options.page || 1),
        limit: parseInt(options.limit || 20),
        total: count,
        totalPages: Math.ceil(count / (options.limit || 20)),
      },
    };
  }
}

NotificationService.TYPES = NOTIFICATION_TYPES;

module.exports = new NotificationService();


