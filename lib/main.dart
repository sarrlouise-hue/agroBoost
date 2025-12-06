import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'view_models/auth_view_model.dart';
import 'screens/phone_input_screen.dart';
import 'core/constants/app_colors.dart';
import 'package:agro_boost/screens/login_screen.dart';
import 'screens/splash_screen.dart';


void main() {
  runApp(const AgroBoostApp());
}

class AgroBoostApp extends StatelessWidget {
  const AgroBoostApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthViewModel()),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'AGRO BOOST',
        theme: ThemeData(
          primaryColor: AppColors.primaryGreen,
          scaffoldBackgroundColor: Colors.white,
          appBarTheme: const AppBarTheme(
            backgroundColor: AppColors.primaryGreen,
          ),
        ),
        home: const SplashScreen(),

      ),
    );
  }
}
