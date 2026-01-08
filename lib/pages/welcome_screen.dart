import 'package:flutter/material.dart';
import 'package:hallo/pages/onboarding_screen.dart';
import 'package:hallo/pages/main_screen.dart';

class WelcomeScreen extends StatefulWidget {
    const WelcomeScreen({
    required this.name,
    required this.userType,
    required this.language,
    super.key,
  });

  final String name;

  final String userType;

  final String language;

  @override
  State<WelcomeScreen> createState() {
    return _WelcomeScreenState();
  }
}

class _WelcomeScreenState extends State<WelcomeScreen> {
  double _opacity = 0.0;

  String _getWelcomeMessage() {
    final isWolof = widget.language == 'wo';
    if (widget.userType == 'signup') {
      return isWolof ? 'Dalaal ak jàmm !' : 'Bienvenue sur AGRO BOOST !';
    }
    switch (widget.userType) {
      case 'producteur':
        return isWolof
            ? 'Bienvenue Kilimaan ${widget.name} !'
            : 'Bienvenue Producteur ${widget.name} !';
      case 'prestataire':
        return isWolof
            ? 'Bienvenue Njëkkalekat ${widget.name} !'
            : 'Bienvenue Prestataire ${widget.name} !';
      default:
        return isWolof
            ? 'Dalaal ak jàmm ${widget.name} !'
            : 'Bienvenue ${widget.name} !';
    }
  }

  String _getSubtitle() {
    final isWolof = widget.language == 'wo';
    if (widget.userType == 'signup') {
      return isWolof
          ? 'Mangi fi ngir yobbu agriculture'
          : 'Prêt à révolutionner l\'agriculture';
    }
    switch (widget.userType) {
      case 'producteur':
        return isWolof
            ? 'Gis traktëër yi ak materyaal yu agriculture'
            : 'Trouvez des tracteurs et équipements agricoles';
      case 'prestataire':
        return isWolof
            ? 'Gérer sa business ak AGRO BOOST'
            : 'Gérez votre activité avec AGRO BOOST';
      default:
        return isWolof
            ? 'Mangi fi ngir yobbu agriculture'
            : 'Prêt à révolutionner l\'agriculture';
    }
  }

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 100), () {
      if (mounted) {
        setState(() {
          _opacity = 1.0;
        });
      }
    });
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        if (widget.userType == 'signup') {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const OnboardingScreen()),
          );
        } else {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => MainScreen(
                language: widget.language,
                userType: widget.userType,
              ),
            ),
          );
        }
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
              Theme.of(context).colorScheme.primary.withValues(alpha: 0.1),
              Theme.of(context).colorScheme.surface,
            ],
          ),
        ),
        child: SafeArea(
          child: AnimatedOpacity(
            opacity: _opacity,
            duration: const Duration(milliseconds: 800),
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(32.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 120.0,
                      height: 120.0,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Theme.of(context).colorScheme.primary,
                            Theme.of(context).colorScheme.secondary,
                          ],
                        ),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Theme.of(
                              context,
                            ).colorScheme.primary.withValues(alpha: 0.3),
                            blurRadius: 30.0,
                            offset: const Offset(0.0, 15.0),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.agriculture,
                        size: 60.0,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 40.0),
                    Text(
                      _getWelcomeMessage(),
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.headlineMedium
                          ?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: Theme.of(context).colorScheme.onSurface,
                          ),
                    ),
                    const SizedBox(height: 16.0),
                    Text(
                      _getSubtitle(),
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 40.0),
                    SizedBox(
                      width: 40.0,
                      height: 40.0,
                      child: CircularProgressIndicator(
                        strokeWidth: 3.0,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          Theme.of(context).colorScheme.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
