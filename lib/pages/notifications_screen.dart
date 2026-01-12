import 'package:flutter/material.dart';
import 'package:hallo/globals/notification_provider.dart';

class NotificationsScreen extends StatefulWidget {
    const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() {
    return _NotificationsScreenState();
  }
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  @override
  Widget build(BuildContext context) {
    final notificationProvider = NotificationProvider.of(context);
    final notifications = notificationProvider.notifications;
    final bottomPadding = MediaQuery.of(context).viewPadding.bottom;
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surfaceContainerHighest,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Notifications'),
            Text(
              '${notifications.length} ${notifications.length <= 1 ? 'notification' : 'notifications'}',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
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
                  builder: (dialogContext) => AlertDialog(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20.0),
                    ),
                    title: Row(
                      children: [
                        Icon(
                          Icons.done_all,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                        const SizedBox(width: 8.0),
                        const Text('Marquer comme lu'),
                      ],
                    ),
                    content: const Text(
                      'Marquer toutes les notifications comme lues ?',
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(dialogContext),
                        child: const Text('Annuler'),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          notificationProvider.markAllAsRead();
                          Navigator.pop(dialogContext);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Theme.of(
                            context,
                          ).colorScheme.primary,
                          foregroundColor: Colors.white,
                        ),
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
                  builder: (dialogContext) => AlertDialog(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20.0),
                    ),
                    title: Row(
                      children: [
                        Icon(
                          Icons.delete_sweep,
                          color: Theme.of(context).colorScheme.error,
                        ),
                        const SizedBox(width: 8.0),
                        const Text('Supprimer tout'),
                      ],
                    ),
                    content: const Text('Supprimer toutes les notifications ?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(dialogContext),
                        child: const Text('Annuler'),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          notificationProvider.clearAll();
                          Navigator.pop(dialogContext);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Theme.of(context).colorScheme.error,
                          foregroundColor: Colors.white,
                        ),
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
                  Container(
                    padding: const EdgeInsets.all(32.0),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Theme.of(
                            context,
                          ).colorScheme.primary.withValues(alpha: 0.1),
                          Theme.of(
                            context,
                          ).colorScheme.secondary.withValues(alpha: 0.05),
                        ],
                      ),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.notifications_none,
                      size: 80.0,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                  const SizedBox(height: 24.0),
                  Text(
                    'Aucune notification',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  Text(
                    'Vous êtes à jour !',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: EdgeInsets.fromLTRB(
                16.0,
                16.0,
                16.0,
                bottomPadding > 0 ? bottomPadding + 16.0 : 80.0,
              ),
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                final notification = notifications[index];
                IconData icon;
                Color iconColor;
                Color bgColor;
                if (notification.type == 'maintenance') {
                  icon = Icons.build_circle;
                  iconColor = Theme.of(context).colorScheme.tertiary;
                  bgColor = Theme.of(context).colorScheme.tertiaryContainer;
                } else {
                  if (notification.type == 'reservation') {
                    icon = Icons.calendar_today;
                    iconColor = Theme.of(context).colorScheme.secondary;
                    bgColor = Theme.of(context).colorScheme.secondaryContainer;
                  } else {
                    if (notification.type == 'payment') {
                      icon = Icons.payment;
                      iconColor = Theme.of(context).colorScheme.primary;
                      bgColor = Theme.of(context).colorScheme.primaryContainer;
                    } else {
                      icon = Icons.info;
                      iconColor = Theme.of(
                        context,
                      ).colorScheme.onSurfaceVariant;
                      bgColor = Theme.of(
                        context,
                      ).colorScheme.surfaceContainerHighest;
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
                      gradient: LinearGradient(
                        colors: [
                          Theme.of(context).colorScheme.error,
                          Theme.of(
                            context,
                          ).colorScheme.error.withValues(alpha: 0.8),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(16.0),
                    ),
                    alignment: Alignment.centerRight,
                    child: const Icon(
                      Icons.delete,
                      color: Colors.white,
                      size: 28.0,
                    ),
                  ),
                  onDismissed: (direction) {
                    notificationProvider.deleteNotification(notification.id);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: const Text('Notification supprimée'),
                        backgroundColor: Theme.of(
                          context,
                        ).colorScheme.secondaryContainer,
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                        duration: const Duration(seconds: 2),
                        margin: EdgeInsets.only(
                          bottom: bottomPadding > 0
                              ? bottomPadding + 16.0
                              : 80.0,
                          left: 16.0,
                          right: 16.0,
                        ),
                      ),
                    );
                  },
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12.0),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.surface,
                      borderRadius: BorderRadius.circular(16.0),
                      border: notification.isRead
                          ? null
                          : Border.all(
                              color: iconColor.withValues(alpha: 0.3),
                              width: 2.0,
                            ),
                      boxShadow: [
                        BoxShadow(
                          color: notification.isRead
                              ? Colors.black.withValues(alpha: 0.05)
                              : iconColor.withValues(alpha: 0.12),
                          blurRadius: notification.isRead ? 4.0 : 8.0,
                          offset: const Offset(0.0, 2.0),
                        ),
                      ],
                    ),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: () {
                          if (!notification.isRead) {
                            notificationProvider.markAsRead(notification.id);
                          }
                        },
                        borderRadius: BorderRadius.circular(16.0),
                        child: Padding(
                          padding: const EdgeInsets.all(14.0),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10.0),
                                decoration: BoxDecoration(
                                  color: bgColor.withValues(alpha: 0.5),
                                  borderRadius: BorderRadius.circular(12.0),
                                ),
                                child: Icon(icon, color: iconColor, size: 22.0),
                              ),
                              const SizedBox(width: 12.0),
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
                                                .titleSmall
                                                ?.copyWith(
                                                  fontWeight:
                                                      notification.isRead
                                                      ? FontWeight.w600
                                                      : FontWeight.bold,
                                                  color: notification.isRead
                                                      ? Theme.of(
                                                          context,
                                                        ).colorScheme.onSurface
                                                      : iconColor,
                                                ),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        if (!notification.isRead)
                                          Container(
                                            width: 8.0,
                                            height: 8.0,
                                            margin: const EdgeInsets.only(
                                              left: 8.0,
                                            ),
                                            decoration: BoxDecoration(
                                              color: iconColor,
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
                                          .bodySmall
                                          ?.copyWith(
                                            color: Theme.of(
                                              context,
                                            ).colorScheme.onSurfaceVariant,
                                          ),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 6.0),
                                    Row(
                                      children: [
                                        Icon(
                                          Icons.access_time,
                                          size: 12.0,
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
                                                fontSize: 11.0,
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
                  ),
                );
              },
            ),
    );
  }

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
}
