// lib/screens/booking_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:table_calendar/table_calendar.dart';
import '../constants/app_colors.dart';
import '../constants/app_styles.dart';
import '../models/service.dart';
import '../view_models/booking_view_model.dart';
import '../widgets/custom_button.dart';

class BookingScreen extends ConsumerStatefulWidget {
  final AgriculturalService service;

  const BookingScreen({Key? key, required this.service}) : super(key: key);

  @override
  ConsumerState<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends ConsumerState<BookingScreen> {
  late DateTime _selectedStartDate;
  late DateTime _selectedEndDate;
  late TextEditingController _notesController;
  String _selectedDuration = '1 jour';

  @override
  void initState() {
    super.initState();
    _selectedStartDate = DateTime.now();
    _selectedEndDate = DateTime.now().add(const Duration(days: 1));
    _notesController = TextEditingController();
  }

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  double _calculatePrice() {
    final hours = _selectedEndDate.difference(_selectedStartDate).inHours;
    return widget.service.pricePerHour * hours;
  }

  void _handleBooking() async {
    final bookingVM = ref.read(bookingViewModelProvider.notifier);

    final success = await bookingVM.createBooking(
      serviceId: widget.service.id,
      startDate: _selectedStartDate,
      endDate: _selectedEndDate,
      notes: _notesController.text,
    );

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Réservation créée avec succès!'),
          backgroundColor: AppColors.primary, // remplacé success par primary si success n'existe pas
        ),
      );
      Navigator.pushNamed(context, '/payment', arguments: {
        'bookingId': bookingVM.state.bookings.last.id,
        'amount': _calculatePrice(),
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final bookingState = ref.watch(bookingViewModelProvider);
    final totalPrice = _calculatePrice();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Nouvelle Réservation'),
        backgroundColor: AppColors.primary,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppStyles.paddingMedium),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Service Summary
            Card(
              child: Padding(
                padding: const EdgeInsets.all(AppStyles.paddingMedium),
                child: Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(AppStyles.radiusMedium),
                      child: Container(
                        width: 80,
                        height: 80,
                        color: AppColors.lightGrey,
                        child: widget.service.image != null
                            ? Image.network(
                          widget.service.image!,
                          fit: BoxFit.cover,
                        )
                            : const Icon(Icons.agriculture),
                      ),
                    ),
                    const SizedBox(width: AppStyles.paddingMedium),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.service.name,
                            style: AppStyles.bodyLarge,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${widget.service.pricePerHour} XOF/heure',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: AppColors.primary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: AppStyles.paddingLarge),

            // Date Selection
            Text(
              'Sélectionnez les dates',
              style: AppStyles.headingMedium,
            ),
            const SizedBox(height: AppStyles.paddingMedium),

            // Calendar
            Card(
              child: TableCalendar(
                firstDay: DateTime.now(),
                lastDay: DateTime.now().add(const Duration(days: 365)),
                focusedDay: _selectedStartDate,
                selectedDayPredicate: (day) {
                  return day == _selectedStartDate ||
                      day == _selectedEndDate ||
                      (day.isAfter(_selectedStartDate) &&
                          day.isBefore(_selectedEndDate));
                },
                onDaySelected: (selectedDay, focusedDay) {
                  setState(() {
                    if (selectedDay.isBefore(_selectedStartDate)) {
                      _selectedStartDate = selectedDay;
                    } else if (selectedDay == _selectedStartDate) {
                      _selectedEndDate = selectedDay.add(const Duration(days: 1));
                    } else {
                      _selectedEndDate = selectedDay;
                    }
                  });
                },
                calendarStyle: CalendarStyle(
                  todayDecoration: BoxDecoration(
                    color: AppColors.primaryLight,
                    shape: BoxShape.circle,
                  ),
                  selectedDecoration: BoxDecoration(
                    color: AppColors.primary,
                    shape: BoxShape.circle,
                  ),
                  rangeHighlightColor: AppColors.primaryLight.withOpacity(0.3),
                ),
              ),
            ),
            const SizedBox(height: AppStyles.paddingLarge),

            // Duration Display
            Container(
              padding: const EdgeInsets.all(AppStyles.paddingMedium),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppStyles.radiusLarge),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Durée: ${_selectedEndDate.difference(_selectedStartDate).inDays} jour(s)',
                    style: AppStyles.bodyLarge,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${_selectedStartDate.day}/${_selectedStartDate.month}/${_selectedStartDate.year} - ${_selectedEndDate.day}/${_selectedEndDate.month}/${_selectedEndDate.year}',
                    style: AppStyles.bodyMedium,
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppStyles.paddingLarge),

            // Notes
            Text(
              'Notes additionnelles',
              style: AppStyles.bodyLarge,
            ),
            const SizedBox(height: AppStyles.paddingSmall),
            TextField(
              controller: _notesController,
              maxLines: 4,
              decoration: InputDecoration(
                hintText: 'Décrivez vos besoins spécifiques...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppStyles.radiusLarge),
                ),
              ),
            ),
            const SizedBox(height: AppStyles.paddingLarge),

            // Price Summary
            Container(
              padding: const EdgeInsets.all(AppStyles.paddingMedium),
              decoration: BoxDecoration(
                color: AppColors.lightGrey,
                borderRadius: BorderRadius.circular(AppStyles.radiusLarge),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Prix/heure:'),
                      Text('${widget.service.pricePerHour} XOF'),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Heures:'),
                      Text(
                        '${_selectedEndDate.difference(_selectedStartDate).inHours}h',
                      ),
                    ],
                  ),
                  const Divider(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Total:',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text(
                        '$totalPrice XOF',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: AppStyles.fontSize16,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppStyles.paddingLarge),

            // Booking Button
            CustomButton(
              label: 'Procéder au paiement',
              isLoading: bookingState.isLoading,
              onPressed: _handleBooking,
              backgroundColor: AppColors.primary,
            ),
          ],
        ),
      ),
    );
  }
}
