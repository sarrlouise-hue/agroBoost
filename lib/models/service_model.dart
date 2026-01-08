class ServiceModel {
  const ServiceModel({
    required this.id,
    required this.providerId,
    required this.serviceType,
    required this.name,
    required this.description,
    required this.pricePerHour,
    required this.pricePerDay,
    required this.images,
    required this.availability,
    this.latitude,
    this.longitude,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ServiceModel.fromJson(Map<String, dynamic> json) {
    return ServiceModel(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      serviceType: json['serviceType'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      pricePerHour: _toDouble(json['pricePerHour']),
      pricePerDay: _toDouble(json['pricePerDay']),
      images: (json['images'] as List).cast<String>(),
      availability: json['availability'] as bool,
      latitude: _toDoubleNullable(json['latitude']),
      longitude: _toDoubleNullable(json['longitude']),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  final String id;

  final String providerId;

  final String serviceType;

  final String name;

  final String description;

  final double pricePerHour;

  final double pricePerDay;

  final List<String> images;

  final bool availability;

  final double? latitude;

  final double? longitude;

  final DateTime createdAt;

  final DateTime updatedAt;

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'providerId': providerId,
      'serviceType': serviceType,
      'name': name,
      'description': description,
      'pricePerHour': pricePerHour,
      'pricePerDay': pricePerDay,
      'images': images,
      'availability': availability,
      'latitude': latitude,
      'longitude': longitude,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  static double _toDouble(dynamic value) {
    if (value is double) {
      return value;
    }
    if (value is int) {
      return value.toDouble();
    }
    if (value is String) {
      return double.parse(value);
    }
    if (value is num) {
      return value.toDouble();
    }
    return 0.0;
  }

  static double? _toDoubleNullable(dynamic value) {
    if (value == null) {
      return null;
    }
    return _toDouble(value);
  }
}
