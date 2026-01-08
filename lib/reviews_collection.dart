import 'package:hallo/api_service.dart';
import 'package:hallo/models/api_response.dart';
import 'package:hallo/models/review_model.dart';
import 'package:hallo/models/paginated_response.dart';

class ReviewsCollection {
  ReviewsCollection._();

  final _api = ApiService.instance;

  static final ReviewsCollection instance = ReviewsCollection._();

  Future<ApiResponse<ReviewModel>> createReview({
    required String bookingId,
    required int rating,
    String? comment,
  }) async {
    final response = await _api.post(
      '/reviews',
      body: {
        'bookingId': bookingId,
        'rating': rating,
        if (comment != null) 'comment': comment,
      },
    );
    return ApiResponse.fromJson(
      response,
      (json) => ReviewModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<PaginatedResponse<ReviewModel>> getServiceReviews({
    required String serviceId,
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _api.get(
      '/reviews/service/$serviceId',
      queryParams: {'page': page.toString(), 'limit': limit.toString()},
      requiresAuth: false,
    );
    return PaginatedResponse.fromJson(
      response,
      (json) => ReviewModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<PaginatedResponse<ReviewModel>> getProviderReviews({
    required String providerId,
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _api.get(
      '/reviews/provider/$providerId',
      queryParams: {'page': page.toString(), 'limit': limit.toString()},
      requiresAuth: false,
    );
    return PaginatedResponse.fromJson(
      response,
      (json) => ReviewModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<ReviewModel>> updateReview({
    required String id,
    int? rating,
    String? comment,
  }) async {
    final response = await _api.put(
      '/reviews/$id',
      body: {
        if (rating != null) 'rating': rating,
        if (comment != null) 'comment': comment,
      },
    );
    return ApiResponse.fromJson(
      response,
      (json) => ReviewModel.fromJson(json as Map<String, dynamic>),
    );
  }

  Future<ApiResponse<dynamic>> deleteReview(String id) async {
    final response = await _api.delete('/reviews/$id');
    return ApiResponse.fromJson(response, null);
  }
}
