import 'package:hallo/api_service.dart';
import 'package:hallo/models/api_response.dart';
import 'package:hallo/models/service_model.dart';
import 'package:hallo/models/paginated_response.dart';

class ServicesCollection {
  ServicesCollection._();

  final _api = ApiService.instance;

  static final ServicesCollection instance = ServicesCollection._();

  Future<ApiResponse<ServiceModel>> createService({
    required String serviceType,
    required String name,
    required String description,
    required double pricePerHour,
    required double pricePerDay,
    List<String>? images,
    double? latitude,
    double? longitude,
  }) async {
    final response = await _api.post(
      '/services',
      body: {
        'serviceType': serviceType,
        'name': name,
        'description': description,
        'pricePerHour': pricePerHour,
        'pricePerDay': pricePerDay,
        if (images != null) 'images': images,
        if (latitude != null) 'latitude': latitude,
        if (longitude != null) 'longitude': longitude,
      },
    );
    return ApiResponse.fromJson(
      response,
      (json) => ServiceModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<PaginatedResponse<ServiceModel>> getAllServices({
    int page = 1,
    int limit = 20,
    String? serviceType,
    bool? availability,
  }) async {
    final response = await _api.get(
      '/services',
      queryParams: {
        'page': page.toString(),
        'limit': limit.toString(),
        if (serviceType != null) 'serviceType': serviceType,
        if (availability != null) 'availability': availability.toString(),
      },
      requiresAuth: false,
    );
    return PaginatedResponse.fromJson(
      response,
      (json) => ServiceModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<PaginatedResponse<ServiceModel>> getMyServices({
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _api.get(
      '/services/my-services',
      queryParams: {'page': page.toString(), 'limit': limit.toString()},
    );
    return PaginatedResponse.fromJson(
      response,
      (json) => ServiceModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<PaginatedResponse<ServiceModel>> getProviderServices({
    required String providerId,
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _api.get(
      '/services/provider/$providerId',
      queryParams: {'page': page.toString(), 'limit': limit.toString()},
      requiresAuth: false,
    );
    return PaginatedResponse.fromJson(
      response,
      (json) => ServiceModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<ServiceModel>> getServiceById(String id) async {
    final response = await _api.get('/services/$id', requiresAuth: false);
    return ApiResponse.fromJson(
      response,
      (json) => ServiceModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<ServiceModel>> updateService({
    required String id,
    String? name,
    String? description,
    double? pricePerHour,
    double? pricePerDay,
    List<String>? images,
    bool? availability,
  }) async {
    final response = await _api.put(
      '/services/$id',
      body: {
        if (name != null) 'name': name,
        if (description != null) 'description': description,
        if (pricePerHour != null) 'pricePerHour': pricePerHour,
        if (pricePerDay != null) 'pricePerDay': pricePerDay,
        if (images != null) 'images': images,
        if (availability != null) 'availability': availability,
      },
    );
    return ApiResponse.fromJson(
      response,
      (json) => ServiceModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<dynamic>> deleteService(String id) async {
    final response = await _api.delete('/services/$id');
    return ApiResponse.fromJson(response, null);
  }

  Future<ApiResponse<ServiceModel>> updateAvailability({
    required String id,
    required bool availability,
  }) async {
    final response = await _api.put(
      '/services/$id/availability',
      body: {'availability': availability},
    );
    return ApiResponse.fromJson(
      response,
      (json) => ServiceModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<PaginatedResponse<ServiceModel>> searchServices({
    String? query,
    String? serviceType,
    double? minPrice,
    double? maxPrice,
    double? latitude,
    double? longitude,
    double? radius,
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _api.get(
      '/services/search',
      queryParams: {
        if (query != null) 'query': query,
        if (serviceType != null) 'serviceType': serviceType,
        if (minPrice != null) 'minPrice': minPrice.toString(),
        if (maxPrice != null) 'maxPrice': maxPrice.toString(),
        if (latitude != null) 'latitude': latitude.toString(),
        if (longitude != null) 'longitude': longitude.toString(),
        if (radius != null) 'radius': radius.toString(),
        'page': page.toString(),
        'limit': limit.toString(),
      },
      requiresAuth: false,
    );
    return PaginatedResponse.fromJson(
      response,
      (json) => ServiceModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<PaginatedResponse<ServiceModel>> getNearbyServices({
    required double latitude,
    required double longitude,
    double radius = 10.0,
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _api.get(
      '/services/nearby',
      queryParams: {
        'latitude': latitude.toString(),
        'longitude': longitude.toString(),
        'radius': radius.toString(),
        'page': page.toString(),
        'limit': limit.toString(),
      },
      requiresAuth: false,
    );
    return PaginatedResponse.fromJson(
      response,
      (json) => ServiceModel.fromJson(json as Map<String, dynamic>),
    );
  }
}
