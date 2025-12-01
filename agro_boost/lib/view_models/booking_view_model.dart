import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/service.dart';
import '../models/booking.dart'; // si tu as une classe Booking

class BookingState {
  final bool isLoading;
  final List<Booking> bookings;

  BookingState({this.isLoading = false, this.bookings = const []});

  BookingState copyWith({bool? isLoading, List<Booking>? bookings}) {
    return BookingState(
      isLoading: isLoading ?? this.isLoading,
      bookings: bookings ?? this.bookings,
    );
  }
}

class BookingViewModel extends StateNotifier<BookingState> {
  BookingViewModel() : super(BookingState());

  Future<bool> createBooking({
    required String serviceId,
    required DateTime startDate,
    required DateTime endDate,
    required String notes,
  }) async {
    try {
      state = state.copyWith(isLoading: true);

      // Ici, tu peux appeler ton API ou gérer la réservation
      await Future.delayed(const Duration(seconds: 1));

      // Simuler ajout réservation
      final booking = Booking(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        serviceId: serviceId,
        startDate: startDate,
        endDate: endDate,
        notes: notes,
      );

      state = state.copyWith(
        isLoading: false,
        bookings: [...state.bookings, booking],
      );

      return true;
    } catch (_) {
      state = state.copyWith(isLoading: false);
      return false;
    }
  }
}

// Déclarer le provider
final bookingViewModelProvider =
StateNotifierProvider<BookingViewModel, BookingState>(
        (ref) => BookingViewModel());
