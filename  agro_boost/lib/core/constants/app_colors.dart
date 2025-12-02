import 'package:flutter/material.dart';

class AppColors {
  static const Color primaryGreen = Color(0xFF4CAF50);
  static const Color secondaryGreen = Color(0xFF81C784);
  static const Color greyBackground = Color(0xFFF2F2F2);
  static const Color darkText = Color(0xFF212121);
  static const Color white = Colors.white;
  static const Color black = Colors.black;
  static const Color grey = Color(0xFF9E9E9E);
  static const Color lightGrey = Color(0xFFBDBDBD);
  static const Color veryLightGrey = Color(0xFFF5F5F5);
  static const Color error = Colors.red;
  static const Color warning = Colors.orange;
  static const Color success = Colors.green;
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFF4CAF50), Color(0xFF81C784)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  static const Color border = Color(0xFFE0E0E0);
}
