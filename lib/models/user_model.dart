class UserModel {
  const UserModel({
    required this.id,
    required this.phoneNumber,
    required this.firstName,
    required this.lastName,
    this.email,
    required this.language,
    required this.role,
    required this.isVerified,
    this.latitude,
    this.longitude,
    this.address,
    required this.createdAt,
    required this.updatedAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String? ?? '',
      phoneNumber: json['phoneNumber'] as String? ?? '',
      firstName: json['firstName'] as String? ?? '',
      lastName: json['lastName'] as String? ?? '',
      email: json['email'] as String?,
      language: json['language'] as String? ?? 'fr',
      role: json['role'] as String? ?? 'user',
      isVerified: json['isVerified'] as bool? ?? false,
      latitude: json['latitude'] as double?,
      longitude: json['longitude'] as double?,
      address: json['address'] as String?,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : DateTime.now(),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : DateTime.now(),
    );
  }

  final String id;

  final String phoneNumber;

  final String firstName;

  final String lastName;

  final String? email;

  final String language;

  final String role;

  final bool isVerified;

  final double? latitude;

  final double? longitude;

  final String? address;

  final DateTime createdAt;

  final DateTime updatedAt;

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'phoneNumber': phoneNumber,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'language': language,
      'role': role,
      'isVerified': isVerified,
      'latitude': latitude,
      'longitude': longitude,
      'address': address,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
