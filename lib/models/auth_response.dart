import 'package:hallo/models/user_model.dart';
class AuthResponse {
  const AuthResponse({
    required this.success,
    required this.message,
    required this.user,
    required this.token,
    required this.refreshToken,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    try {
      final bool success = json['success'] ?? false;
      final String message = json['message'] ?? '';
      final data = json['data'] as Map<String, dynamic>?;
      if (data == null) {
        return AuthResponse(
          success: success,
          message: message,
          user: UserModel.fromJson({}),
          token: '',
          refreshToken: '',
        );
      }
      return AuthResponse(
        success: success,
        message: message,
        user: UserModel.fromJson(data['user'] as Map<String, dynamic>? ?? {}),
        token: data['token'] as String? ?? '',
        refreshToken: data['refreshToken'] as String? ?? '',
      );
    } catch (e) {
      return AuthResponse(
        success: false,
        message: 'Failed to parse response: $e',
        user: UserModel.fromJson({}),
        token: '',
        refreshToken: '',
      );
    }
  }

  final bool success;

  final String message;

  final UserModel user;

  final String token;

  final String refreshToken;

  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'message': message,
      'data': {
        'user': user.toJson(),
        'token': token,
        'refreshToken': refreshToken,
      },
    };
  }
}
