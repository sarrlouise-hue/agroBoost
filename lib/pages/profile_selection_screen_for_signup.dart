import 'package:flutter/material.dart';
import 'package:allotracteur/pages/welcome_screen.dart';

class ProfileSelectionScreenForSignup extends StatelessWidget {
  const ProfileSelectionScreenForSignup({
    required this.email,
    required this.name,
    required this.language,
    super.key,
  });

  final String email;

  final String name;

  final String language;

  @override
  Widget build(BuildContext context) {
    final bool isWolof = language == 'wo';
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Theme.of(
                context,
              ).colorScheme.primaryContainer.withValues(alpha: 0.2),
              Theme.of(context).colorScheme.surface,
            ],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 80.0,
                  height: 80.0,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Theme.of(context).colorScheme.primary,
                        const Color(0xfff19066),
                      ],
                    ),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.person,
                    size: 40.0,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 32.0),
                Text(
                  isWolof ? 'Tànnal sa profil' : 'Choisissez votre profil',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 8.0),
                Text(
                  isWolof ? 'Yaa nga?' : 'Qui êtes-vous ?',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        color: Theme.of(context).colorScheme.primary,
                        fontWeight: FontWeight.w600,
                      ),
                ),
                const SizedBox(height: 48.0),
                _buildProfileCard(
                  context,
                  title: isWolof ? 'Kilimaan' : 'Producteur',
                  titleWolof:
                      isWolof ? 'Gis traktëër' : 'Je recherche des tracteurs',
                  description: isWolof
                      ? 'Gis traktëër ngir sa liggéey'
                      : 'Je recherche des tracteurs',
                  icon: Icons.person,
                  gradient: [
                    Theme.of(context).colorScheme.primary,
                    const Color(0xfff19066),
                  ],
                  onTap: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (context) => WelcomeScreen(
                          name: name,
                          userType: 'producteur',
                          language: language,
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 16.0),
                _buildProfileCard(
                  context,
                  title: isWolof ? 'Njëkkalekat' : 'Prestataire',
                  titleWolof:
                      isWolof ? 'Yokk traktëër' : 'Je propose des tracteurs',
                  description:
                      isWolof ? 'Yokk sa traktëër' : 'Je propose des tracteurs',
                  icon: Icons.agriculture,
                  gradient: [const Color(0xffffda79), const Color(0xfff19066)],
                  onTap: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (context) => WelcomeScreen(
                          name: name,
                          userType: 'prestataire',
                          language: language,
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildProfileCard(
    BuildContext context, {
    required String title,
    required String titleWolof,
    required String description,
    required IconData icon,
    required List<Color> gradient,
    required void Function() onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20.0),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24.0),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: gradient,
          ),
          borderRadius: BorderRadius.circular(20.0),
          boxShadow: [
            BoxShadow(
              color: gradient[0].withValues(alpha: 0.3),
              blurRadius: 15.0,
              offset: const Offset(0.0, 8.0),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 60.0,
              height: 60.0,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.3),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 30.0, color: Colors.white),
            ),
            const SizedBox(width: 20.0),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 22.0,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4.0),
                  Text(
                    titleWolof,
                    style: TextStyle(
                      fontSize: 14.0,
                      color: Colors.white.withValues(alpha: 0.9),
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  Text(
                    description,
                    style: TextStyle(
                      fontSize: 13.0,
                      color: Colors.white.withValues(alpha: 0.8),
                    ),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.arrow_forward_ios,
              color: Colors.white,
              size: 20.0,
            ),
          ],
        ),
      ),
    );
  }
}
