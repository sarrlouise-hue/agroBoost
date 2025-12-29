import 'package:flutter/material.dart';
import 'package:allotracteur/pages/login_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() {
    return _SplashScreenState();
  }
}

class _SplashScreenState extends State<SplashScreen> {
  double _logoOpacity = 0.0;

  double _logoScale = 0.8;

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) {
        setState(() {
          _logoOpacity = 1.0;
          _logoScale = 1.0;
        });
      }
    });
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const LoginScreen()),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Theme.of(context).colorScheme.primary,
              Theme.of(context).colorScheme.primary.withValues(alpha: 0.8),
              const Color(0xfff19066),
            ],
          ),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              AnimatedOpacity(
                opacity: _logoOpacity,
                duration: const Duration(milliseconds: 800),
                curve: Curves.easeOut,
                child: AnimatedScale(
                  scale: _logoScale,
                  duration: const Duration(milliseconds: 800),
                  curve: Curves.easeOut,
                  child: Container(
                    width: 140.0,
                    height: 140.0,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.2),
                          blurRadius: 40.0,
                          offset: const Offset(0.0, 20.0),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.agriculture,
                      size: 70.0,
                      color: Color(0xffe56d4b),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 32.0),
              AnimatedOpacity(
                opacity: _logoOpacity,
                duration: const Duration(milliseconds: 1000),
                curve: Curves.easeOut,
                child: Column(
                  children: [
                    const Text(
                      'AGRO BOOST',
                      style: TextStyle(
                        fontSize: 32.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        letterSpacing: 2.0,
                      ),
                    ),
                    const SizedBox(height: 8.0),
                    Text(
                      'Révolutionnez l\'agriculture',
                      style: TextStyle(
                        fontSize: 14.0,
                        color: Colors.white.withValues(alpha: 0.9),
                        letterSpacing: 0.5,
                      ),
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
