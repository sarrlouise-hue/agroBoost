import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppStyles {
  static const double spacing4 = 4;
  static const double spacing8 = 8;
  static const double spacing12 = 12;
  static const double spacing16 = 16;
  static const double spacing20 = 20;
  static const double spacing24 = 24;
  static const double spacing32 = 32;
  static const double spacing40 = 40;
  static const double spacing6 = 6.0;

  static const double radiusMedium = 12;

  static const TextStyle headingMedium = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: AppColors.darkText,
  );

  static const TextStyle headingSmall = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.bold,
    color: AppColors.darkText,
  );

  static const TextStyle bodyLarge = TextStyle(
    fontSize: 16,
    color: AppColors.darkText,
  );

  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14,
    color: AppColors.darkText,
  );

  static const TextStyle labelSmall = TextStyle(
    fontSize: 12,
    color: AppColors.darkText,
  );

  static const TextStyle button = TextStyle(
    fontSize: 16,
    color: AppColors.white,
    fontWeight: FontWeight.bold,
  );

  static const TextStyle caption = TextStyle(
    fontSize: 12,
    color: AppColors.grey,
  );
}
