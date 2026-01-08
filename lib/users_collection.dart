import 'package:hallo/api_service.dart';
import 'package:hallo/models/api_response.dart';
import 'package:hallo/models/user_model.dart';
import 'package:hallo/models/paginated_response.dart';

class UsersCollection {
  UsersCollection._();

  final _api = ApiService.instance;

  static final UsersCollection instance = UsersCollection._();

  Future<ApiResponse<UserModel>> getProfile() async {
    final response = await _api.get('/users/profile');
    return ApiResponse.fromJson(
      response,
      (json) => UserModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<UserModel>> updateLocation({
    required double latitude,
    required double longitude,
    String? address,
  }) async {
    final response = await _api.put(
      '/users/location',
      body: {
        'latitude': latitude,
        'longitude': longitude,
        if (address != null) 'address': address,
      },
    );
    return ApiResponse.fromJson(
      response,
      (json) => UserModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<UserModel>> updateLanguage({
    required String language,
  }) async {
    final response = await _api.put(
      '/users/language',
      body: {'language': language},
    );
    return ApiResponse.fromJson(
      response,
      (json) => UserModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<UserModel>> createUser({
    required String phoneNumber,
    required String password,
    required String firstName,
    required String lastName,
    String? email,
    required String role,
    String language = 'fr',
  }) async {
    final response = await _api.post(
      '/users',
      body: {
        'phoneNumber': phoneNumber,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
        if (email != null) 'email': email,
        'role': role,
        'language': language,
      },
    );
    return ApiResponse.fromJson(
      response,
      (json) => UserModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<PaginatedResponse<UserModel>> getAllUsers({
    int page = 1,
    int limit = 20,
    String? role,
  }) async {
    final response = await _api.get(
      '/users',
      queryParams: {
        'page': page.toString(),
        'limit': limit.toString(),
        if (role != null) 'role': role,
      },
    );
    return PaginatedResponse.fromJson(
      response,
      (json) => UserModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<UserModel>> getUserById(String id) async {
    final response = await _api.get('/users/${id}');
    return ApiResponse.fromJson(
      response,
      (json) => UserModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<UserModel>> updateUser({
    required String id,
    String? firstName,
    String? lastName,
    String? email,
    String? role,
    bool? isVerified,
  }) async {
    final response = await _api.put(
      '/users/$id',
      body: {
        if (firstName != null) 'firstName': firstName,
        if (lastName != null) 'lastName': lastName,
        if (email != null) 'email': email,
        if (role != null) 'role': role,
        if (isVerified != null) 'isVerified': isVerified,
      },
    );
    return ApiResponse.fromJson(
      response,
      (json) => UserModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<dynamic>> deleteUser(String id) async {
    final response = await _api.delete('/users/${id}');
    return ApiResponse.fromJson(response, null);
  }

  Future<ApiResponse<UserModel>> updateProfile({
    String? firstName,
    String? lastName,
    String? email,
    String? address,
    String? phoneNumber,
  }) async {
    final response = await _api.put(
      '/users/profile',
      body: {
        if (firstName != null) 'firstName': firstName,
        if (lastName != null) 'lastName': lastName,
        if (email != null) 'email': email,
        if (address != null) 'address': address,
        if (phoneNumber != null) 'phoneNumber': phoneNumber,
      },
    );
    return ApiResponse.fromJson(
      response,
      (json) => UserModel.fromJson(json as Map<String, dynamic>),
    );
  }
}
