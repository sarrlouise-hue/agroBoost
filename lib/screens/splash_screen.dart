import 'package:flutter/material.dart';
import 'login_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with TickerProviderStateMixin {
  late AnimationController _scaleController;
  late AnimationController _fadeController;
  late AnimationController _rotateController;

  @override
  void initState() {
    super.initState();

    // Animation d'échelle du logo
    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    )..forward();

    // Animation de fondu
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..forward();

    // Animation de rotation légère
    _rotateController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..forward();

    // Attendre 3.5 secondes avant d'aller au login
    Future.delayed(const Duration(seconds: 3, milliseconds: 500), () {
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const LoginScreen()),
        );
      }
    });
  }

  @override
  void dispose() {
    _scaleController.dispose();
    _fadeController.dispose();
    _rotateController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Logo avec animations
            ScaleTransition(
              scale: Tween<double>(begin: 0.5, end: 1.0).animate(
                CurvedAnimation(parent: _scaleController, curve: Curves.easeOut),
              ),
              child: RotationTransition(
                turns: Tween<double>(begin: 0, end: 0.1).animate(
                  CurvedAnimation(parent: _rotateController, curve: Curves.easeInOut),
                ),
                child: FadeTransition(
                  opacity: Tween<double>(begin: 0, end: 1).animate(
                    CurvedAnimation(parent: _fadeController, curve: Curves.easeIn),
                  ),
                  child: Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        colors: [Color(0xFF27AE60), Color(0xFF1E8449)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF27AE60).withOpacity(0.4),
                          blurRadius: 30,
                          spreadRadius: 10,
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.agriculture,
                      color: Colors.white,
                      size: 60,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 30),

            // Nom de l'app avec animation
            FadeTransition(
              opacity: Tween<double>(begin: 0, end: 1).animate(
                CurvedAnimation(
                  parent: _fadeController,
                  curve: const Interval(0.3, 1.0, curve: Curves.easeIn),
                ),
              ),
              child: const Text(
                'AgroBoost',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1F2937),
                  letterSpacing: 1.5,
                ),
              ),
            ),
            const SizedBox(height: 8),

            // Sous-titre avec animation
            FadeTransition(
              opacity: Tween<double>(begin: 0, end: 1).animate(
                CurvedAnimation(
                  parent: _fadeController,
                  curve: const Interval(0.5, 1.0, curve: Curves.easeIn),
                ),
              ),
              child: Text(
                'Votre partenaire agricole',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey[600],
                  fontWeight: FontWeight.w500,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}