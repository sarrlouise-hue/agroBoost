// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

void main() {
  runApp(const AgroBoostApp());
}

class AgroBoostApp extends StatelessWidget {
  const AgroBoostApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AGRO BOOST',
      // ajout des configurations de localisation
      localizationsDelegates: [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('fr', ''), // français (sénégal)
        Locale('wo', ''), // wolof
        Locale('en', ''), // anglais (pour fallback)
      ],
      theme: ThemeData(primarySwatch: Colors.green),
      home: const Placeholder(), // ecran login
    );
  }
}
