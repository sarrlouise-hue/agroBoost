class TractorMaintenance {
  TractorMaintenance({
    required this.id,
    required this.name,
    required this.model,
    required this.year,
    required this.currentEngineHours,
    required this.lastMaintenanceDate,
    required this.nextMaintenanceHours,
    required this.nextMaintenanceDate,
    required this.healthStatus,
    required this.totalMaintenanceCost,
    required this.totalMaintenanceCount,
  });

  final String id;

  final String name;

  final String model;

  final int year;

  final int currentEngineHours;

  final DateTime lastMaintenanceDate;

  final int nextMaintenanceHours;

  final DateTime nextMaintenanceDate;

  final String healthStatus;

  final double totalMaintenanceCost;

  final int totalMaintenanceCount;

  int get hoursUntilMaintenance {
    return nextMaintenanceHours - currentEngineHours;
  }

  int get daysUntilMaintenance {
    return nextMaintenanceDate.difference(DateTime.now()).inDays;
  }
}
