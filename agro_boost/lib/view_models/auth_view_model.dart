// lib/view_models/auth_view_model.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../services/local_storage_service.dart';

final authViewModelProvider =
StateNotifierProvider<AuthViewModel, AuthState>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  final storageService = LocalStorageService();
  return AuthViewModel(apiService, storageService);
});

final apiServiceProvider = Provider((ref) => ApiService());

class AuthState {
  final bool isLoading;
  final bool isAuthenticated;
  final User? user;
  final String? error;
  final bool otpSent;

  AuthState({
    this.isLoading = false,
    this.isAuthenticated = false,
    this.user,
    this.error,
    this.otpSent = false,
  });

  AuthState copyWith({
    bool? isLoading,
    bool? isAuthenticated,
    User? user,
    String? error,
    bool? otpSent,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      user: user ?? this.user,
      error: error ?? this.error,
      otpSent: otpSent ?? this.otpSent,
    );
  }
}

class AuthViewModel extends StateNotifier<AuthState> {
  final ApiService _apiService;
  final LocalStorageService _storageService;

  AuthViewModel(this._apiService, this._storageService)
      : super(AuthState()) {
    _checkAuthStatus();
  }

  /// Vérifier le statut d'authentification
  Future<void> _checkAuthStatus() async {
    final token = _storageService.getString('auth_token');
    if (token != null) {
      _apiService.setToken(token);
      state = state.copyWith(isAuthenticated: true);
    }
  }

  /// Envoyer OTP
  Future<void> sendOtp(String phone) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _apiService.sendOtp(phone);
      state = state.copyWith(isLoading: false, otpSent: true);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  /// Vérifier OTP
  Future<bool> verifyOtp({required String phone, required String otp}) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _apiService.verifyOtp(phone: phone, otp: otp);
      final token = response['token'];
      await _storageService.setString('auth_token', token);
      _apiService.setToken(token);
      state = state.copyWith(isLoading: false, isAuthenticated: true);
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return false;
    }
  }

  /// Connexion
  Future<bool> login({
    required String email,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _apiService.login(email: email, password: password);
      final token = response['token'];
      final userData = response['user'];

      await _storageService.setString('auth_token', token);
      _apiService.setToken(token);

      final user = User.fromJson(userData);
      state = state.copyWith(
        isLoading: false,
        isAuthenticated: true,
        user: user,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return false;
    }
  }

  /// Inscription
  Future<bool> register({
    required String email,
    required String phone,
    required String password,
    required String firstName,
    required String lastName,
    required String userType,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _apiService.register(
        email: email,
        phone: phone,
        password: password,
        firstName: firstName,
        lastName: lastName,
        userType: userType,
      );
      state = state.copyWith(isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return false;
    }
  }

  /// Déconnexion
  Future<void> logout() async {
    await _storageService.clear();
    _apiService.clearToken();
    state = AuthState();
  }
}

// lib/view_models/service_view_model.dart
final serviceViewModelProvider =
StateNotifierProvider<ServiceViewModel, ServiceState>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return ServiceViewModel(apiService);
});

class ServiceState {
  final bool isLoading;
  final List<AgriculturalService> services;
  final String? error;
  final AgriculturalService? selectedService;

  ServiceState({
    this.isLoading = false,
    this.services = const [],
    this.error,
    this.selectedService,
  });

  ServiceState copyWith({
    bool? isLoading,
    List<AgriculturalService>? services,
    String? error,
    AgriculturalService? selectedService,
  }) {
    return ServiceState(
      isLoading: isLoading ?? this.isLoading,
      services: services ?? this.services,
      error: error ?? this.error,
      selectedService: selectedService ?? this.selectedService,
    );
  }
}

class ServiceViewModel extends StateNotifier<ServiceState> {
  final ApiService _apiService;

  ServiceViewModel(this._apiService) : super(ServiceState());

  /// Récupérer tous les services
  Future<void> getAllServices() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final services = await _apiService.getAllServices();
      state = state.copyWith(isLoading: false, services: services);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  /// Rechercher les services par localisation
  Future<void> searchByLocation({
    required double latitude,
    required double longitude,
    required double radius,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final services = await _apiService.searchServicesByLocation(
        latitude: latitude,
        longitude: longitude,
        radius: radius,
      );
      state = state.copyWith(isLoading: false, services: services);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  /// Sélectionner un service
  void selectService(AgriculturalService service) {
    state = state.copyWith(selectedService: service);
  }
}

// lib/view_models/booking_view_model.dart
final bookingViewModelProvider =
StateNotifierProvider<BookingViewModel, BookingState>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return BookingViewModel(apiService);
});

class BookingState {
  final bool isLoading;
  final List<Booking> bookings;
  final String? error;
  final bool bookingSuccess;

  BookingState({
    this.isLoading = false,
    this.bookings = const [],
    this.error,
    this.bookingSuccess = false,
  });

  BookingState copyWith({
    bool? isLoading,
    List<Booking>? bookings,
    String? error,
    bool? bookingSuccess,
  }) {
    return BookingState(
      isLoading: isLoading ?? this.isLoading,
      bookings: bookings ?? this.bookings,
      error: error ?? this.error,
      bookingSuccess: bookingSuccess ?? this.bookingSuccess,
    );
  }
}

class BookingViewModel extends StateNotifier<BookingState> {
  final ApiService _apiService;

  BookingViewModel(this._apiService) : super(BookingState());

  /// Créer une réservation
  Future<bool> createBooking({
    required String serviceId,
    required DateTime startDate,
    required DateTime endDate,
    required String notes,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final booking = await _apiService.createBooking(
        serviceId: serviceId,
        startDate: startDate,
        endDate: endDate,
        notes: notes,
      );
      state = state.copyWith(
        isLoading: false,
        bookingSuccess: true,
        bookings: [...state.bookings, booking],
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return false;
    }
  }

  /// Récupérer les réservations
  Future<void> getUserBookings() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final bookings = await _apiService.getUserBookings();
      state = state.copyWith(isLoading: false, bookings: bookings);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  /// Annuler une réservation
  Future<bool> cancelBooking(String bookingId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _apiService.cancelBooking(bookingId);
      final updatedBookings = state.bookings
          .map((b) =>
      b.id == bookingId ? b : b)
          .toList();
      state = state.copyWith(isLoading: false, bookings: updatedBookings);
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return false;
    }
  }
}