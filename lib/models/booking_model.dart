class BookingModel {
  const BookingModel({
    required this.id,
    required this.userId,
    required this.serviceId,
    required this.providerId,
    this.startDate,
    this.endDate,
    this.bookingDate,
    this.startTime,
    this.endTime,
    required this.type,
    required this.duration,
    required this.totalPrice,
    required this.status,
    this.latitude,
    this.longitude,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['id'] as String,
      userId: json['userId'] as String,
      serviceId: json['serviceId'] as String,
      providerId: json['providerId'] as String,
      startDate: _parseNullableDate(json['startDate']),
      endDate: _parseNullableDate(json['endDate']),
      bookingDate: _parseNullableDate(json['bookingDate']),
      startTime: json['startTime'] as String?,
      endTime: json['endTime'] as String?,
      type: json['type'] as String,
      duration: json['duration'] as int,
      totalPrice: _toDouble(json['totalPrice']),
      status: json['status'] as String,
      latitude: _toDoubleNullable(json['latitude']),
      longitude: _toDoubleNullable(json['longitude']),
      notes: json['notes'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  final String id;

  final String userId;

  final String serviceId;

  final String providerId;

  final DateTime? startDate;

  final DateTime? endDate;

  final DateTime? bookingDate;

  final String? startTime;

  final String? endTime;

  final String type;

  final int duration;

  final double totalPrice;

  final String status;

  final double? latitude;

  final double? longitude;

  final String? notes;

  final DateTime createdAt;

  final DateTime updatedAt;

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'serviceId': serviceId,
      'providerId': providerId,
      if (startDate != null) 'startDate': startDate!.toIso8601String(),
      if (endDate != null) 'endDate': endDate!.toIso8601String(),
      if (bookingDate != null)
        'bookingDate': bookingDate!.toIso8601String().split('T')[0],
      if (startTime != null) 'startTime': startTime,
      if (endTime != null) 'endTime': endTime,
      'type': type,
      'duration': duration,
      'totalPrice': totalPrice,
      'status': status,
      if (latitude != null) 'latitude': latitude,
      if (longitude != null) 'longitude': longitude,
      if (notes != null) 'notes': notes,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  static DateTime? _parseNullableDate(dynamic value) {
    if (value == null) {
      return null;
    }
    if (value is String) {
      return DateTime.parse(value);
    }
    return null;
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
