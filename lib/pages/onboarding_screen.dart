// ignore_for_file: unused_element

import 'package:flutter/material.dart';
import 'package:allotracteur/onboarding_page.dart';
import 'package:allotracteur/pages/language_selection_for_signup_first.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() {
    return _OnboardingScreenState();
  }
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();

  int _currentPage = 0;

  final List<OnboardingPage> _pages = [
    OnboardingPage(
      title: 'Trouvez des Tracteurs',
      titleWolof: 'Gis Traktëër',
      description:
          'Localisez rapidement les tracteurs et équipements agricoles disponibles près de chez vous',
      descriptionWolof:
          'Gis gu yagg traktëër yi ak materyaal yu agriculture yuy jëkk ci sa yaay',
      icon: Icons.location_on,
      gradient: [const Color(0xffe56d4b), const Color(0xfff19066)],
    ),
    OnboardingPage(
      title: 'Filtrez Intelligemment',
      titleWolof: 'Filtre bu Xam-xam',
      description:
          'Filtrez par disponibilité, qualité et distance pour trouver rapidement le tracteur idéal',
      descriptionWolof:
          'Filtre ci disponibilité, qualité ak distance ngir gis traktëër bu baax',
      icon: Icons.tune,
      gradient: [const Color(0xfff19066), const Color(0xffffda79)],
    ),
    OnboardingPage(
      title: 'Réservez en un Clic',
      titleWolof: 'Res ci benn clic',
      description:
          'Planifiez vos travaux agricoles et réservez vos services en quelques secondes',
      descriptionWolof: 'Planifie sa liggéey bu agriculture ci ay secondes',
      icon: Icons.calendar_today,
      gradient: [const Color(0xffffda79), const Color(0xff2d5016)],
    ),
    OnboardingPage(
      title: 'Payez en Toute Sécurité',
      titleWolof: 'Fey ak Sécurité',
      description:
          'Utilisez Wave, Orange Money ou Free Money pour des paiements rapides et sécurisés',
      descriptionWolof:
          'Jëfandikoo Wave, Orange Money walla Free Money ngir fey gu yàgg te sécurisé',
      icon: Icons.payment,
      gradient: [const Color(0xff2d5016), const Color(0xffcd6133)],
    ),
  ];

  Widget _buildFilterFeaturesList() {
    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(0xffffda79).withValues(alpha: 0.2),
            const Color(0xfff19066).withValues(alpha: 0.1),
          ],
        ),
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(
          color: const Color(0xffe56d4b).withValues(alpha: 0.3),
        ),
      ),
      child: Column(
        children: [
          _buildFeatureRow(
            Icons.access_time,
            'Disponibilité 24h/48h',
            const Color(0xffe56d4b),
          ),
          const SizedBox(height: 12.0),
          _buildFeatureRow(
            Icons.star,
            'Note de Fiabilité',
            const Color(0xffffda79),
          ),
          const SizedBox(height: 12.0),
          _buildFeatureRow(
            Icons.location_on,
            'Distance Maximale',
            const Color(0xfff19066),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureRow(IconData icon, String label, Color color) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8.0),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.2),
            borderRadius: BorderRadius.circular(8.0),
          ),
          child: Icon(icon, size: 20.0, color: color),
        ),
        const SizedBox(width: 12.0),
        Expanded(
          child: Text(
            label,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: Theme.of(context).colorScheme.onSurface,
                ),
          ),
        ),
        const Icon(Icons.check_circle, color: Color(0xff4caf50), size: 20.0),
      ],
    );
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Widget _buildPage(OnboardingPage page) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 200.0,
            height: 200.0,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: page.gradient,
              ),
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: page.gradient[0].withValues(alpha: 0.3),
                  blurRadius: 30.0,
                  offset: const Offset(0.0, 15.0),
                ),
              ],
            ),
            child: Icon(page.icon, size: 100.0, color: Colors.white),
          ),
          const SizedBox(height: 48.0),
          Text(
            page.title,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).colorScheme.onSurface,
                ),
          ),
          const SizedBox(height: 8.0),
          Text(
            page.titleWolof,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: Theme.of(context).colorScheme.primary,
                  fontWeight: FontWeight.w600,
                ),
          ),
          const SizedBox(height: 24.0),
          Text(
            page.description,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                  height: 1.5,
                ),
          ),
          const SizedBox(height: 12.0),
          Text(
            page.descriptionWolof,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(
                    context,
                  ).colorScheme.onSurfaceVariant.withValues(alpha: 0.7),
                  fontStyle: FontStyle.italic,
                  height: 1.5,
                ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  AnimatedOpacity(
                    opacity: _currentPage > 0 ? 1.0 : 0.0,
                    duration: const Duration(milliseconds: 300),
                    child: IconButton(
                      onPressed: _currentPage > 0
                          ? () {
                              _pageController.previousPage(
                                duration: const Duration(milliseconds: 300),
                                curve: Curves.easeInOut,
                              );
                            }
                          : null,
                      icon: Icon(
                        Icons.arrow_back,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                      style: IconButton.styleFrom(
                        backgroundColor: Theme.of(context).colorScheme.surface,
                      ),
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              const LanguageSelectionForSignupFirst(),
                        ),
                      );
                    },
                    child: Text(
                      'Passer',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.primary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: (index) {
                  setState(() {
                    _currentPage = index;
                  });
                },
                itemCount: _pages.length,
                itemBuilder: (context, index) => _buildPage(_pages[index]),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 24.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  _pages.length,
                  (index) => AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    margin: const EdgeInsets.symmetric(horizontal: 4.0),
                    width: _currentPage == index ? 32.0 : 8.0,
                    height: 8.0,
                    decoration: BoxDecoration(
                      color: _currentPage == index
                          ? Theme.of(context).colorScheme.primary
                          : Theme.of(context).colorScheme.outline,
                      borderRadius: BorderRadius.circular(4.0),
                    ),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(24.0, 0.0, 24.0, 32.0),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    if (_currentPage < _pages.length - 1) {
                      _pageController.nextPage(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                      );
                    } else {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              const LanguageSelectionForSignupFirst(),
                        ),
                      );
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context).colorScheme.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 18.0),
                  ),
                  child: Text(
                    _currentPage < _pages.length - 1 ? 'Suivant' : 'Continuer',
                    style: const TextStyle(
                      fontSize: 16.0,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
