class ReviewModel {
  const ReviewModel({
    required this.id,
    required this.bookingId,
    required this.userId,
    required this.providerId,
    required this.serviceId,
    required this.rating,
    this.comment,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ReviewModel.fromJson(Map<String, dynamic> json) {
    return ReviewModel(
      id: json['id'] as String,
      bookingId: json['bookingId'] as String,
      userId: json['userId'] as String,
      providerId: json['providerId'] as String,
      serviceId: json['serviceId'] as String,
      rating: json['rating'] as int,
      comment: json['comment'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  final String id;

  final String bookingId;

  final String userId;

  final String providerId;

  final String serviceId;

  final int rating;

  final String? comment;

  final DateTime createdAt;

  final DateTime updatedAt;

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'bookingId': bookingId,
      'userId': userId,
      'providerId': providerId,
      'serviceId': serviceId,
      'rating': rating,
      'comment': comment,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
