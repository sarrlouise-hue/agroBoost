class AppNotification {
  AppNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.type,
    required this.timestamp,
    required this.isRead,
    this.data,
  });

  final String id;

  final String title;

  final String body;

  final String type;

  final DateTime timestamp;

  final bool isRead;

  final Map<String, dynamic>? data;
}
