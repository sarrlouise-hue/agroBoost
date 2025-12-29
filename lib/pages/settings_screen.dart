// ignore_for_file: unused_element, use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:allotracteur/globals/voice_command_provider.dart';
import 'package:allotracteur/globals/offline_mode_provider.dart';
import 'package:allotracteur/globals/notification_provider.dart';
import 'package:allotracteur/tractor_maintenance.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() {
    return _SettingsScreenState();
  }
}

class _SettingsScreenState extends State<SettingsScreen> {
  Widget _buildCommandTile(
    BuildContext context,
    IconData icon,
    String title,
    String command,
    Color color,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12.0),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8.0),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.2),
            borderRadius: BorderRadius.circular(8.0),
          ),
          child: Icon(icon, color: color),
        ),
        title: Text(title),
        subtitle: Text(
          '"$command"',
          style: TextStyle(
            fontStyle: FontStyle.italic,
            color: color,
            fontWeight: FontWeight.w600,
          ),
        ),
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
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Theme.of(context).colorScheme.surface,
              Theme.of(
                context,
              ).colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
            ],
          ),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(32.0)),
        ),
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 50.0,
                height: 5.0,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xffe56d4b), Color(0xfff19066)],
                  ),
                  borderRadius: BorderRadius.circular(3.0),
                ),
              ),
            ),
            const SizedBox(height: 24.0),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12.0),
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xffe56d4b), Color(0xfff19066)],
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
          ],
        ),
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

  Widget _buildSettingCard({
    required String title,
    required String titleWolof,
    required List<Widget> children,
    required List<Color> gradientColors,
    required IconData icon,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 20.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(24.0),
        border: Border.all(
          color: const Color(0xffe56d4b).withValues(alpha: 0.15),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8.0,
            offset: const Offset(0.0, 2.0),
          ),
        ],
      ),
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
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(24.0),
                topRight: Radius.circular(24.0),
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12.0),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        const Color(0xffe56d4b),
                        const Color(0xfff19066),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12.0),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xffe56d4b).withValues(alpha: 0.3),
                        blurRadius: 8.0,
                        offset: const Offset(0.0, 2.0),
                      ),
                    ],
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
                        style: Theme.of(context)
                            .textTheme
                            .titleMedium
                            ?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: Theme.of(context).colorScheme.onSurface,
                            ),
                      ),
                      const SizedBox(height: 2.0),
                      Text(
                        titleWolof,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Theme.of(context)
                                  .colorScheme
                                  .onSurfaceVariant,
                              fontStyle: FontStyle.italic,
                            ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Column(children: children),
        ],
      ),
    );
  }

  Widget _buildSettingTile({
    required IconData icon,
    required String title,
    required String subtitle,
    List<Color>? iconGradient,
    Widget? trailing,
    void Function()? onTap,
    bool showDivider = true,
  }) {
    return Column(
      children: [
        Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(16.0),
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 20.0,
                vertical: 16.0,
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10.0),
                    decoration: BoxDecoration(
                      gradient: iconGradient != null
                          ? LinearGradient(colors: iconGradient)
                          : null,
                      color: iconGradient == null
                          ? Theme.of(context).colorScheme.primaryContainer
                          : null,
                      borderRadius: BorderRadius.circular(12.0),
                      boxShadow: [
                        BoxShadow(
                          color: (iconGradient != null
                                  ? (((((iconGradient[0])))))
                                  : Theme.of(context).colorScheme.primary)
                              .withValues(alpha: 0.2),
                          blurRadius: 8.0,
                          offset: const Offset(0.0, 2.0),
                        ),
                      ],
                    ),
                    child: Icon(
                      icon,
                      color: iconGradient != null
                          ? Colors.white
                          : Theme.of(context).colorScheme.primary,
                      size: 22.0,
                    ),
                  ),
                  const SizedBox(width: 16.0),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: Theme.of(context)
                              .textTheme
                              .titleSmall
                              ?.copyWith(fontWeight: FontWeight.w600),
                        ),
                        const SizedBox(height: 2.0),
                        Text(
                          subtitle,
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
                  if (trailing != null) trailing,
                ],
              ),
            ),
          ),
        ),
        if (showDivider)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: Divider(
              height: 1.0,
              color: Theme.of(
                context,
              ).colorScheme.outlineVariant.withValues(alpha: 0.5),
            ),
          ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final voiceProvider = VoiceCommandProvider.of(context);
    final offlineProvider = OfflineModeProvider.of(context);
    final notificationProvider = NotificationProvider.of(context);
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Theme.of(
                context,
              ).colorScheme.primaryContainer.withValues(alpha: 0.08),
              Theme.of(context).colorScheme.surface,
            ],
            stops: const [0.0, 0.3],
          ),
        ),
        child: SafeArea(
          child: CustomScrollView(
            slivers: [
              SliverAppBar(
                pinned: true,
                floating: false,
                expandedHeight: 80.0,
                backgroundColor: Theme.of(context).colorScheme.surface,
                surfaceTintColor: Theme.of(context).colorScheme.surface,
                elevation: 0.0,
                shadowColor: Colors.black.withValues(alpha: 0.1),
                forceElevated: true,
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
                flexibleSpace: FlexibleSpaceBar(
                  titlePadding: const EdgeInsets.only(left: 60.0, bottom: 16.0),
                  title: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Paramètres',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                              fontSize: 20.0,
                            ),
                      ),
                      Text(
                        'Settings yu',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              fontSize: 11.0,
                              fontStyle: FontStyle.italic,
                              color: Theme.of(context)
                                  .colorScheme
                                  .onSurfaceVariant,
                            ),
                      ),
                    ],
                  ),
                  background: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Theme.of(
                            context,
                          ).colorScheme.primaryContainer.withValues(alpha: 0.1),
                          Theme.of(context).colorScheme.surface,
                        ],
                      ),
                      border: Border(
                        bottom: BorderSide(
                          color: Theme.of(
                            context,
                          ).colorScheme.outlineVariant.withValues(alpha: 0.3),
                          width: 1.0,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(16.0, 16.0, 16.0, 100.0),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    _buildSettingCard(
                      title: 'Support Vocal Wolof',
                      titleWolof: 'Wolof bu Kham',
                      gradientColors: const [
                        Color(0xffe56d4b),
                        Color(0xfff19066),
                      ],
                      icon: Icons.mic_outlined,
                      children: [
                        _buildSettingTile(
                          icon: Icons.language_outlined,
                          title: 'Langue vocale',
                          subtitle: voiceProvider.currentLanguage == 'wo'
                              ? 'Wolof'
                              : 'Français',
                          iconGradient: const [
                            Color(0xffe56d4b),
                            Color(0xfff19066),
                          ],
                          trailing: Switch(
                            value: voiceProvider.currentLanguage == 'wo',
                            onChanged: (newValue) {
                              voiceProvider.setLanguage(newValue ? 'wo' : 'fr');
                            },
                            thumbColor: WidgetStateProperty.all(Colors.white),
                            trackColor: WidgetStateProperty.resolveWith<Color>((
                              states,
                            ) {
                              if (states.contains(WidgetState.selected)) {
                                return const Color(0xffe56d4b);
                              }
                              return Theme.of(
                                context,
                              ).colorScheme.surfaceContainerHighest;
                            }),
                          ),
                        ),
                        _buildSettingTile(
                          icon: Icons.mic_outlined,
                          title: 'Commandes disponibles',
                          subtitle: 'Gis traktëër, Res, Fey...',
                          iconGradient: const [
                            Color(0xfff19066),
                            Color(0xffffda79),
                          ],
                          trailing: Icon(
                            Icons.chevron_right_rounded,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                          onTap: () {
                            _showVoiceCommands();
                          },
                          showDivider: false,
                        ),
                      ],
                    ),
                    _buildSettingCard(
                      title: 'Mode Hors Ligne',
                      titleWolof: 'Offline Mode',
                      gradientColors: offlineProvider.isOnline
                          ? const [Color(0xff4caf50), Color(0xff81c784)]
                          : const [Color(0xffff9800), Color(0xffffb74d)],
                      icon: offlineProvider.isOnline
                          ? Icons.cloud_done_outlined
                          : Icons.cloud_off_outlined,
                      children: [
                        _buildSettingTile(
                          icon: offlineProvider.isOnline
                              ? Icons.wifi
                              : Icons.wifi_off,
                          title: offlineProvider.isOnline
                              ? 'En ligne'
                              : 'Hors ligne',
                          subtitle: offlineProvider.isOnline
                              ? 'Connecté au serveur'
                              : '${offlineProvider.pendingActionsCount} action(s) en attente',
                          iconGradient: offlineProvider.isOnline
                              ? const [Color(0xff4caf50), Color(0xff81c784)]
                              : const [Color(0xffff9800), Color(0xffffb74d)],
                          trailing: Switch(
                            value: offlineProvider.isOnline,
                            onChanged: (newValue) {
                              offlineProvider.setOnlineStatus(newValue);
                            },
                            thumbColor: WidgetStateProperty.all(Colors.white),
                            trackColor: WidgetStateProperty.resolveWith<Color>((
                              states,
                            ) {
                              if (states.contains(WidgetState.selected)) {
                                return const Color(0xff4caf50);
                              }
                              return Theme.of(
                                context,
                              ).colorScheme.surfaceContainerHighest;
                            }),
                          ),
                          showDivider: offlineProvider.lastSync != null,
                        ),
                        if (offlineProvider.lastSync != null)
                          _buildSettingTile(
                            icon: Icons.sync,
                            title: 'Dernière synchronisation',
                            subtitle:
                                '${offlineProvider.lastSync?.day}/${offlineProvider.lastSync?.month} à ${offlineProvider.lastSync?.hour}:${offlineProvider.lastSync?.minute.toString().padLeft(2, '0')}',
                            iconGradient: const [
                              Color(0xff2196f3),
                              Color(0xff64b5f6),
                            ],
                            trailing: Container(
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [
                                    Color(0xff2196f3),
                                    Color(0xff64b5f6),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(12.0),
                              ),
                              child: IconButton(
                                onPressed: () async {
                                  await offlineProvider.syncNow();
                                  if (mounted) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: const Text(
                                          'Synchronisation réussie',
                                        ),
                                        backgroundColor: Colors.green,
                                        behavior: SnackBarBehavior.floating,
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(
                                            12.0,
                                          ),
                                        ),
                                      ),
                                    );
                                  }
                                },
                                icon: const Icon(
                                  Icons.refresh,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                            showDivider: false,
                          ),
                      ],
                    ),
                    _buildSettingCard(
                      title: 'Notifications',
                      titleWolof: 'Notifications',
                      gradientColors: const [
                        Color(0xff2196f3),
                        Color(0xff64b5f6),
                      ],
                      icon: Icons.notifications_outlined,
                      children: [
                        _buildSettingTile(
                          icon: Icons.notifications_active_outlined,
                          title: 'Notifications actives',
                          subtitle:
                              '${notificationProvider.notifications.length} notification(s)',
                          iconGradient: const [
                            Color(0xff2196f3),
                            Color(0xff64b5f6),
                          ],
                          trailing: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12.0,
                              vertical: 6.0,
                            ),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.red.shade400,
                                  Colors.red.shade600,
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
                        _buildSettingTile(
                          icon: Icons.check_circle_outline,
                          title: 'Marquer tout comme lu',
                          subtitle: 'Marquer toutes les notifications',
                          iconGradient: const [
                            Color(0xff4caf50),
                            Color(0xff81c784),
                          ],
                          trailing: Icon(
                            Icons.chevron_right_rounded,
                            color: Theme.of(
                              context,
                            ).colorScheme.onSurfaceVariant,
                          ),
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
                        ),
                        _buildSettingTile(
                          icon: Icons.delete_outline,
                          title: 'Supprimer toutes',
                          subtitle: 'Effacer toutes les notifications',
                          iconGradient: const [
                            Color(0xfff44336),
                            Color(0xffe57373),
                          ],
                          trailing: Icon(
                            Icons.chevron_right_rounded,
                            color: Theme.of(
                              context,
                            ).colorScheme.onSurfaceVariant,
                          ),
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
                                      decoration: const BoxDecoration(
                                        gradient: LinearGradient(
                                          colors: [
                                            Color(0xfff44336),
                                            Color(0xffe57373),
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
                                  Container(
                                    decoration: BoxDecoration(
                                      gradient: const LinearGradient(
                                        colors: [
                                          Color(0xfff44336),
                                          Color(0xffe57373),
                                        ],
                                      ),
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    child: TextButton(
                                      onPressed: () {
                                        notificationProvider.clearAll();
                                        Navigator.pop(context);
                                        ScaffoldMessenger.of(
                                          context,
                                        ).showSnackBar(
                                          SnackBar(
                                            content: const Text(
                                              'Toutes les notifications supprimées',
                                            ),
                                            behavior: SnackBarBehavior.floating,
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(12.0),
                                            ),
                                          ),
                                        );
                                      },
                                      child: const Text(
                                        'Supprimer',
                                        style: TextStyle(color: Colors.white),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
                          showDivider: false,
                        ),
                      ],
                    ),
                    _buildSettingCard(
                      title: 'Mode Test',
                      titleWolof: 'Test Mode',
                      gradientColors: const [
                        Color(0xff9c27b0),
                        Color(0xffba68c8),
                      ],
                      icon: Icons.science_outlined,
                      children: [
                        _buildSettingTile(
                          icon: Icons.notifications_active_outlined,
                          title: 'Générer notification test',
                          subtitle: 'Créer une notification de réservation',
                          iconGradient: const [
                            Color(0xff2196f3),
                            Color(0xff64b5f6),
                          ],
                          trailing: Icon(
                            Icons.chevron_right_rounded,
                            color: Theme.of(
                              context,
                            ).colorScheme.onSurfaceVariant,
                          ),
                          onTap: () {
                            notificationProvider.notifyReservationConfirmed(
                              'John Deere 6155R',
                              DateTime.now().add(const Duration(days: 3)),
                            );
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: const Text(
                                  'Notification test générée',
                                ),
                                behavior: SnackBarBehavior.floating,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12.0),
                                ),
                              ),
                            );
                          },
                        ),
                        _buildSettingTile(
                          icon: Icons.build_outlined,
                          title: 'Alerte entretien test',
                          subtitle: 'Créer une alerte de maintenance',
                          iconGradient: const [
                            Color(0xffe56d4b),
                            Color(0xfff19066),
                          ],
                          trailing: Icon(
                            Icons.chevron_right_rounded,
                            color: Theme.of(
                              context,
                            ).colorScheme.onSurfaceVariant,
                          ),
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
                        ),
                        _buildSettingTile(
                          icon: Icons.payment_outlined,
                          title: 'Notification paiement test',
                          subtitle: 'Créer une notification de paiement',
                          iconGradient: const [
                            Color(0xff4caf50),
                            Color(0xff81c784),
                          ],
                          trailing: Icon(
                            Icons.chevron_right_rounded,
                            color: Theme.of(
                              context,
                            ).colorScheme.onSurfaceVariant,
                          ),
                          onTap: () {
                            notificationProvider.notifyPaymentReceived(50000.0);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: const Text(
                                  'Notification paiement générée',
                                ),
                                behavior: SnackBarBehavior.floating,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12.0),
                                ),
                              ),
                            );
                          },
                          showDivider: false,
                        ),
                      ],
                    ),
                  ]),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
