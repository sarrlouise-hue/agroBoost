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
    this.brand,
    this.model,
    this.year,
    this.technicalSpecifications,
    this.provider,
  });

  factory ServiceModel.fromJson(Map<String, dynamic> json) {
    print('🧩 DEBUG ServiceModel.fromJson RAW JSON: $json');
    return ServiceModel(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      serviceType: json['serviceType'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      pricePerHour: _toDouble(json['pricePerHour']),
      pricePerDay: _toDouble(json['pricePerDay']),
      images: (json['images'] as List?)?.cast<String>() ?? [],
      availability: json['availability'] as bool? ?? true,
      latitude: _toDoubleNullable(json['latitude']),
      longitude: _toDoubleNullable(json['longitude']),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      brand: json['brand'] as String?,
      model: json['model'] as String?,
      year: json['year'] as int?,
      technicalSpecifications:
          json['technicalSpecifications'] as Map<String, dynamic>?,
      provider: json['provider'] != null
          ? ServiceProvider.fromJson(json['provider'] as Map<String, dynamic>)
          : null,
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
  final String? brand;
  final String? model;
  final int? year;
  final Map<String, dynamic>? technicalSpecifications;
  final ServiceProvider? provider;

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
      'brand': brand,
      'model': model,
      'year': year,
      'technicalSpecifications': technicalSpecifications,
      if (provider != null) 'provider': provider!.toJson(),
    };
  }

  static double _toDouble(dynamic value) {
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) return double.tryParse(value) ?? 0.0;
    if (value is num) return value.toDouble();
    return 0.0;
  }

  static double? _toDoubleNullable(dynamic value) {
    if (value == null) return null;
    return _toDouble(value);
  }
}

class ServiceProvider {
  const ServiceProvider({
    required this.id,
    this.firstName,
    this.lastName,
    this.phoneNumber,
  });

  factory ServiceProvider.fromJson(Map<String, dynamic> json) {
    final user = json['user'] as Map<String, dynamic>?;
    return ServiceProvider(
      id: json['id'] as String,
      firstName: user?['firstName'] as String?,
      lastName: user?['lastName'] as String?,
      phoneNumber: user?['phoneNumber'] as String?,
    );
  }

  final String id;
  final String? firstName;
  final String? lastName;
  final String? phoneNumber;

  String get fullName => '${firstName ?? ''} ${lastName ?? ''}'.trim();

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user': {
        'firstName': firstName,
        'lastName': lastName,
        'phoneNumber': phoneNumber,
      },
    };
  }
}
