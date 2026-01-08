import 'package:hallo/api_service.dart';
import 'package:hallo/models/api_response.dart';
import 'package:hallo/models/booking_model.dart';

class AdminCollection {
  AdminCollection._();

  final _api = ApiService.instance;

  static final AdminCollection instance = AdminCollection._();

  Future<ApiResponse<dynamic>> getDashboard() async {
    final response = await _api.get('/admin/dashboard');
    return ApiResponse.fromJson(response, null);
  }

  Future<ApiResponse<BookingModel>> confirmBooking(String id) async {
    final response = await _api.put('/admin/bookings/$id/confirm');
    return ApiResponse.fromJson(
      response,
      (json) => BookingModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<BookingModel>> cancelBooking({
    required String id,
    String? reason,
  }) async {
    final response = await _api.put(
      '/admin/bookings/$id/cancel',
      body: {if (reason != null) 'reason': reason},
    );
    return ApiResponse.fromJson(
      response,
      (json) => BookingModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<BookingModel>> completeBooking(String id) async {
    final response = await _api.put('/admin/bookings/$id/complete');
    return ApiResponse.fromJson(
      response,
      (json) => BookingModel.fromJson(json as Map<String, dynamic>),
    );
  }
}
