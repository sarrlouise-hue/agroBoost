import 'package:hallo/api_service.dart';
import 'package:hallo/models/api_response.dart';
import 'package:hallo/models/auth_response.dart';

class AuthCollection {
  AuthCollection._();

  final ApiService _api = ApiService.instance;

  static final AuthCollection instance = AuthCollection._();

  Future<ApiResponse<AuthResponse>> register({
    required String phoneNumber,
    required String password,
    required String firstName,
    required String lastName,
    String? email,
    String role = 'user',
    String language = 'fr',
  }) async {
    try {
      final response = await _api.post(
        '/auth/register',
        body: {
          'phoneNumber': phoneNumber,
          'password': password,
          'firstName': firstName,
          'lastName': lastName,
          if (email != null) 'email': email,
          'role': role,
          'language': language,
        },
        requiresAuth: false,
      );
      final authResponse = AuthResponse.fromJson(response);
      return ApiResponse<AuthResponse>(
        success: authResponse.success,
        message: authResponse.message,
        data: authResponse,
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<ApiResponse<AuthResponse>> refreshToken() async {
    try {
      final response = await _api.post(
        '/auth/refresh-token',
        body: {'refreshToken': _api.refreshToken},
        requiresAuth: false,
      );
      final authResponse = AuthResponse.fromJson(response);
      if (authResponse.token.isNotEmpty) {
        _api.setTokens(
          accessToken: authResponse.token,
          refreshToken: authResponse.refreshToken,
        );
      }
      return ApiResponse<AuthResponse>(
        success: authResponse.success,
        message: authResponse.message,
        data: authResponse,
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<ApiResponse<dynamic>> logout() async {
    try {
      final response = await _api.post('/auth/logout', requiresAuth: true);
      _api.clearTokens();
      return ApiResponse<dynamic>(
        success: response['success'] as bool,
        message: response['message'] as String,
        data: response['data'],
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<ApiResponse<dynamic>> forgotPassword({
    required String phoneNumber,
  }) async {
    try {
      final response = await _api.post(
        '/auth/forgot-password',
        body: {'phoneNumber': phoneNumber},
        requiresAuth: false,
      );
      return ApiResponse<dynamic>(
        success: response['success'] as bool,
        message: response['message'] as String,
        data: response['data'],
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<ApiResponse<dynamic>> resetPassword({
    required String token,
    required String newPassword,
  }) async {
    try {
      final response = await _api.post(
        '/auth/reset-password',
        body: {'token': token, 'newPassword': newPassword},
        requiresAuth: false,
      );
      return ApiResponse<dynamic>(
        success: response['success'] as bool,
        message: response['message'] as String,
        data: response['data'],
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<ApiResponse<dynamic>> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    try {
      final response = await _api.post(
        '/auth/change-password',
        body: {'currentPassword': currentPassword, 'newPassword': newPassword},
        requiresAuth: true,
      );
      return ApiResponse<dynamic>(
        success: response['success'] as bool,
        message: response['message'] as String,
        data: response['data'],
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<ApiResponse<dynamic>> resendOtp({required String email}) async {
    try {
      final response = await _api.post(
        '/auth/resend-otp',
        body: {'email': email},
        requiresAuth: false,
      );
      return ApiResponse(
        success: response['success'] ?? true,
        message: response['message'] ?? 'OTP resent successfully',
        data: response['data'],
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<ApiResponse<AuthResponse>> verifyOtp({
    required String email,
    required String code,
  }) async {
    try {
      final response = await _api.post(
        '/auth/verify-otp',
        body: {'email': email, 'code': code},
        requiresAuth: false,
      );
      final authResponse = AuthResponse.fromJson(response);
      _api.setTokens(
        accessToken: authResponse.token,
        refreshToken: authResponse.refreshToken,
      );
      await _api.saveTokensToStorage();
      return ApiResponse(
        success: authResponse.success,
        message: authResponse.message,
        data: authResponse,
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<ApiResponse<AuthResponse>> login({
    required String phoneNumber,
    required String password,
  }) async {
    try {
      final response = await _api.post(
        '/auth/login',
        body: {'phoneNumber': phoneNumber, 'password': password},
        requiresAuth: false,
      );
      final authResponse = AuthResponse.fromJson(response);
      if (authResponse.token.isNotEmpty) {
        _api.setTokens(
          accessToken: authResponse.token,
          refreshToken: authResponse.refreshToken,
        );
        await _api.saveTokensToStorage();
      }
      return ApiResponse<AuthResponse>(
        success: authResponse.success,
        message: authResponse.message,
        data: authResponse,
      );
    } catch (e) {
      rethrow;
    }
  }
}
