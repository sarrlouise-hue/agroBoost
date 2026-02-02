// ignore_for_file: avoid_print

import 'package:dio/dio.dart';
import 'package:allotracteur/api_exception.dart';
import 'package:allotracteur/main.dart';

class ApiService {
  ApiService._();

  final Dio _dio = Dio(
    BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ),
  );

  String? _accessToken;

  String? _refreshToken;

  String? get accessToken {
    return _accessToken;
  }

  String? get refreshToken {
    return _refreshToken;
  }

  bool get isAuthenticated {
    return _accessToken != null;
  }

  static final ApiService instance = ApiService._();

  static const String baseUrl = 'https://agro-boost-ruddy.vercel.app/api';

  Map<String, dynamic> _handleResponse(Response<dynamic> response) {
    final statusCode = response.statusCode ?? 0;
    if (statusCode >= 200 && statusCode < 300) {
      if (response.data is Map<String, dynamic>) {
        return response.data as Map<String, dynamic>;
      } else {
        return {'success': true, 'message': 'Success', 'data': response.data};
      }
    } else {
      String errorMessage = 'Request failed';
      if (response.data is Map<String, dynamic>) {
        errorMessage = response.data['message'] ?? errorMessage;
      }
      throw ApiException(errorMessage, statusCode);
    }
  }

  ApiException _handleDioError(DioException error) {
    if (error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.sendTimeout ||
        error.type == DioExceptionType.receiveTimeout) {
      return const ApiException(
        'Connection timeout. Please check your internet connection.',
        0,
      );
    }
    if (error.type == DioExceptionType.badResponse) {
      final statusCode = error.response?.statusCode ?? 0;
      String message = 'Request failed';
      if (error.response?.data is Map<String, dynamic>) {
        final data = error.response?.data;
        message = data['message'] ?? message;
        if (data['errors'] != null) {
          message += ': ${data['errors']}';
        }
      } else if (error.response?.data != null) {
        message = error.response!.data.toString();
      }
      return ApiException(message, statusCode);
    }
    if (error.type == DioExceptionType.cancel) {
      return const ApiException('Request cancelled', 0);
    }
    return const ApiException(
      'Network error. Please check your internet connection.',
      0,
    );
  }

  Future<Map<String, dynamic>> get(
    String endpoint, {
    Map<String, String>? queryParams,
    bool requiresAuth = true,
  }) async {
    try {
      final response = await _dio.get(
        endpoint,
        queryParameters: queryParams,
        options: Options(
          headers: requiresAuth && _accessToken != null
              ? {'Authorization': 'Bearer ${_accessToken}'}
              : null,
        ),
      );
      return _handleResponse(response);
    } catch (error) {
      if (error is DioException) {
        throw _handleDioError(error);
      }
      if (error is ApiException) {
        rethrow;
      }
      throw ApiException('GET request failed: ${error}', 0);
    }
  }

  Future<Map<String, dynamic>> put(
    String endpoint, {
    Map<String, dynamic>? body,
    bool requiresAuth = true,
  }) async {
    try {
      print('\n═══════════════════════════════════════════════════════');
      print('📤 PUT REQUEST - DIAGNOSTIC COMPLET');
      print('═══════════════════════════════════════════════════════');
      print('🌐 URL complète: ${baseUrl}${endpoint}');
      print('🔐 Requires Auth: ${requiresAuth}');
      print('🔑 Token présent: ${_accessToken != null}');
      print('📦 Body envoyé:');
      if (body != null) {
        body.forEach((key, value) {
          print('   ${key}: ${value} (${value.runtimeType})');
        });
      } else {
        print('   (null)');
      }
      print('═══════════════════════════════════════════════════════\n');
      final response = await _dio.put(
        endpoint,
        data: body,
        options: Options(
          headers: requiresAuth && _accessToken != null
              ? {'Authorization': 'Bearer ${_accessToken}'}
              : null,
        ),
      );
      print('═══════════════════════════════════════════════════════');
      print('📥 PUT RESPONSE - SUCCÈS');
      print('═══════════════════════════════════════════════════════');
      print('✅ Status Code: ${response.statusCode}');
      print('📦 Data reçue:');
      print(response.data);
      print('═══════════════════════════════════════════════════════\n');
      return _handleResponse(response);
    } catch (error) {
      print('\n═══════════════════════════════════════════════════════');
      print('❌ PUT ERROR - DIAGNOSTIC COMPLET');
      print('═══════════════════════════════════════════════════════');
      print('🌐 Endpoint: ${endpoint}');
      if (error is DioException) {
        print('🔴 Type: DioException');
        print('🔴 Status Code: ${error.response?.statusCode}');
        print('🔴 Response data: ${error.response?.data}');
        print('🔴 Error message: ${error.message}');
        print('═══════════════════════════════════════════════════════\n');
        throw _handleDioError(error);
      }
      rethrow;
    }
  }

  Future<Map<String, dynamic>> patch(
    String endpoint, {
    Map<String, dynamic>? body,
    bool requiresAuth = true,
  }) async {
    try {
      final response = await _dio.patch(
        endpoint,
        data: body,
        options: Options(
          headers: requiresAuth && _accessToken != null
              ? {'Authorization': 'Bearer ${_accessToken}'}
              : null,
        ),
      );
      return _handleResponse(response);
    } catch (error) {
      if (error is DioException) {
        throw _handleDioError(error);
      }
      if (error is ApiException) {
        rethrow;
      }
      throw ApiException('PATCH request failed: ${error}', 0);
    }
  }

  Future<Map<String, dynamic>> delete(
    String endpoint, {
    bool requiresAuth = true,
  }) async {
    try {
      final response = await _dio.delete(
        endpoint,
        options: Options(
          headers: requiresAuth && _accessToken != null
              ? {'Authorization': 'Bearer ${_accessToken}'}
              : null,
        ),
      );
      return _handleResponse(response);
    } catch (error) {
      if (error is DioException) {
        throw _handleDioError(error);
      }
      if (error is ApiException) {
        rethrow;
      }
      throw ApiException('DELETE request failed: ${error}', 0);
    }
  }

  Future<void> saveTokensToStorage() async {
    if (_accessToken != null) {
      await sharedPrefs.setString('access_token', _accessToken!);
    }
    if (_refreshToken != null) {
      await sharedPrefs.setString('refresh_token', _refreshToken!);
    }
  }

  Future<void> loadTokensFromStorage() async {
    _accessToken = sharedPrefs.getString('access_token');
    _refreshToken = sharedPrefs.getString('refresh_token');
  }

  void clearTokens() {
    _accessToken = null;
    _refreshToken = null;
    sharedPrefs.remove('access_token');
    sharedPrefs.remove('refresh_token');
  }

  void setTokens({String? accessToken, String? refreshToken}) {
    _accessToken = accessToken;
    _refreshToken = refreshToken;
  }

  Future<Map<String, dynamic>> post(
    String endpoint, {
    dynamic body,
    bool requiresAuth = true,
  }) async {
    try {
      print('\n═══════════════════════════════════════════════════════');
      print('📤 POST REQUEST - DIAGNOSTIC COMPLET');
      print('═══════════════════════════════════════════════════════');
      print('🌐 URL complète: ${baseUrl}${endpoint}');
      print('🔐 Requires Auth: ${requiresAuth}');
      print('🔑 Token présent: ${_accessToken != null}');
      if (_accessToken != null) {
        print(
          '🔑 Token (20 premiers chars): ${_accessToken?.substring(0, _accessToken!.length > 20 ? 20 : _accessToken?.length)}...',
        );
      }
      print('📦 Body envoyé:');
      if (body != null) {
        if (body is Map) {
          body.forEach((key, value) {
            print('   ${key}: ${value} (${value.runtimeType})');
          });
        } else if (body is FormData) {
          print('   FormData Content:');
          print('   Fields: ${body.fields}');
          print(
              '   Files: ${body.files.map((f) => '${f.key}: ${f.value.filename}').toList()}');
        } else {
          print('   ${body.toString()} (${body.runtimeType})');
        }
      } else {
        print('   (null)');
      }
      print('═══════════════════════════════════════════════════════\n');
      final options = Options(
        headers: {
          if (requiresAuth && _accessToken != null)
            'Authorization': 'Bearer ${_accessToken}',
        },
      );

      if (body is FormData) {
        // Let Dio set the Content-Type with boundary
        // We do NOT explicitly set Content-Type here, Dio handles it for FormData
      }

      Response<dynamic> response;
      if (body is FormData) {
        // Use a fresh Dio instance for FormData to avoid BaseOptions Content-Type conflict
        final formDataDio = Dio(
          BaseOptions(
            baseUrl: baseUrl,
            connectTimeout: const Duration(seconds: 30),
            receiveTimeout: const Duration(seconds: 30),
            headers: {
              if (requiresAuth && _accessToken != null)
                'Authorization': 'Bearer ${_accessToken}',
            },
          ),
        );
        response = await formDataDio.post(endpoint, data: body);
      } else {
        response = await _dio.post(
          endpoint,
          data: body,
          options: options,
        );
      }
      print('═══════════════════════════════════════════════════════');
      print('📥 POST RESPONSE - SUCCÈS');
      print('═══════════════════════════════════════════════════════');
      print('✅ Status Code: ${response.statusCode}');
      print('📋 Headers:');
      response.headers.forEach((name, values) {
        print('   ${name}: ${values.join(', ')}');
      });
      print('📦 Data reçue:');
      print(response.data);
      print('═══════════════════════════════════════════════════════\n');
      return _handleResponse(response);
    } catch (error) {
      print('\n═══════════════════════════════════════════════════════');
      print('❌ POST ERROR - DIAGNOSTIC COMPLET');
      print('═══════════════════════════════════════════════════════');
      print('🌐 Endpoint: ${endpoint}');
      if (error is DioException) {
        print('🔴 Type: DioException');
        print('🔴 Error type: ${error.type}');
        print('🔴 Status Code: ${error.response?.statusCode}');
        print('🔴 Response data:');
        print(error.response?.data);
        print('🔴 Response headers:');
        error.response?.headers.forEach((name, values) {
          print('   ${name}: ${values.join(', ')}');
        });
        print('🔴 Error message: ${error.message}');
        print('🔴 Request data: ${error.requestOptions.data}');
        print('═══════════════════════════════════════════════════════\n');
        throw _handleDioError(error);
      }
      if (error is ApiException) {
        print('🔴 Type: ApiException');
        print('🔴 Message: ${error.message}');
        print('🔴 Status: ${error.statusCode}');
        print('═══════════════════════════════════════════════════════\n');
        rethrow;
      }
      print('🔴 Type: ${error.runtimeType}');
      print('🔴 Error: ${error}');
      print('═══════════════════════════════════════════════════════\n');
      throw ApiException('POST request failed: ${error}', 0);
    }
  }
}
