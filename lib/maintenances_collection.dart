import 'package:hallo/api_service.dart';
import 'package:hallo/models/api_response.dart';
import 'package:hallo/models/maintenance_model.dart';
import 'package:hallo/models/paginated_response.dart';

class MaintenancesCollection {
  MaintenancesCollection._();

  final _api = ApiService.instance;

  static final MaintenancesCollection instance = MaintenancesCollection._();

  Future<ApiResponse<MaintenanceModel>> createMaintenance({
    required String serviceId,
    required String startDate,
    required int duration,
    required String description,
    required double cost,
    String? mechanicId,
    String? notes,
  }) async {
    final response = await _api.post(
      '/maintenances',
      body: {
        'serviceId': serviceId,
        'startDate': startDate,
        'duration': duration,
        'description': description,
        'cost': cost,
        if (mechanicId != null) 'mechanicId': mechanicId,
        if (notes != null) 'notes': notes,
      },
    );
    return ApiResponse.fromJson(
      response,
      (json) => MaintenanceModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<PaginatedResponse> getAllMaintenances({
    int page = 1,
    int limit = 20,
    String? status,
  }) async {
    final response = await _api.get(
      '/maintenances',
      queryParams: {
        'page': page.toString(),
        'limit': limit.toString(),
        if (status != null) 'status': status,
      },
    );
    return PaginatedResponse.fromJson(
      response,
      (json) => MaintenanceModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<dynamic>> getMaintenanceStats() async {
    final response = await _api.get('/maintenances/stats/reports');
    return ApiResponse.fromJson(response, null);
  }

  Future<ApiResponse<MaintenanceModel>> getMaintenanceById(String id) async {
    final response = await _api.get('/maintenances/$id');
    return ApiResponse.fromJson(
      response,
      (json) => MaintenanceModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<MaintenanceModel>> updateMaintenance({
    required String id,
    String? description,
    double? cost,
    String? notes,
    String? status,
  }) async {
    final response = await _api.put(
      '/maintenances/$id',
      body: {
        if (description != null) 'description': description,
        if (cost != null) 'cost': cost,
        if (notes != null) 'notes': notes,
        if (status != null) 'status': status,
      },
    );
    return ApiResponse.fromJson(
      response,
      (json) => MaintenanceModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<dynamic>> deleteMaintenance(String id) async {
    final response = await _api.delete('/maintenances/$id');
    return ApiResponse.fromJson(response, null);
  }

  Future<PaginatedResponse> getServiceMaintenances({
    required String serviceId,
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _api.get(
      '/maintenances/service/$serviceId',
      queryParams: {'page': page.toString(), 'limit': limit.toString()},
    );
    return PaginatedResponse.fromJson(
      response,
      (json) => MaintenanceModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<PaginatedResponse> getMechanicMaintenances({
    required String mechanicId,
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _api.get(
      '/maintenances/mechanic/$mechanicId',
      queryParams: {'page': page.toString(), 'limit': limit.toString()},
    );
    return PaginatedResponse.fromJson(
      response,
      (json) => MaintenanceModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<MaintenanceModel>> startMaintenance(String id) async {
    final response = await _api.post('/maintenances/$id/start');
    return ApiResponse.fromJson(
      response,
      (json) => MaintenanceModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<MaintenanceModel>> completeMaintenance({
    required String id,
    String? notes,
  }) async {
    final response = await _api.post(
      '/maintenances/$id/complete',
      body: {if (notes != null) 'notes': notes},
    );
    return ApiResponse.fromJson(
      response,
      (json) => MaintenanceModel.fromJson(json as Map<String, dynamic>),
    );
  }
}
