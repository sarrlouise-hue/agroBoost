import 'package:flutter/material.dart';
class VoiceCommandsDetailScreen extends StatelessWidget {
    const VoiceCommandsDetailScreen({required this.language, super.key});

  final String language;

  Widget _buildCommandCard(
    BuildContext context,
    IconData icon,
    String title,
    String command,
    List<Color> gradientColors,
  ) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            gradientColors[0].withValues(alpha: 0.1),
            gradientColors[1].withValues(alpha: 0.05),
          ],
        ),
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(
          color: gradientColors[0].withValues(alpha: 0.3),
          width: 1.5,
        ),
      ),
      padding: const EdgeInsets.all(16.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12.0),
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: gradientColors),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: Colors.white, size: 24.0),
          ),
          const SizedBox(width: 16.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                ),
                const SizedBox(height: 4.0),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10.0,
                    vertical: 4.0,
                  ),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(colors: gradientColors),
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                  child: Text(
                    '"$command"',
                    style: const TextStyle(
                      fontStyle: FontStyle.italic,
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 13.0,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isWolof = language == 'wo';
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0.0,
        leading: IconButton(
          onPressed: () => Navigator.pop(context),
          icon: Icon(
            Icons.arrow_back_ios_new_rounded,
            color: Theme.of(context).colorScheme.primary,
            size: 20.0,
          ),
          style: IconButton.styleFrom(
            backgroundColor: Theme.of(
              context,
            ).colorScheme.primaryContainer.withValues(alpha: 0.3),
          ),
        ),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10.0),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xffe56d4b), Color(0xfff19066)],
                ),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.mic, color: Colors.white, size: 20.0),
            ),
            const SizedBox(width: 12.0),
            Text(
              isWolof ? 'Commandes Vocales' : 'Commandes Vocales',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18.0,
              ),
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(20.0),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    const Color(0xffe56d4b).withValues(alpha: 0.12),
                    const Color(0xfff19066).withValues(alpha: 0.08),
                  ],
                ),
                borderRadius: BorderRadius.circular(20.0),
                border: Border.all(
                  color: const Color(0xffe56d4b).withValues(alpha: 0.3),
                  width: 1.5,
                ),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12.0),
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Color(0xffe56d4b), Color(0xfff19066)],
                      ),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.mic,
                      color: Colors.white,
                      size: 28.0,
                    ),
                  ),
                  const SizedBox(width: 16.0),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isWolof
                              ? 'Commandes Vocales Wolof'
                              : 'Commandes Vocales',
                          style: Theme.of(context)
                              .textTheme
                              .titleLarge
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4.0),
                        Text(
                          'Dites ces phrases pour contrôler l\'app',
                          style:
                              Theme.of(context).textTheme.bodySmall?.copyWith(
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.onSurfaceVariant,
                                  ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24.0),
            _buildCommandCard(
              context,
              Icons.search,
              'Rechercher Tracteur',
              'Gis traktëër',
              [const Color(0xff2196f3), const Color(0xff64b5f6)],
            ),
            const SizedBox(height: 12.0),
            _buildCommandCard(
              context,
              Icons.calendar_today,
              'Réserver',
              'Suma bëgg res',
              [const Color(0xffff9800), const Color(0xffffb74d)],
            ),
            const SizedBox(height: 12.0),
            _buildCommandCard(
              context,
              Icons.list,
              'Mes Réservations',
              'Wutal sama reservations',
              [const Color(0xff9c27b0), const Color(0xffba68c8)],
            ),
            const SizedBox(height: 12.0),
            _buildCommandCard(
              context,
              Icons.build,
              'Entretien',
              'Wutal entretien',
              [const Color(0xffe56d4b), const Color(0xfff19066)],
            ),
            const SizedBox(height: 12.0),
            _buildCommandCard(
              context,
              Icons.payment,
              'Paiement',
              'Dama bëgg fey',
              [const Color(0xff4caf50), const Color(0xff81c784)],
            ),
          ],
        ),
      ),
    );
  }
}
