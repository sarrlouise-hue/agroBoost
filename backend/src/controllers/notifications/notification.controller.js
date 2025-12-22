const notificationService = require('../../services/notification/notification.service');
const { success, paginated } = require('../../utils/response');
const { ROLES } = require('../../config/constants');

/**
 * Obtenir les notifications de l'utilisateur connecté
 * GET /api/notifications
 */
const getMyNotifications = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page, limit, isRead } = req.query;
    const result = await notificationService.getUserNotifications(userId, {
      page,
      limit,
      isRead: isRead !== undefined ? isRead === 'true' : null,
    });
    return paginated(
      res,
      result.notifications,
      result.pagination,
      'Notifications récupérées avec succès'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Marquer une notification comme lue
 * PATCH /api/notifications/:id/read
 */
const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const notification = await notificationService.markAsRead(userId, id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée',
      });
    }
    return success(res, notification, 'Notification marquée comme lue');
  } catch (err) {
    next(err);
  }
};

/**
 * Marquer toutes les notifications comme lues
 * PATCH /api/notifications/read-all
 */
const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    await notificationService.markAllAsRead(userId);
    return success(res, null, 'Toutes les notifications ont été marquées comme lues');
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir une notification par ID (admin seulement)
 * GET /api/notifications/:id
 */
const getNotificationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.getNotificationById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée',
      });
    }
    return success(res, notification, 'Notification récupérée avec succès');
  } catch (err) {
    next(err);
  }
};

/**
 * Obtenir toutes les notifications (admin seulement)
 * GET /api/notifications/all
 */
const getAllNotifications = async (req, res, next) => {
  try {
    const { page, limit, userId, type, isRead, startDate, endDate } = req.query;
    const result = await notificationService.getAllNotifications({
      page,
      limit,
      userId,
      type,
      isRead: isRead !== undefined ? isRead === 'true' : null,
      startDate,
      endDate,
    });
    return paginated(
      res,
      result.notifications,
      result.pagination,
      'Notifications récupérées avec succès'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Supprimer une notification (admin seulement)
 * DELETE /api/notifications/:id
 */
const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await notificationService.deleteNotificationByAdmin(id);
    return success(res, result, 'Notification supprimée avec succès');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getNotificationById,
  getAllNotifications,
  deleteNotification,
};


