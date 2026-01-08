import 'package:hallo/api_service.dart';
import 'package:hallo/models/api_response.dart';
import 'package:hallo/models/provider_model.dart';

class ProvidersCollection {
  ProvidersCollection._();

  final _api = ApiService.instance;

  static final ProvidersCollection instance = ProvidersCollection._();

  Future<ApiResponse<ProviderModel>> registerProvider({
    required String businessName,
    required String description,
    List<String>? documents,
    double? latitude,
    double? longitude,
  }) async {
    final response = await _api.post(
      '/providers/register',
      body: {
        'businessName': businessName,
        'description': description,
        if (documents != null) 'documents': documents,
        if (latitude != null) 'latitude': latitude,
        if (longitude != null) 'longitude': longitude,
      },
    );
    return ApiResponse.fromJson(
      response,
      (json) => ProviderModel.fromJson(json as Map<String, dynamic>),
    );
  }
}
