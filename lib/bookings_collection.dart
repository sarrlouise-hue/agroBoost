import 'package:hallo/api_service.dart';
import 'package:hallo/models/paginated_response.dart';
import 'package:hallo/models/api_response.dart';
import 'package:hallo/models/booking_model.dart';

class BookingsCollection {
  BookingsCollection._();

  final _api = ApiService.instance;

  static final BookingsCollection instance = BookingsCollection._();

  Future<PaginatedResponse> getAllBookings({
    int page = 1,
    int limit = 20,
    String? status,
  }) async {
    final response = await _api.get(
      '/bookings',
      queryParams: {
        'page': page.toString(),
        'limit': limit.toString(),
        if (status != null) 'status': status,
      },
    );
    return PaginatedResponse.fromJson(
      response,
      (json) => BookingModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<BookingModel>> getBookingById(String id) async {
    final response = await _api.get('/bookings/${id}');
    return ApiResponse.fromJson(
      response,
      (json) => BookingModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<BookingModel>> confirmBooking(String id) async {
    final response = await _api.put('/bookings/${id}/confirm');
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
      '/bookings/$id/cancel',
      body: {if (reason != null) 'reason': reason},
    );
    return ApiResponse.fromJson(
      response,
      (json) => BookingModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<BookingModel>> completeBooking(String id) async {
    final response = await _api.put('/bookings/${id}/complete');
    return ApiResponse.fromJson(
      response,
      (json) => BookingModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<dynamic>> deleteBooking(String id) async {
    final response = await _api.delete('/bookings/${id}');
    return ApiResponse.fromJson(response, null);
  }

  Future<ApiResponse<BookingModel>> createBooking({
    required String serviceId,
    required String bookingDate,
    required String startTime,
    required String endTime,
    required int duration,
    required String type,
    double? latitude,
    double? longitude,
    String? notes,
  }) async {
    final startDate = '${bookingDate}T$startTime:00.000Z';
    final endDate = '${bookingDate}T$endTime:00.000Z';
    print('═══════════════════════════════════════════════════════');
    print('📤 CRÉATION RÉSERVATION - DONNÉES TRANSFORMÉES');
    print('═══════════════════════════════════════════════════════');
    print('🔄 Transformation:');
    print('   bookingDate: $bookingDate');
    print('   startTime: $startTime');
    print('   endTime: $endTime');
    print('   ➡️  startDate: $startDate');
    print('   ➡️  endDate: $endDate');
    print('═══════════════════════════════════════════════════════');
    final response = await _api.post(
      '/bookings',
      body: {
        'serviceId': serviceId,
        'startDate': startDate,
        'endDate': endDate,
        'type': type,
        if (latitude != null) 'latitude': latitude,
        if (longitude != null) 'longitude': longitude,
        if (notes != null) 'notes': notes,
      },
    );
    return ApiResponse.fromJson(
      response,
      (json) => BookingModel.fromJson(json as Map<String, dynamic>),
    );
  }
}
