class MaintenanceRecord {
  MaintenanceRecord({
    required this.id,
    required this.tractorId,
    required this.tractorName,
    required this.date,
    required this.type,
    required this.title,
    required this.description,
    required this.cost,
    required this.engineHours,
    this.technician,
    required this.partsReplaced,
    required this.status,
    this.imageUrl,
  });

  final String id;

  final String tractorId;

  final String tractorName;

  final DateTime date;

  final String type;

  final String title;

  final String description;

  final double cost;

  final int engineHours;

  final String? technician;

  final List<String> partsReplaced;

  final String status;

  final String? imageUrl;
}
