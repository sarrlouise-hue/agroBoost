import 'package:hallo/api_service.dart';
import 'package:hallo/models/paginated_response.dart';
import 'package:hallo/models/notification_model.dart';
import 'package:hallo/models/api_response.dart';

class NotificationsCollection {
  NotificationsCollection._();

  final _api = ApiService.instance;

  static final NotificationsCollection instance = NotificationsCollection._();

  Future<PaginatedResponse<NotificationModel>> getNotifications({
    int page = 1,
    int limit = 20,
    bool? isRead,
  }) async {
    final response = await _api.get(
      '/notifications',
      queryParams: {
        'page': page.toString(),
        'limit': limit.toString(),
        if (isRead != null) 'isRead': isRead.toString(),
      },
    );
    return PaginatedResponse.fromJson(
      response,
      (json) => NotificationModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<dynamic>> markAllAsRead() async {
    final response = await _api.patch('/notifications/read-all');
    return ApiResponse.fromJson(response, null);
  }

  Future<ApiResponse<NotificationModel>> markAsRead(String id) async {
    final response = await _api.patch('/notifications/$id/read');
    return ApiResponse.fromJson(
      response,
      (json) => NotificationModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<NotificationModel>> getNotificationById(String id) async {
    final response = await _api.get('/notifications/$id');
    return ApiResponse.fromJson(
      response,
      (json) => NotificationModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<dynamic>> deleteNotification(String id) async {
    final response = await _api.delete('/notifications/$id');
    return ApiResponse.fromJson(response, null);
  }

  Future<PaginatedResponse<NotificationModel>> getAllNotifications({
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _api.get(
      '/notifications/all',
      queryParams: {'page': page.toString(), 'limit': limit.toString()},
    );
    return PaginatedResponse.fromJson(
      response,
      (json) => NotificationModel.fromJson(json as Map<String, dynamic>),
    );
  }
}
