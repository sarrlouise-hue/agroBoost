import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_styles.dart';
import '../models/service.dart';

class Booking {
  final String id;
  final AgriculturalService service;
  final DateTime date;
  final double price;

  Booking({
    required this.id,
    required this.service,
    required this.date,
    required this.price,
  });
}

class BookingCard extends StatelessWidget {
  final Booking booking;

  const BookingCard({Key? key, required this.booking}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: AppStyles.paddingSmall),
      child: Padding(
        padding: const EdgeInsets.all(AppStyles.paddingMedium),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(booking.service.name, style: AppStyles.bodyLarge),
            const SizedBox(height: 4),
            Text('Date: ${booking.date.toLocal()}'.split(' ')[0]),
            const SizedBox(height: 4),
            Text('Prix: ${booking.price} XOF', style: const TextStyle(color: AppColors.primary)),
          ],
        ),
      ),
    );
  }
}
