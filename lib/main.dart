import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:hallo/globals/auth_provider.dart';
import 'package:hallo/globals/language_provider.dart';
import 'package:hallo/globals/theme_mode_provider.dart';
import 'package:hallo/globals/notification_provider.dart';
import 'package:hallo/globals/offline_mode_provider.dart';
import 'package:hallo/globals/voice_command_provider.dart';
import 'package:hallo/globals/app_state.dart';
import 'package:hallo/globals/themes.dart';
import 'package:hallo/pages/splash_screen.dart';

late final SharedPreferences sharedPrefs;

main() async {
  WidgetsFlutterBinding.ensureInitialized();
  sharedPrefs = await SharedPreferences.getInstance();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
    const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<AuthProvider>(
      create: (context) => AuthProvider(),
      child: ChangeNotifierProvider<LanguageProvider>(
        create: (context) => LanguageProvider(),
        child: ChangeNotifierProvider<ThemeModeProvider>(
          create: (context) => ThemeModeProvider(),
          child: ChangeNotifierProvider<NotificationProvider>(
            create: (context) => NotificationProvider(),
            child: ChangeNotifierProvider<OfflineModeProvider>(
              create: (context) => OfflineModeProvider(),
              child: ChangeNotifierProvider<VoiceCommandProvider>(
                create: (context) => VoiceCommandProvider(),
                child: ChangeNotifierProvider<AppState>(
                  create: (context) => AppState(),
                  child: Consumer<AppState>(
                    builder: (context, appState, child) => MaterialApp(
                      title: 'AGRO BOOST',
                      debugShowCheckedModeBanner: false,
                      theme: agroBoostLightTheme,
                      darkTheme: agroBoostDarkTheme,
                      themeMode: appState.isDarkMode
                          ? ThemeMode.dark
                          : ThemeMode.light,
                      home: const SplashScreen(),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
