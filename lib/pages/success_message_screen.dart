import 'package:flutter/material.dart';
import 'package:allotracteur/pages/profile_selection_screen_for_signup.dart';

class SuccessMessageScreen extends StatefulWidget {
  const SuccessMessageScreen({
    required this.email,
    required this.name,
    required this.language,
    super.key,
  });

  final String email;

  final String name;

  final String language;

  @override
  State<SuccessMessageScreen> createState() {
    return _SuccessMessageScreenState();
  }
}

class _SuccessMessageScreenState extends State<SuccessMessageScreen> {
  double _opacity = 0.0;

  double _scale = 0.0;

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 100), () {
      if (mounted) {
        setState(() {
          _opacity = 1.0;
          _scale = 1.0;
        });
      }
    });
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => ProfileSelectionScreenForSignup(
              email: widget.email,
              name: widget.name,
              language: widget.language,
            ),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final bool isWolof = widget.language == 'wo';
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Theme.of(context).colorScheme.primary,
              const Color(0xfff19066),
              const Color(0xffffda79),
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(32.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  AnimatedScale(
                    scale: _scale,
                    duration: const Duration(milliseconds: 600),
                    curve: Curves.elasticOut,
                    child: Container(
                      width: 120.0,
                      height: 120.0,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.1),
                            blurRadius: 20.0,
                            offset: const Offset(0.0, 10.0),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.check_circle,
                        color: Color(0xff2d5016),
                        size: 80.0,
                      ),
                    ),
                  ),
                  const SizedBox(height: 32.0),
                  AnimatedOpacity(
                    opacity: _opacity,
                    duration: const Duration(milliseconds: 800),
                    child: Column(
                      children: [
                        Text(
                          isWolof
                              ? 'Bindewal bu baax!'
                              : 'Inscription réussie !',
                          textAlign: TextAlign.center,
                          style: Theme.of(context)
                              .textTheme
                              .headlineMedium
                              ?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                        ),
                        const SizedBox(height: 16.0),
                        Text(
                          isWolof
                              ? 'Dalaal ak jàmm ${widget.name} !'
                              : 'Bienvenue ${widget.name} !',
                          textAlign: TextAlign.center,
                          style:
                              Theme.of(context).textTheme.titleLarge?.copyWith(
                                    color: Colors.white.withValues(alpha: 0.9),
                                  ),
                        ),
                        const SizedBox(height: 8.0),
                        Text(
                          isWolof
                              ? 'Sa compte defar na'
                              : 'Votre compte a été créé avec succès',
                          textAlign: TextAlign.center,
                          style:
                              Theme.of(context).textTheme.bodyLarge?.copyWith(
                                    color: Colors.white.withValues(alpha: 0.8),
                                  ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
