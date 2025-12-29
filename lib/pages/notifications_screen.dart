import 'package:flutter/material.dart';
import 'package:allotracteur/globals/notification_provider.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() {
    return _NotificationsScreenState();
  }
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  String _formatTimestamp(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);
    if (difference.inMinutes < 1) {
      return 'À l\'instant';
    } else {
      if (difference.inHours < 1) {
        return 'Il y a ${difference.inMinutes} min';
      } else {
        if (difference.inDays < 1) {
          return 'Il y a ${difference.inHours}h';
        } else {
          if (difference.inDays < 7) {
            return 'Il y a ${difference.inDays}j';
          } else {
            return '${timestamp.day}/${timestamp.month}/${timestamp.year}';
          }
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final notificationProvider = NotificationProvider.of(context);
    final notifications = notificationProvider.notifications;
    final bottomPadding = MediaQuery.of(context).viewPadding.bottom > 0
        ? MediaQuery.of(context).viewPadding.bottom + 16.0
        : 32.0;
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Notifications'),
            Text(
              'Notifications yu',
              style: TextStyle(fontSize: 12.0, fontStyle: FontStyle.italic),
            ),
          ],
        ),
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0.0,
        actions: [
          if (notifications.isNotEmpty)
            IconButton(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Confirmer'),
                    content: const Text(
                      'Marquer toutes les notifications comme lues ?',
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Annuler'),
                      ),
                      TextButton(
                        onPressed: () {
                          notificationProvider.markAllAsRead();
                          Navigator.pop(context);
                        },
                        child: const Text('Confirmer'),
                      ),
                    ],
                  ),
                );
              },
              icon: const Icon(Icons.done_all),
              tooltip: 'Tout marquer comme lu',
            ),
          if (notifications.isNotEmpty)
            IconButton(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Confirmer'),
                    content: const Text('Supprimer toutes les notifications ?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Annuler'),
                      ),
                      TextButton(
                        onPressed: () {
                          notificationProvider.clearAll();
                          Navigator.pop(context);
                        },
                        child: const Text('Supprimer'),
                      ),
                    ],
                  ),
                );
              },
              icon: const Icon(Icons.delete_sweep),
              tooltip: 'Tout supprimer',
            ),
        ],
      ),
      body: notifications.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.notifications_none,
                    size: 80.0,
                    color: Theme.of(context).colorScheme.outlineVariant,
                  ),
                  const SizedBox(height: 16.0),
                  Text(
                    'Aucune notification',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                  ),
                  const SizedBox(height: 8.0),
                  Text(
                    'Amul notification',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Theme.of(
                            context,
                          ).colorScheme.onSurfaceVariant.withValues(alpha: 0.7),
                          fontStyle: FontStyle.italic,
                        ),
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: EdgeInsets.fromLTRB(16.0, 16.0, 16.0, bottomPadding),
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                final notification = notifications[index];
                IconData icon;
                Color color;
                if (notification.type == 'maintenance') {
                  icon = Icons.build_circle;
                  color = const Color(0xffe56d4b);
                } else {
                  if (notification.type == 'reservation') {
                    icon = Icons.calendar_today;
                    color = Colors.blue;
                  } else {
                    if (notification.type == 'payment') {
                      icon = Icons.payment;
                      color = Colors.green;
                    } else {
                      icon = Icons.info;
                      color = Colors.grey;
                    }
                  }
                }
                return Dismissible(
                  key: Key(notification.id),
                  direction: DismissDirection.endToStart,
                  background: Container(
                    margin: const EdgeInsets.only(bottom: 12.0),
                    padding: const EdgeInsets.symmetric(horizontal: 20.0),
                    decoration: BoxDecoration(
                      color: Colors.red,
                      borderRadius: BorderRadius.circular(16.0),
                    ),
                    alignment: Alignment.centerRight,
                    child: const Icon(Icons.delete, color: Colors.white),
                  ),
                  onDismissed: (direction) {
                    notificationProvider.deleteNotification(notification.id);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Notification supprimée'),
                        duration: Duration(seconds: 2),
                      ),
                    );
                  },
                  child: Card(
                    margin: const EdgeInsets.only(bottom: 12.0),
                    elevation: 0.0,
                    color: notification.isRead
                        ? Theme.of(context).colorScheme.surface
                        : color.withValues(alpha: 0.1),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16.0),
                      side: BorderSide(
                        color: notification.isRead
                            ? Theme.of(context).colorScheme.outlineVariant
                            : color.withValues(alpha: 0.3),
                        width: 1.0,
                      ),
                    ),
                    child: InkWell(
                      onTap: () {
                        if (!notification.isRead) {
                          notificationProvider.markAsRead(notification.id);
                        }
                      },
                      borderRadius: BorderRadius.circular(16.0),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10.0),
                              decoration: BoxDecoration(
                                color: color.withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(12.0),
                              ),
                              child: Icon(icon, color: color, size: 24.0),
                            ),
                            const SizedBox(width: 16.0),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Text(
                                          notification.title,
                                          style: Theme.of(context)
                                              .textTheme
                                              .titleMedium
                                              ?.copyWith(
                                                fontWeight: notification.isRead
                                                    ? FontWeight.normal
                                                    : FontWeight.bold,
                                              ),
                                        ),
                                      ),
                                      if (!notification.isRead)
                                        Container(
                                          width: 8.0,
                                          height: 8.0,
                                          decoration: BoxDecoration(
                                            color: color,
                                            shape: BoxShape.circle,
                                          ),
                                        ),
                                    ],
                                  ),
                                  const SizedBox(height: 4.0),
                                  Text(
                                    notification.body,
                                    style: Theme.of(context)
                                        .textTheme
                                        .bodyMedium
                                        ?.copyWith(
                                          color: Theme.of(
                                            context,
                                          ).colorScheme.onSurfaceVariant,
                                        ),
                                  ),
                                  const SizedBox(height: 8.0),
                                  Row(
                                    children: [
                                      Icon(
                                        Icons.access_time,
                                        size: 14.0,
                                        color: Theme.of(
                                          context,
                                        ).colorScheme.onSurfaceVariant,
                                      ),
                                      const SizedBox(width: 4.0),
                                      Text(
                                        _formatTimestamp(
                                          notification.timestamp,
                                        ),
                                        style: Theme.of(context)
                                            .textTheme
                                            .bodySmall
                                            ?.copyWith(
                                              color: Theme.of(
                                                context,
                                              ).colorScheme.onSurfaceVariant,
                                            ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
    );
  }
}
