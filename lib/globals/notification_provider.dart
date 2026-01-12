import 'package:flutter/material.dart';
import 'package:hallo/app_notification.dart';
import 'package:hallo/tractor_maintenance.dart';
import 'package:provider/provider.dart';

class NotificationProvider extends ChangeNotifier {
  NotificationProvider();

  factory NotificationProvider.of(BuildContext context, {bool listen = false}) {
    return Provider.of<NotificationProvider>(context, listen: listen);
  }

  final List<AppNotification> _notifications = [];

  int _unreadCount = 0;

  List<AppNotification> get notifications {
    return _notifications;
  }

  int get unreadCount {
    return _unreadCount;
  }

  void addNotification(AppNotification notification) {
    _notifications.insert(0, notification);
    if (!notification.isRead) {
      _unreadCount++;
    }
    notifyListeners();
  }

  void markAsRead(String notificationId) {
    final index = _notifications.indexWhere((n) => n.id == notificationId);
    if (index != -1 && !_notifications[index].isRead) {
      _notifications[index] = AppNotification(
        id: _notifications[index].id,
        title: _notifications[index].title,
        body: _notifications[index].body,
        type: _notifications[index].type,
        timestamp: _notifications[index].timestamp,
        isRead: true,
        data: _notifications[index].data,
      );
      _unreadCount--;
      notifyListeners();
    }
  }

  void markAllAsRead() {
    for (var i = 0; i < _notifications.length; i++) {
      if (!_notifications[i].isRead) {
        _notifications[i] = AppNotification(
          id: _notifications[i].id,
          title: _notifications[i].title,
          body: _notifications[i].body,
          type: _notifications[i].type,
          timestamp: _notifications[i].timestamp,
          isRead: true,
          data: _notifications[i].data,
        );
      }
    }
    _unreadCount = 0;
    notifyListeners();
  }

  void deleteNotification(String notificationId) {
    final index = _notifications.indexWhere((n) => n.id == notificationId);
    if (index != -1) {
      if (!_notifications[index].isRead) {
        _unreadCount--;
      }
      _notifications.removeAt(index);
      notifyListeners();
    }
  }

  void clearAll() {
    _notifications.clear();
    _unreadCount = 0;
    notifyListeners();
  }

  void scheduleMaintenanceReminder(TractorMaintenance tractor) {
    if (tractor.daysUntilMaintenance <= 7) {
      addNotification(
        AppNotification(
          id: 'maint_${tractor.id}_${DateTime.now().millisecondsSinceEpoch}',
          title: 'Entretien à prévoir',
          body:
              '${tractor.name} nécessite un entretien dans ${tractor.daysUntilMaintenance} jours',
          type: 'maintenance',
          timestamp: DateTime.now(),
          isRead: false,
          data: {'tractorId': tractor.id},
        ),
      );
    }
  }

  void notifyReservationConfirmed(String tractorName, DateTime date) {
    addNotification(
      AppNotification(
        id: 'res_${DateTime.now().millisecondsSinceEpoch}',
        title: 'Réservation confirmée',
        body:
            '$tractorName réservé pour le ${date.day}/${date.month}/${date.year}',
        type: 'reservation',
        timestamp: DateTime.now(),
        isRead: false,
      ),
    );
  }

  void notifyPaymentReceived(double amount) {
    addNotification(
      AppNotification(
        id: 'pay_${DateTime.now().millisecondsSinceEpoch}',
        title: 'Paiement reçu',
        body: 'Vous avez reçu ${amount.toStringAsFixed(0)} FCFA',
        type: 'payment',
        timestamp: DateTime.now(),
        isRead: false,
      ),
    );
  }
}
