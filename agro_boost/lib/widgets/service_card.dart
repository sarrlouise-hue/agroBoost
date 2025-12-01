import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_styles.dart';
import '../models/service.dart';

class ServiceCard extends StatelessWidget {
  final AgriculturalService service;
  final VoidCallback onTap;

  const ServiceCard({Key? key, required this.service, required this.onTap})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        margin: const EdgeInsets.symmetric(vertical: AppStyles.paddingSmall),
        child: Padding(
          padding: const EdgeInsets.all(AppStyles.paddingMedium),
          child: Row(
            children: [
              Container(
                width: 80,
                height: 80,
                color: AppColors.lightGrey,
                child: service.image != null
                    ? Image.network(service.image!, fit: BoxFit.cover)
                    : const Icon(Icons.agriculture, size: 40),
              ),
              const SizedBox(width: AppStyles.paddingMedium),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(service.name, style: AppStyles.bodyLarge),
                    const SizedBox(height: 4),
                    Text('${service.pricePerHour} XOF/heure',
                        style: const TextStyle(color: AppColors.primary)),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.star, color: Colors.amber, size: 16),
                        const SizedBox(width: 4),
                        Text('${service.rating} (${service.reviewCount} avis)'),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
