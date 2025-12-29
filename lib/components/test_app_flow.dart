import 'package:flutter/material.dart';
import 'package:allotracteur/globals/themes.dart';
import 'package:allotracteur/pages/splash_screen.dart';

class TestAppFlow extends StatelessWidget {
  const TestAppFlow({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Test AGRO BOOST Flow',
      debugShowCheckedModeBanner: false,
      theme: agroBoostLightTheme,
      home: const SplashScreen(),
    );
  }
}
