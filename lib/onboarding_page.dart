import 'package:flutter/material.dart';
class OnboardingPage {
  OnboardingPage({
    required this.title,
    required this.titleWolof,
    required this.description,
    required this.descriptionWolof,
    required this.icon,
    required this.gradient,
  });

  final String title;

  final String titleWolof;

  final String description;

  final String descriptionWolof;

  final IconData icon;

  final List<Color> gradient;
}
