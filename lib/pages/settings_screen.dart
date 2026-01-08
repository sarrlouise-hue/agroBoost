// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:hallo/globals/voice_command_provider.dart';
import 'package:hallo/globals/offline_mode_provider.dart';
import 'package:hallo/globals/notification_provider.dart';
import 'package:hallo/tractor_maintenance.dart';

class SettingsScreen extends StatefulWidget {
    const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() {
    return _SettingsScreenState();
  }
}

class _SettingsScreenState extends State<SettingsScreen> {
  Widget _buildSwitchOption({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool value,
    required void Function(bool) onChanged,
    List<Color>? iconGradient,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10.0),
              decoration: BoxDecoration(
                gradient: iconGradient != null
                    ? LinearGradient(colors: iconGradient)
                    : null,
                color: iconGradient == null
                    ? Theme.of(
                        context,
                      ).colorScheme.primary.withValues(alpha: 0.1)
                    : null,
                borderRadius: BorderRadius.circular(10.0),
              ),
              child: Icon(
                icon,
                color: iconGradient != null
                    ? Colors.white
                    : Theme.of(context).colorScheme.primary,
              ),
            ),
            const SizedBox(width: 16.0),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 4.0),
                  Text(
                    subtitle,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                  ),
                ],
              ),
            ),
            Switch(
              value: value,
              onChanged: onChanged,
              thumbColor: WidgetStateProperty.all(Colors.white),
              trackColor: WidgetStateProperty.resolveWith<Color>((states) {
                if (states.contains(WidgetState.selected)) {
                  return Theme.of(context).colorScheme.primary;
                }
                return Theme.of(context).colorScheme.surfaceContainerHighest;
              }),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuOption({
    required IconData icon,
    required String title,
    required String subtitle,
    required void Function() onTap,
    List<Color>? iconGradient,
    Widget? trailing,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12.0),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(10.0),
          decoration: BoxDecoration(
            gradient: iconGradient != null
                ? LinearGradient(colors: iconGradient)
                : null,
            color: iconGradient == null
                ? Theme.of(context).colorScheme.primary.withValues(alpha: 0.1)
                : null,
            borderRadius: BorderRadius.circular(10.0),
          ),
          child: Icon(
            icon,
            color: iconGradient != null
                ? Colors.white
                : Theme.of(context).colorScheme.primary,
          ),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: Text(subtitle),
        trailing: trailing ?? const Icon(Icons.arrow_forward_ios, size: 16.0),
        onTap: onTap,
      ),
    );
  }

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
            gradientColors[0].withValues(alpha: 0.08),
            gradientColors[1].withValues(alpha: 0.04),
          ],
        ),
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(
          color: gradientColors[0].withValues(alpha: 0.2),
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

  void _showVoiceCommands() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.7,
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24.0)),
        ),
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40.0,
                height: 4.0,
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.outlineVariant,
                  borderRadius: BorderRadius.circular(2.0),
                ),
              ),
            ),
            const SizedBox(height: 24.0),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12.0),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Theme.of(context).colorScheme.primary,
                        Theme.of(context).colorScheme.secondary,
                      ],
                    ),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.mic, color: Colors.white, size: 28.0),
                ),
                const SizedBox(width: 16.0),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Commandes Vocales Wolof',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                      Text(
                        'Dites ces phrases pour contrôler l\'app',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Theme.of(context)
                                  .colorScheme
                                  .onSurfaceVariant,
                            ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24.0),
            Expanded(
              child: ListView(
                children: [
                  _buildCommandCard(
                    context,
                    Icons.search,
                    'Rechercher Tracteur',
                    'Gis traktëër',
                    [
                      Theme.of(context).colorScheme.primary,
                      Theme.of(context).colorScheme.primaryContainer,
                    ],
                  ),
                  const SizedBox(height: 12.0),
                  _buildCommandCard(
                    context,
                    Icons.calendar_today,
                    'Réserver',
                    'Suma bëgg res',
                    [
                      Theme.of(context).colorScheme.primary,
                      Theme.of(context).colorScheme.primaryContainer,
                    ],
                  ),
                  const SizedBox(height: 12.0),
                  _buildCommandCard(
                    context,
                    Icons.list,
                    'Mes Réservations',
                    'Wutal sama reservations',
                    [
                      Theme.of(context).colorScheme.secondary,
                      Theme.of(context).colorScheme.secondaryContainer,
                    ],
                  ),
                  const SizedBox(height: 12.0),
                  _buildCommandCard(
                    context,
                    Icons.build,
                    'Entretien',
                    'Wutal entretien',
                    [
                      Theme.of(context).colorScheme.primary,
                      Theme.of(context).colorScheme.secondary,
                    ],
                  ),
                  const SizedBox(height: 12.0),
                  _buildCommandCard(
                    context,
                    Icons.payment,
                    'Paiement',
                    'Dama bëgg fey',
                    [
                      Theme.of(context).colorScheme.secondaryContainer,
                      Theme.of(context).colorScheme.primary,
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final voiceProvider = VoiceCommandProvider.of(context);
    final offlineProvider = OfflineModeProvider.of(context);
    final notificationProvider = NotificationProvider.of(context);
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        leading: IconButton(
          onPressed: () => Navigator.pop(context),
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
        ),
        title: const Text('Paramètres'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Support Vocal Wolof',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
            ),
            const SizedBox(height: 12.0),
            _buildSwitchOption(
              icon: Icons.language_outlined,
              title: 'Langue vocale',
              subtitle:
                  voiceProvider.currentLanguage == 'wo' ? 'Wolof' : 'Français',
              value: voiceProvider.currentLanguage == 'wo',
              onChanged: (newValue) {
                voiceProvider.setLanguage(newValue ? 'wo' : 'fr');
              },
              iconGradient: [
                Theme.of(context).colorScheme.primary,
                Theme.of(context).colorScheme.secondary,
              ],
            ),
            _buildMenuOption(
              icon: Icons.mic_outlined,
              title: 'Commandes disponibles',
              subtitle: 'Gis traktëër, Res, Fey...',
              onTap: _showVoiceCommands,
              iconGradient: [
                Theme.of(context).colorScheme.primary,
                Theme.of(context).colorScheme.primaryContainer,
              ],
            ),
            const SizedBox(height: 24.0),
            Text(
              'Mode Hors Ligne',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
            ),
            const SizedBox(height: 12.0),
            _buildSwitchOption(
              icon: offlineProvider.isOnline ? Icons.wifi : Icons.wifi_off,
              title: offlineProvider.isOnline ? 'En ligne' : 'Hors ligne',
              subtitle: offlineProvider.isOnline
                  ? 'Connecté au serveur'
                  : '${offlineProvider.pendingActionsCount} action(s) en attente',
              value: offlineProvider.isOnline,
              onChanged: (newValue) {
                offlineProvider.setOnlineStatus(newValue);
              },
              iconGradient: offlineProvider.isOnline
                  ? [
                      Theme.of(context).colorScheme.primary,
                      Theme.of(context).colorScheme.primaryContainer,
                    ]
                  : [
                      Theme.of(context).colorScheme.primary,
                      Theme.of(context).colorScheme.primaryContainer,
                    ],
            ),
            if (offlineProvider.lastSync != null)
              _buildMenuOption(
                icon: Icons.sync,
                title: 'Dernière synchronisation',
                subtitle:
                    '${offlineProvider.lastSync?.day}/${offlineProvider.lastSync?.month} à ${offlineProvider.lastSync?.hour}:${offlineProvider.lastSync?.minute.toString().padLeft(2, '0')}',
                onTap: () async {
                  await offlineProvider.syncNow();
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: const Text('Synchronisation réussie'),
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                      ),
                    );
                  }
                },
                iconGradient: [
                  Theme.of(context).colorScheme.primary,
                  Theme.of(context).colorScheme.primaryContainer,
                ],
                trailing: Icon(
                  Icons.refresh,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
            const SizedBox(height: 24.0),
            Text(
              'Notifications',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
            ),
            const SizedBox(height: 12.0),
            _buildMenuOption(
              icon: Icons.notifications_active_outlined,
              title: 'Notifications actives',
              subtitle:
                  '${notificationProvider.notifications.length} notification(s)',
              onTap: () {},
              iconGradient: [
                Theme.of(context).colorScheme.primary,
                Theme.of(context).colorScheme.primaryContainer,
              ],
              trailing: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12.0,
                  vertical: 6.0,
                ),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Theme.of(context).colorScheme.primary,
                      Theme.of(
                        context,
                      ).colorScheme.primary.withValues(alpha: 0.8),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(20.0),
                ),
                child: Text(
                  '${notificationProvider.unreadCount} non lue(s)',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 12.0,
                  ),
                ),
              ),
            ),
            _buildMenuOption(
              icon: Icons.check_circle_outline,
              title: 'Marquer tout comme lu',
              subtitle: 'Marquer toutes les notifications',
              onTap: () {
                notificationProvider.markAllAsRead();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const Text(
                      'Toutes les notifications marquées comme lues',
                    ),
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                  ),
                );
              },
              iconGradient: [
                Theme.of(context).colorScheme.primary,
                Theme.of(context).colorScheme.primaryContainer,
              ],
            ),
            _buildMenuOption(
              icon: Icons.delete_outline,
              title: 'Supprimer toutes',
              subtitle: 'Effacer toutes les notifications',
              onTap: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20.0),
                    ),
                    title: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8.0),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Theme.of(context).colorScheme.primary,
                                Theme.of(
                                  context,
                                ).colorScheme.primary.withValues(alpha: 0.8),
                              ],
                            ),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.warning_amber_rounded,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(width: 12.0),
                        const Text('Confirmer'),
                      ],
                    ),
                    content: const Text(
                      'Voulez-vous vraiment supprimer toutes les notifications ?',
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Annuler'),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          notificationProvider.clearAll();
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: const Text(
                                'Toutes les notifications supprimées',
                              ),
                              behavior: SnackBarBehavior.floating,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12.0),
                              ),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Theme.of(
                            context,
                          ).colorScheme.primary,
                          foregroundColor: Colors.white,
                        ),
                        child: const Text('Supprimer'),
                      ),
                    ],
                  ),
                );
              },
              iconGradient: [
                Theme.of(context).colorScheme.primary,
                Theme.of(context).colorScheme.primary.withValues(alpha: 0.8),
              ],
            ),
            const SizedBox(height: 24.0),
            Text(
              'Mode Test',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
            ),
            const SizedBox(height: 12.0),
            _buildMenuOption(
              icon: Icons.notifications_active_outlined,
              title: 'Générer notification test',
              subtitle: 'Créer une notification de réservation',
              onTap: () {
                notificationProvider.notifyReservationConfirmed(
                  'John Deere 6155R',
                  DateTime.now().add(const Duration(days: 3)),
                );
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const Text('Notification test générée'),
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                  ),
                );
              },
              iconGradient: [
                Theme.of(context).colorScheme.primary,
                Theme.of(context).colorScheme.primaryContainer,
              ],
            ),
            _buildMenuOption(
              icon: Icons.build_outlined,
              title: 'Alerte entretien test',
              subtitle: 'Créer une alerte de maintenance',
              onTap: () {
                notificationProvider.scheduleMaintenanceReminder(
                  TractorMaintenance(
                    id: 'test',
                    name: 'Tracteur Test',
                    model: 'Model X',
                    year: 2023,
                    currentEngineHours: 450,
                    lastMaintenanceDate: DateTime.now().subtract(
                      const Duration(days: 60),
                    ),
                    nextMaintenanceHours: 500,
                    nextMaintenanceDate: DateTime.now().add(
                      const Duration(days: 5),
                    ),
                    healthStatus: 'Bon',
                    totalMaintenanceCost: 500000.0,
                    totalMaintenanceCount: 5,
                  ),
                );
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const Text('Alerte entretien générée'),
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                  ),
                );
              },
              iconGradient: [
                Theme.of(context).colorScheme.primary,
                Theme.of(context).colorScheme.secondary,
              ],
            ),
            _buildMenuOption(
              icon: Icons.payment_outlined,
              title: 'Notification paiement test',
              subtitle: 'Créer une notification de paiement',
              onTap: () {
                notificationProvider.notifyPaymentReceived(50000.0);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const Text('Notification paiement générée'),
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                  ),
                );
              },
              iconGradient: [
                Theme.of(context).colorScheme.primary,
                Theme.of(context).colorScheme.primaryContainer,
              ],
            ),
          ],
        ),
      ),
    );
  }
}
