class MaintenanceAlert {
  MaintenanceAlert({
    required this.id,
    required this.tractorId,
    required this.tractorName,
    required this.type,
    required this.title,
    required this.description,
    required this.dueDate,
    this.targetEngineHours,
    required this.priority,
    this.isRead = false,
  });

  final String id;

  final String tractorId;

  final String tractorName;

  final String type;

  final String title;

  final String description;

  final DateTime dueDate;

  final int? targetEngineHours;

  final String priority;

  final bool isRead;

  int get daysUntilMaintenance {
    return dueDate.difference(DateTime.now()).inDays;
  }

  bool get isOverdue {
    return daysUntilMaintenance < 0;
  }
}
