import 'package:hallo/api_service.dart';
import 'package:hallo/models/api_response.dart';
import 'package:hallo/models/payment_model.dart';
import 'package:hallo/models/paginated_response.dart';

class PaymentsCollection {
  PaymentsCollection._();

  final _api = ApiService.instance;

  static final PaymentsCollection instance = PaymentsCollection._();

  Future<ApiResponse<PaymentModel>> initiatePayment({
    required String bookingId,
    required double amount,
  }) async {
    final response = await _api.post(
      '/payments/initiate',
      body: {'bookingId': bookingId, 'amount': amount},
    );
    return ApiResponse.fromJson(
      response,
      (json) => PaymentModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<PaymentModel>> getPaymentById(String id) async {
    final response = await _api.get('/payments/$id');
    return ApiResponse.fromJson(
      response,
      (json) => PaymentModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<PaymentModel>> getPaymentStatus(String id) async {
    final response = await _api.get('/payments/$id/status');
    return ApiResponse.fromJson(
      response,
      (json) => PaymentModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<PaymentModel>> getPaymentStatusByBooking(
    String bookingId,
  ) async {
    final response = await _api.get('/payments/bookings/$bookingId/status');
    return ApiResponse.fromJson(
      response,
      (json) => PaymentModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<PaginatedResponse<PaymentModel>> getAllPayments({
    int page = 1,
    int limit = 20,
    String? status,
  }) async {
    final response = await _api.get(
      '/payments',
      queryParams: {
        'page': page.toString(),
        'limit': limit.toString(),
        if (status != null) 'status': status,
      },
    );
    return PaginatedResponse.fromJson(
      response,
      (json) => PaymentModel.fromJson(json as Map<String, dynamic>),
    );
  }
}
