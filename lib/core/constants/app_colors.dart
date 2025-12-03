import 'package:flutter/material.dart';

/// Palette de couleurs de l'application AGRO BOOST
abstract class AppColors {
  // ✅ Couleurs primaires
  static const Color primary = Color(0xFF2E7D32); // Vert agricole
  static const Color primaryLight = Color(0xFF66BB6A);
  static const Color primaryDark = Color(0xFF1B5E20);

  // ✅ Couleurs secondaires
  static const Color secondary = Color(0xFFFFA726); // Orange/Or
  static const Color secondaryLight = Color(0xFFFFB74D);
  static const Color secondaryDark = Color(0xFFF57C00);

  // ✅ Couleurs de statut
  static const Color success = Color(0xFF4CAF50);
  static const Color warning = Color(0xFFFFC107);
  static const Color error = Color(0xFFF44336);
  static const Color info = Color(0xFF2196F3);

  // ✅ Couleurs neutres
  static const Color black = Color(0xFF1F1F1F);
  static const Color white = Color(0xFFFFFFFF);
  static const Color greyDark = Color(0xFF424242);
  static const Color grey = Color(0xFF757575);
  static const Color greyLight = Color(0xFFBDBDBD);
  static const Color lightGrey = Color(0xFFF5F5F5);
  static const Color veryLightGrey = Color(0xFFFAFAFA);

  // ✅ Couleurs spécifiques pour compatibilité
  static const Color greyBackground = Color(0xFFF2F2F2);
  static const Color primaryGreen = Color(0xFF2E7D32);
  static const Color secondaryGreen = Color(0xFF81C784);

  // ✅ Couleurs de texte
  static const Color darkText = Color(0xFF333333);

  // ✅ Couleurs de bordure
  static const Color border = Color(0xFFE0E0E0);
  static const Color divider = Color(0xFFEEEEEE);
  static const Color shadow = Color(0x1F000000);

  // ✅ Dégradés
  static LinearGradient primaryGradient = LinearGradient(
    colors: [primary, primaryDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static LinearGradient secondaryGradient = LinearGradient(
    colors: [secondary, secondaryDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}