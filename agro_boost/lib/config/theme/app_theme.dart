// lib/config/theme/app_theme.dart
import 'package:flutter/material.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_styles.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: AppColors.primary,
      scaffoldBackgroundColor: AppColors.background,

      // AppBar Theme
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.white,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontSize: AppStyles.fontSize18,
          fontWeight: FontWeight.bold,
          color: AppColors.white,
        ),
      ),

      // Text Theme
      textTheme: const TextTheme(
        displayLarge: TextStyle(
          fontSize: AppStyles.fontSize28,
          fontWeight: FontWeight.bold,
          color: AppColors.black,
        ),
        headlineSmall: TextStyle(
          fontSize: AppStyles.fontSize20,
          fontWeight: FontWeight.bold,
          color: AppColors.black,
        ),
        bodyLarge: TextStyle(
          fontSize: AppStyles.fontSize16,
          color: AppColors.black,
        ),
        bodyMedium: TextStyle(
          fontSize: AppStyles.fontSize14,
          color: AppColors.grey,
        ),
      ),

      // Input Decoration Theme
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.white,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppStyles.paddingMedium,
          vertical: AppStyles.paddingMedium,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppStyles.radiusLarge),
          borderSide: const BorderSide(color: AppColors.lightGrey),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppStyles.radiusLarge),
          borderSide: const BorderSide(color: AppColors.lightGrey),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppStyles.radiusLarge),
          borderSide: const BorderSide(color: AppColors.primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppStyles.radiusLarge),
          borderSide: const BorderSide(color: AppColors.error),
        ),
        labelStyle: const TextStyle(color: AppColors.grey),
        hintStyle: const TextStyle(color: AppColors.grey),
      ),

      // Button Theme
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: AppColors.white,
          padding: const EdgeInsets.symmetric(
            horizontal: AppStyles.paddingLarge,
            vertical: AppStyles.paddingMedium,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppStyles.radiusLarge),
          ),
        ),
      ),

      // Bottom Navigation Bar Theme
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.white,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.grey,
        elevation: 8,
      ),

      // Card Theme
      cardTheme: CardTheme(
        color: AppColors.white,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppStyles.radiusLarge),
        ),
      ),

      // Color Scheme
      colorScheme: const ColorScheme.light(
        primary: AppColors.primary,
        secondary: AppColors.secondary,
        surface: AppColors.surface,
        background: AppColors.background,
        error: AppColors.error,
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: AppColors.primaryLight,
      scaffoldBackgroundColor: AppColors.darkGrey,
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.primaryDark,
        foregroundColor: AppColors.white,
        elevation: 0,
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.darkGrey,
        selectedItemColor: AppColors.primaryLight,
        unselectedItemColor: AppColors.grey,
      ),
    );
  }
}

// lib/config/routes/app_routes.dart
import 'package:flutter/material.dart';
import '../../screens/login_screen.dart';
import '../../screens/home_screen.dart';

class AppRoutes {
  static const String splash = '/';
  static const String login = '/login';
  static const String register = '/register';
  static const String home = '/home';
  static const String serviceDetail = '/service_detail';
  static const String booking = '/booking';
  static const String profile = '/profile';

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());

      case login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());

      case home:
        return MaterialPageRoute(builder: (_) => const HomeScreen());

      case serviceDetail:
        return MaterialPageRoute(
          builder: (_) => ServiceDetailScreen(
            service: settings.arguments as AgriculturalService,
          ),
        );

      case profile:
        return MaterialPageRoute(
          builder: (_) => const Scaffold(
            body: Center(
              child: Text('Profile Screen'),
            ),
          ),
        );

      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
}

// lib/config/i18n/app_localizations.dart
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static final LocalizationsDelegate<AppLocalizations> delegate =
  _AppLocalizationsDelegate();

  // French
  static const Map<String, String> _fr = {
    'app_name': 'AGRO BOOST',
    'welcome': 'Bienvenue sur AGRO BOOST',
    'login': 'Se connecter',
    'register': 'S\'inscrire',
    'email': 'Email',
    'password': 'Mot de passe',
    'confirm_password': 'Confirmer le mot de passe',
    'phone': 'Téléphone',
    'first_name': 'Prénom',
    'last_name': 'Nom',
    'home': 'Accueil',
    'search': 'Recherche',
    'bookings': 'Réservations',
    'settings': 'Paramètres',
    'available_services': 'Services Disponibles',
    'price_per_hour': 'Prix par heure',
    'reserve': 'Réserver',
    'cancel': 'Annuler',
    'confirm': 'Confirmer',
    'loading': 'Chargement...',
    'error': 'Une erreur est survenue',
    'success': 'Succès',
    'no_services': 'Aucun service disponible',
    'no_bookings': 'Aucune réservation',
  };

  // Wolof
  static const Map<String, String> _wo = {
    'app_name': 'AGRO BOOST',
    'welcome': 'Wolof Welcome',
    'login': 'Seetal',
    'register': 'Registre',
    'email': 'Email',
    'password': 'Pas guir',
    'phone': 'Telefon',
    'home': 'Agal',
    'search': 'Ceet',
    'bookings': 'Reesaay',
    'settings': 'Tey',
  };

  String get appName => _getTranslation('app_name');
  String get welcome => _getTranslation('welcome');
  String get login => _getTranslation('login');
  String get register => _getTranslation('register');

  String _getTranslation(String key) {
    final translations = locale.languageCode == 'wo' ? _wo : _fr;
    return translations[key] ?? key;
  }
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  @override
  bool isSupported(Locale locale) => ['en', 'fr', 'wo'].contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) async {
    return AppLocalizations(locale);
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}