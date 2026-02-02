class ProviderModel {
  const ProviderModel({
    required this.id,
    required this.userId,
    required this.businessName,
    required this.description,
    required this.documents,
    required this.isApproved,
    required this.rating,
    required this.totalBookings,
    this.latitude,
    this.longitude,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ProviderModel.fromJson(Map<String, dynamic> json) {
    return ProviderModel(
      id: json['id'] as String,
      userId: json['userId'] as String,
      businessName: json['businessName'] as String,
      description: json['description'] as String,
      documents: (json['documents'] as List).cast<String>(),
      isApproved: json['isApproved'] as bool,
      rating: (json['rating'] as num).toDouble(),
      totalBookings: json['totalBookings'] as int,
      latitude: json['latitude'] as double?,
      longitude: json['longitude'] as double?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  final String id;

  final String userId;

  final String businessName;

  final String description;

  final List<String> documents;

  final bool isApproved;

  final double rating;

  final int totalBookings;

  final double? latitude;

  final double? longitude;

  final DateTime createdAt;

  final DateTime updatedAt;

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'businessName': businessName,
      'description': description,
      'documents': documents,
      'isApproved': isApproved,
      'rating': rating,
      'totalBookings': totalBookings,
      'latitude': latitude,
      'longitude': longitude,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
