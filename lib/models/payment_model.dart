class PaymentModel {
  const PaymentModel({
    required this.id,
    required this.bookingId,
    required this.userId,
    required this.providerId,
    required this.amount,
    required this.paymentMethod,
    this.transactionId,
    this.paytechTransactionId,
    required this.status,
    this.paymentDate,
    this.metadata,
    required this.createdAt,
    required this.updatedAt,
  });

  factory PaymentModel.fromJson(Map<String, dynamic> json) {
    return PaymentModel(
      id: json['id'] as String,
      bookingId: json['bookingId'] as String,
      userId: json['userId'] as String,
      providerId: json['providerId'] as String,
      amount: (json['amount'] as num).toDouble(),
      paymentMethod: json['paymentMethod'] as String,
      transactionId: json['transactionId'] as String?,
      paytechTransactionId: json['paytechTransactionId'] as String?,
      status: json['status'] as String,
      paymentDate: json['paymentDate'] != null
          ? DateTime.parse(json['paymentDate'] as String)
          : null,
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  final String id;

  final String bookingId;

  final String userId;

  final String providerId;

  final double amount;

  final String paymentMethod;

  final String? transactionId;

  final String? paytechTransactionId;

  final String status;

  final DateTime? paymentDate;

  final Map<String, dynamic>? metadata;

  final DateTime createdAt;

  final DateTime updatedAt;

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'bookingId': bookingId,
      'userId': userId,
      'providerId': providerId,
      'amount': amount,
      'paymentMethod': paymentMethod,
      'transactionId': transactionId,
      'paytechTransactionId': paytechTransactionId,
      'status': status,
      'paymentDate': paymentDate?.toIso8601String(),
      'metadata': metadata,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
