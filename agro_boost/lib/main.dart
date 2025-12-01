import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'config/theme/app_theme.dart';
import 'config/routes/app_routes.dart';
import 'config/i18n/app_localizations.dart';



void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Charger les variables d'environnement
  await dotenv.load(fileName: ".env");

  runApp(
    const ProviderScope(
      child: AgroBoostApp(),
    ),
  );
}

class AgroBoostApp extends ConsumerWidget {
  const AgroBoostApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      title: 'AGRO BOOST',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.light,

      // Internationalization
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('fr'),
        Locale('wo'),
      ],

      // Routes
      initialRoute: AppRoutes.splash,
      onGenerateRoute: AppRoutes.onGenerateRoute,

      home: const SplashScreen(),
    );
  }
}

// Simple Splash Screen
class SplashScreen extends StatelessWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset('assets/logos/agro_boost_logo.png', width: 150),
            const SizedBox(height: 20),
            const Text(
              'AGRO BOOST',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Color(0xFF2E7D32),
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              'Réservation de services agricoles',
              style: TextStyle(fontSize: 14, color: Colors.grey),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}