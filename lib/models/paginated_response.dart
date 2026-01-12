import 'package:hallo/models/pagination_meta.dart';
class PaginatedResponse<T> {
  const PaginatedResponse({
    required this.success,
    required this.message,
    required this.data,
    required this.pagination,
  });

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic) fromJsonT,
  ) {
    final dataList = json['data'] as List;
    return PaginatedResponse<T>(
      success: json['success'] as bool,
      message: json['message'] as String,
      data: dataList.map((item) => fromJsonT(item)).toList(),
      pagination: PaginationMeta.fromJson(
        json['pagination'] as Map<String, dynamic>,
      ),
    );
  }

  final bool success;

  final String message;

  final List<T> data;

  final PaginationMeta pagination;

  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'message': message,
      'data': data,
      'pagination': pagination.toJson(),
    };
  }
}
