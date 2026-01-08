class MaintenanceModel {
  const MaintenanceModel({
    required this.id,
    required this.serviceId,
    this.mechanicId,
    required this.startDate,
    this.endDate,
    required this.duration,
    required this.description,
    required this.cost,
    required this.status,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  factory MaintenanceModel.fromJson(Map<String, dynamic> json) {
    return MaintenanceModel(
      id: json['id'] as String,
      serviceId: json['serviceId'] as String,
      mechanicId: json['mechanicId'] as String?,
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: json['endDate'] != null
          ? DateTime.parse(json['endDate'] as String)
          : null,
      duration: json['duration'] as int,
      description: json['description'] as String,
      cost: (json['cost'] as num).toDouble(),
      status: json['status'] as String,
      notes: json['notes'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  final String id;

  final String serviceId;

  final String? mechanicId;

  final DateTime startDate;

  final DateTime? endDate;

  final int duration;

  final String description;

  final double cost;

  final String status;

  final String? notes;

  final DateTime createdAt;

  final DateTime updatedAt;

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'serviceId': serviceId,
      'mechanicId': mechanicId,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
      'duration': duration,
      'description': description,
      'cost': cost,
      'status': status,
      'notes': notes,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
