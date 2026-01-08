// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:hallo/components/admin_profile_bottom_sheet.dart';
import 'package:hallo/pages/users_management_screen.dart';
import 'package:hallo/pages/tractors_management_screen.dart';
import 'package:hallo/pages/stats_screen.dart';
import 'package:hallo/globals/theme_mode_provider.dart';
import 'package:hallo/globals/language_provider.dart';

class AdminDashboardScreen extends StatefulWidget {
    const AdminDashboardScreen({required this.language, super.key});

  final String language;

  @override
  State<AdminDashboardScreen> createState() {
    return _AdminDashboardScreenState();
  }
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  int _currentSection = 0;

  bool _twoFactorEnabled = true;

  bool _notifyNewUsers = true;

  bool _notifyReservations = true;

  bool _notifySystemAlerts = true;

  bool _notifyEmails = false;

  bool _notifyPush = true;

  String _filterLogsBy = 'all';

  @override
  Widget build(BuildContext context) {
    final bool isWolof = widget.language == 'wo';
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        elevation: 0.0,
        backgroundColor: Theme.of(context).colorScheme.surface,
        title: Text(
          _getSectionTitle(isWolof),
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: _showProfileMenu,
                borderRadius: BorderRadius.circular(12.0),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.all(8.0),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Theme.of(context).colorScheme.primary,
                        Theme.of(context).colorScheme.secondary,
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12.0),
                    boxShadow: [
                      BoxShadow(
                        color: Theme.of(
                          context,
                        ).colorScheme.primary.withValues(alpha: 0.3),
                        blurRadius: 8.0,
                        offset: const Offset(0.0, 2.0),
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.person_rounded,
                    color: Colors.white,
                    size: 24.0,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        child: _buildCurrentSection(isWolof),
      ),
    );
  }

  String _getSectionTitle(bool isWolof) {
    if (_currentSection == 0) {
      return isWolof ? 'Dashboard Admin' : 'Dashboard Admin';
    } else {
      if (_currentSection == 1) {
        return isWolof ? 'Mon Profil Admin' : 'Mon Profil Admin';
      } else {
        if (_currentSection == 2) {
          return isWolof ? 'Paramètres Système' : 'Paramètres Système';
        } else {
          if (_currentSection == 3) {
            return isWolof ? 'Activités & Logs' : 'Activités & Logs';
          } else {
            if (_currentSection == 4) {
              return isWolof ? 'Sécurité' : 'Sécurité';
            }
          }
        }
      }
    }
    return 'Dashboard Admin';
  }

  Widget _buildCurrentSection(bool isWolof) {
    if (_currentSection == 0) {
      return _buildDashboardSection(isWolof);
    } else {
      if (_currentSection == 1) {
        return _buildAdminProfileSection(isWolof);
      } else {
        if (_currentSection == 2) {
          return _buildSystemSettingsSection(isWolof);
        } else {
          if (_currentSection == 3) {
            return _buildActivityLogsSection(isWolof);
          } else {
            if (_currentSection == 4) {
              return _buildSecuritySection(isWolof);
            }
          }
        }
      }
    }
    return _buildDashboardSection(isWolof);
  }

  Widget _buildAdminProfileSection(bool isWolof) {
    return SingleChildScrollView(
      key: const ValueKey('profile'),
      padding: const EdgeInsets.all(24.0),
      child: Column(
        children: [
          const SizedBox(height: 20.0),
          Container(
            padding: const EdgeInsets.all(20.0),
            decoration: BoxDecoration(
              gradient: LinearGradient(
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
                  blurRadius: 20.0,
                  offset: const Offset(0.0, 8.0),
                ),
              ],
            ),
            child: const Icon(
              Icons.admin_panel_settings_rounded,
              color: Colors.white,
              size: 80.0,
            ),
          ),
          const SizedBox(height: 24.0),
          Text(
            'Administrateur Système',
            style: Theme.of(
              context,
            ).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8.0),
          Text(
            'admin@agroboost.com',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
          ),
          const SizedBox(height: 32.0),
          _buildProfileInfoCard(
            context,
            icon: Icons.badge_rounded,
            title: isWolof ? 'Nom complet' : 'Nom complet',
            value: 'Admin Principal',
          ),
          const SizedBox(height: 12.0),
          _buildProfileInfoCard(
            context,
            icon: Icons.email_rounded,
            title: isWolof ? 'Email' : 'Email',
            value: 'admin@agroboost.com',
          ),
          const SizedBox(height: 12.0),
          _buildProfileInfoCard(
            context,
            icon: Icons.phone_rounded,
            title: isWolof ? 'Téléphone' : 'Téléphone',
            value: '+221 77 123 45 67',
          ),
          const SizedBox(height: 12.0),
          _buildProfileInfoCard(
            context,
            icon: Icons.calendar_today_rounded,
            title: isWolof ? 'Membre depuis' : 'Membre depuis',
            value: 'Janvier 2024',
          ),
          const SizedBox(height: 12.0),
          _buildProfileInfoCard(
            context,
            icon: Icons.verified_user_rounded,
            title: isWolof ? 'Statut' : 'Statut',
            value: 'Super Administrateur',
            valueColor: const Color(0xff4caf50),
          ),
        ],
      ),
    );
  }

  void _changeSection(int newSection) {
    setState(() {
      _currentSection = newSection;
    });
  }

  void _showProfileMenu() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      isDismissible: true,
      enableDrag: true,
      builder: (context) => AdminProfileBottomSheet(
        language: widget.language,
        currentSection: _currentSection,
        onSectionChanged: _changeSection,
      ),
    );
  }

  Widget _buildCleanStatCard(
    BuildContext context, {
    required IconData icon,
    required String value,
    required String label,
    required Color color,
  }) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        color: color.withOpacity(0.78),
        borderRadius: BorderRadius.circular(16.0),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.2),
            blurRadius: 12.0,
            offset: const Offset(0.0, 4.0),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10.0),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12.0),
            ),
            child: Icon(icon, color: color, size: 24.0),
          ),
          const SizedBox(height: 16.0),
          Text(
            value,
            style: const TextStyle(
              fontSize: 28.0,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              height: 1.0,
            ),
          ),
          const SizedBox(height: 6.0),
          Text(
            label,
            style: const TextStyle(
              fontSize: 13.0,
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCleanQuickAction(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required void Function() onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16.0),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.all(20.0),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(16.0),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 8.0,
                offset: const Offset(0.0, 2.0),
              ),
              BoxShadow(
                color: Colors.black.withOpacity(0.02),
                blurRadius: 2.0,
                offset: const Offset(0.0, 1.0),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12.0),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12.0),
                ),
                child: Icon(icon, color: color, size: 24.0),
              ),
              const SizedBox(width: 16.0),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4.0),
                    Text(
                      subtitle,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color:
                                Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.arrow_forward_ios_rounded,
                size: 16.0,
                color: Theme.of(
                  context,
                ).colorScheme.onSurfaceVariant.withOpacity(0.5),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileInfoCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String value,
    Color? valueColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16.0),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8.0,
            offset: const Offset(0.0, 2.0),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12.0),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12.0),
            ),
            child: Icon(
              icon,
              color: Theme.of(context).colorScheme.primary,
              size: 24.0,
            ),
          ),
          const SizedBox(width: 16.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                ),
                const SizedBox(height: 4.0),
                Text(
                  value,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: valueColor,
                      ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLogCard(
    BuildContext context, {
    required IconData icon,
    required String action,
    required String user,
    required String time,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12.0),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8.0,
            offset: const Offset(0.0, 2.0),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10.0),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10.0),
            ),
            child: Icon(icon, color: color, size: 20.0),
          ),
          const SizedBox(width: 12.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  action,
                  style: const TextStyle(
                    fontSize: 15.0,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2.0),
                Text(
                  'Par $user',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                ),
              ],
            ),
          ),
          Text(
            time,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required void Function() onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16.0),
        child: Container(
          padding: const EdgeInsets.all(20.0),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(16.0),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 8.0,
                offset: const Offset(0.0, 2.0),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12.0),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12.0),
                ),
                child: Icon(icon, color: color, size: 24.0),
              ),
              const SizedBox(width: 16.0),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4.0),
                    Text(
                      subtitle,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color:
                                Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.arrow_forward_ios_rounded,
                size: 16.0,
                color: Theme.of(
                  context,
                ).colorScheme.onSurfaceVariant.withOpacity(0.5),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSecurityCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    Widget? trailing,
    void Function()? onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap ?? () {},
        borderRadius: BorderRadius.circular(16.0),
        child: Container(
          padding: const EdgeInsets.all(20.0),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(16.0),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 8.0,
                offset: const Offset(0.0, 2.0),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12.0),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12.0),
                ),
                child: Icon(icon, color: color, size: 24.0),
              ),
              const SizedBox(width: 16.0),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4.0),
                    Text(
                      subtitle,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color:
                                Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                    ),
                  ],
                ),
              ),
              if (trailing != null)
                trailing
              else
                Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: 16.0,
                  color: Theme.of(
                    context,
                  ).colorScheme.onSurfaceVariant.withValues(alpha: 0.5),
                ),
            ],
          ),
        ),
      ),
    );
  }

  void _showPasswordChangeDialog(BuildContext context, bool isWolof) {
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
                    Theme.of(context).colorScheme.secondary,
                  ],
                ),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.lock_rounded,
                color: Colors.white,
                size: 20.0,
              ),
            ),
            const SizedBox(width: 10.0),
            Expanded(
              child: Text(
                isWolof ? 'Changer le mot de passe' : 'Changer le mot de passe',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 17.0,
                    ),
                overflow: TextOverflow.ellipsis,
                maxLines: 1,
              ),
            ),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextField(
                obscureText: true,
                decoration: InputDecoration(
                  labelText:
                      isWolof ? 'Ancien mot de passe' : 'Ancien mot de passe',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                ),
              ),
              const SizedBox(height: 12.0),
              TextField(
                obscureText: true,
                decoration: InputDecoration(
                  labelText:
                      isWolof ? 'Nouveau mot de passe' : 'Nouveau mot de passe',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                ),
              ),
              const SizedBox(height: 12.0),
              TextField(
                obscureText: true,
                decoration: InputDecoration(
                  labelText: isWolof
                      ? 'Confirmer le mot de passe'
                      : 'Confirmer le mot de passe',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(isWolof ? 'Annuler' : 'Annuler'),
          ),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Theme.of(context).colorScheme.primary,
                  Theme.of(context).colorScheme.secondary,
                ],
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            child: TextButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      isWolof
                          ? 'Mot de passe modifié avec succès'
                          : 'Mot de passe modifié avec succès',
                    ),
                    backgroundColor: Colors.green,
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                  ),
                );
              },
              child: Text(
                isWolof ? 'Modifier' : 'Modifier',
                style: const TextStyle(color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDashboardSection(bool isWolof) {
    final int totalUsers = 156;
    final int totalTractors = 48;
    final int totalBookings = 342;
    final double totalRevenue = 15680000.0;
    return SingleChildScrollView(
      key: const ValueKey('dashboard'),
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            isWolof ? 'Vue d\'ensemble' : 'Vue d\'ensemble',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  fontSize: 20.0,
                ),
          ),
          const SizedBox(height: 8.0),
          Text(
            isWolof
                ? 'Statistiques globales de la plateforme'
                : 'Statistiques globales de la plateforme',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
          ),
          const SizedBox(height: 28.0),
          Row(
            children: [
              Expanded(
                child: _buildCleanStatCard(
                  context,
                  icon: Icons.people_rounded,
                  value: totalUsers.toString(),
                  label: isWolof ? 'Utilisateurs' : 'Utilisateurs',
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
              const SizedBox(width: 16.0),
              Expanded(
                child: _buildCleanStatCard(
                  context,
                  icon: Icons.agriculture_rounded,
                  value: totalTractors.toString(),
                  label: isWolof ? 'Tracteurs' : 'Tracteurs',
                  color: Theme.of(context).colorScheme.secondary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16.0),
          Row(
            children: [
              Expanded(
                child: _buildCleanStatCard(
                  context,
                  icon: Icons.event_available_rounded,
                  value: totalBookings.toString(),
                  label: isWolof ? 'Réservations' : 'Réservations',
                  color: Theme.of(context).colorScheme.secondaryContainer,
                ),
              ),
              const SizedBox(width: 16.0),
              Expanded(
                child: _buildCleanStatCard(
                  context,
                  icon: Icons.payments_rounded,
                  value: '${(totalRevenue / 1000000).toStringAsFixed(1)}M',
                  label: isWolof ? 'Revenu' : 'Revenu',
                  color: Theme.of(context).colorScheme.primaryContainer,
                ),
              ),
            ],
          ),
          const SizedBox(height: 36.0),
          Text(
            isWolof ? 'Gestion rapide' : 'Gestion rapide',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  fontSize: 20.0,
                ),
          ),
          const SizedBox(height: 20.0),
          _buildCleanQuickAction(
            context,
            icon: Icons.people_rounded,
            title: isWolof ? 'Utilisateurs' : 'Utilisateurs',
            subtitle:
                isWolof ? 'Gérer les utilisateurs' : 'Gérer les utilisateurs',
            color: Theme.of(context).colorScheme.primary,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) =>
                      UsersManagementScreen(language: widget.language),
                ),
              );
            },
          ),
          const SizedBox(height: 12.0),
          _buildCleanQuickAction(
            context,
            icon: Icons.agriculture_rounded,
            title: isWolof ? 'Tracteurs' : 'Tracteurs',
            subtitle: isWolof ? 'Gérer les tracteurs' : 'Gérer les tracteurs',
            color: Theme.of(context).colorScheme.secondary,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => TractorsManagementScreen(
                    language: widget.language,
                    showBackButton: true,
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 12.0),
          _buildCleanQuickAction(
            context,
            icon: Icons.bar_chart_rounded,
            title: isWolof ? 'Statistiques' : 'Statistiques',
            subtitle:
                isWolof ? 'Voir les statistiques' : 'Voir les statistiques',
            color: Theme.of(context).colorScheme.secondaryContainer,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => StatsScreen(language: widget.language),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  void _showBackupDialog(BuildContext context, bool isWolof) {
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
                    Theme.of(context).colorScheme.secondaryContainer,
                    Theme.of(context).colorScheme.secondary,
                  ],
                ),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.backup_rounded, color: Colors.white),
            ),
            const SizedBox(width: 12.0),
            Text(isWolof ? 'Sauvegarde' : 'Sauvegarde'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              isWolof
                  ? 'Dernière sauvegarde: Aujourd\'hui à 03:00'
                  : 'Dernière sauvegarde: Aujourd\'hui à 03:00',
            ),
            const SizedBox(height: 16.0),
            Text(
              isWolof
                  ? 'Sauvegarde automatique activée\nFréquence: Quotidienne'
                  : 'Sauvegarde automatique activée\nFréquence: Quotidienne',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(isWolof ? 'Fermer' : 'Fermer'),
          ),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Theme.of(context).colorScheme.secondaryContainer,
                  Theme.of(context).colorScheme.secondary,
                ],
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            child: TextButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      isWolof
                          ? 'Sauvegarde en cours...'
                          : 'Sauvegarde en cours...',
                    ),
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                  ),
                );
              },
              child: Text(
                isWolof ? 'Sauvegarder maintenant' : 'Sauvegarder maintenant',
                style: const TextStyle(color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showUpdateDialog(BuildContext context, bool isWolof) {
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
                    Theme.of(context).colorScheme.primaryContainer,
                    Theme.of(context).colorScheme.primary,
                  ],
                ),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.update_rounded, color: Colors.white),
            ),
            const SizedBox(width: 12.0),
            Text(isWolof ? 'Mises à jour' : 'Mises à jour'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              isWolof ? 'Version actuelle: 2.1.0' : 'Version actuelle: 2.1.0',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8.0),
            Text(
              isWolof
                  ? 'Votre application est à jour ✓'
                  : 'Votre application est à jour ✓',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.secondaryContainer,
                  ),
            ),
            const SizedBox(height: 16.0),
            Text(
              isWolof
                  ? 'Dernière vérification:\nAujourd\'hui à 08:30'
                  : 'Dernière vérification:\nAujourd\'hui à 08:30',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(isWolof ? 'Fermer' : 'Fermer'),
          ),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Theme.of(context).colorScheme.primaryContainer,
                  Theme.of(context).colorScheme.primary,
                ],
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            child: TextButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      isWolof
                          ? 'Vérification des mises à jour...'
                          : 'Vérification des mises à jour...',
                    ),
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                  ),
                );
              },
              child: Text(
                isWolof ? 'Vérifier' : 'Vérifier',
                style: const TextStyle(color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showDatabaseDialog(BuildContext context, bool isWolof) {
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
                    Theme.of(context).colorScheme.secondary,
                    Theme.of(context).colorScheme.secondaryContainer,
                  ],
                ),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.storage_rounded, color: Colors.white),
            ),
            const SizedBox(width: 12.0),
            Text(isWolof ? 'Base de données' : 'Base de données'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDbInfoRow(
              context,
              isWolof ? 'Taille totale:' : 'Taille totale:',
              '245 MB',
            ),
            const SizedBox(height: 8.0),
            _buildDbInfoRow(
              context,
              isWolof ? 'Utilisateurs:' : 'Utilisateurs:',
              '156 entrées',
            ),
            const SizedBox(height: 8.0),
            _buildDbInfoRow(
              context,
              isWolof ? 'Tracteurs:' : 'Tracteurs:',
              '48 entrées',
            ),
            const SizedBox(height: 8.0),
            _buildDbInfoRow(
              context,
              isWolof ? 'Réservations:' : 'Réservations:',
              '342 entrées',
            ),
            const SizedBox(height: 16.0),
            Text(
              isWolof
                  ? 'Dernière optimisation:\nIl y a 3 jours'
                  : 'Dernière optimisation:\nIl y a 3 jours',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(isWolof ? 'Fermer' : 'Fermer'),
          ),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Theme.of(context).colorScheme.secondary,
                  Theme.of(context).colorScheme.secondaryContainer,
                ],
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            child: TextButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      isWolof
                          ? 'Optimisation en cours...'
                          : 'Optimisation en cours...',
                    ),
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                  ),
                );
              },
              child: Text(
                isWolof ? 'Optimiser' : 'Optimiser',
                style: const TextStyle(color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDbInfoRow(BuildContext context, String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: Theme.of(context).textTheme.bodyMedium),
        Text(
          value,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: Theme.of(context).colorScheme.secondary,
              ),
        ),
      ],
    );
  }

  void _showDevicesDialog(BuildContext context, bool isWolof) {
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
                    Theme.of(context).colorScheme.primaryContainer,
                  ],
                ),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.devices_rounded,
                color: Colors.white,
                size: 20.0,
              ),
            ),
            const SizedBox(width: 12.0),
            Expanded(
              child: Text(
                isWolof ? 'Appareils connectés' : 'Appareils connectés',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 18.0,
                    ),
                overflow: TextOverflow.ellipsis,
                maxLines: 1,
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDeviceItem(
              context,
              'iPhone 14 Pro',
              'iOS 17.2',
              'Actif maintenant',
              Theme.of(context).colorScheme.primary,
            ),
            const SizedBox(height: 12.0),
            _buildDeviceItem(
              context,
              'MacBook Pro',
              'macOS 14.2',
              'Il y a 2h',
              Theme.of(context).colorScheme.primaryContainer,
            ),
            const SizedBox(height: 12.0),
            _buildDeviceItem(
              context,
              'iPad Air',
              'iPadOS 17.2',
              'Il y a 1 jour',
              Theme.of(context).colorScheme.secondary,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              isWolof ? 'Fermer' : 'Fermer',
              style: TextStyle(
                color: Theme.of(context).colorScheme.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showPermissionsDialog(BuildContext context, bool isWolof) {
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
                    Theme.of(context).colorScheme.primaryContainer,
                    Theme.of(context).colorScheme.secondaryContainer,
                  ],
                ),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.admin_panel_settings_rounded,
                color: Colors.white,
                size: 20.0,
              ),
            ),
            const SizedBox(width: 12.0),
            Expanded(
              child: Text(
                isWolof ? 'Permissions & Rôles' : 'Permissions & Rôles',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 18.0,
                    ),
                overflow: TextOverflow.ellipsis,
                maxLines: 1,
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Rôles disponibles:',
              style: Theme.of(
                context,
              ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12.0),
            _buildRoleItem(
              context,
              'Super Administrateur',
              'Accès complet au système',
              Theme.of(context).colorScheme.primary,
              true,
            ),
            const SizedBox(height: 8.0),
            _buildRoleItem(
              context,
              'Administrateur',
              'Gestion des utilisateurs et tracteurs',
              Theme.of(context).colorScheme.primaryContainer,
              false,
            ),
            const SizedBox(height: 8.0),
            _buildRoleItem(
              context,
              'Modérateur',
              'Validation des réservations',
              Theme.of(context).colorScheme.secondaryContainer,
              false,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              isWolof ? 'Fermer' : 'Fermer',
              style: TextStyle(
                color: Theme.of(context).colorScheme.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActivityLogsSection(bool isWolof) {
    final List<Map<String, dynamic>> allLogs = [
      {
        'action': 'Utilisateur ajouté',
        'user': 'Jean Dupont',
        'time': 'Il y a 2h',
        'icon': Icons.person_add_rounded,
        'color': Theme.of(context).colorScheme.secondaryContainer,
        'category': 'users',
      },
      {
        'action': 'Tracteur supprimé',
        'user': 'Admin',
        'time': 'Il y a 5h',
        'icon': Icons.delete_rounded,
        'color': Colors.red,
        'category': 'tractors',
      },
      {
        'action': 'Paramètres modifiés',
        'user': 'Admin',
        'time': 'Il y a 1j',
        'icon': Icons.settings_rounded,
        'color': Theme.of(context).colorScheme.primary,
        'category': 'settings',
      },
      {
        'action': 'Réservation validée',
        'user': 'Système',
        'time': 'Il y a 1j',
        'icon': Icons.check_circle_rounded,
        'color': Theme.of(context).colorScheme.secondaryContainer,
        'category': 'reservations',
      },
      {
        'action': 'Connexion admin',
        'user': 'Admin',
        'time': 'Il y a 2j',
        'icon': Icons.login_rounded,
        'color': Theme.of(context).colorScheme.secondary,
        'category': 'access',
      },
    ];
    final filteredLogs = _filterLogsBy == 'all'
        ? allLogs
        : allLogs.where((log) => log['category'] == _filterLogsBy).toList();
    return SingleChildScrollView(
      key: const ValueKey('logs'),
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  isWolof ? 'Activités récentes' : 'Activités récentes',
                  style: Theme.of(
                    context,
                  ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                ),
              ),
              TextButton.icon(
                onPressed: () {
                  _showLogsFilterMenu(context, isWolof);
                },
                icon: const Icon(Icons.filter_list_rounded, size: 20.0),
                label: Text(isWolof ? 'Filtrer' : 'Filtrer'),
              ),
            ],
          ),
          const SizedBox(height: 20.0),
          ...filteredLogs.map(
            (log) => Padding(
              padding: const EdgeInsets.only(bottom: 12.0),
              child: _buildLogCard(
                context,
                icon: log['icon'] as IconData,
                action: log['action'] as String,
                user: log['user'] as String,
                time: log['time'] as String,
                color: log['color'] as Color,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDeviceItem(
    BuildContext context,
    String name,
    String system,
    String lastUsed,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.all(12.0),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          Icon(Icons.devices, color: color, size: 24.0),
          const SizedBox(width: 12.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: Theme.of(
                    context,
                  ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold),
                ),
                Text(
                  system,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                ),
                Text(
                  lastUsed,
                  style: Theme.of(
                    context,
                  ).textTheme.bodySmall?.copyWith(fontSize: 11.0),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () {},
            icon: Icon(Icons.close, size: 18.0, color: Colors.red.shade400),
            constraints: const BoxConstraints(minWidth: 32.0, minHeight: 32.0),
            iconSize: 18.0,
          ),
        ],
      ),
    );
  }

  Widget _buildRoleItem(
    BuildContext context,
    String role,
    String description,
    Color color,
    bool isActive,
  ) {
    return Container(
      padding: const EdgeInsets.all(12.0),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(
          color: isActive ? color : color.withValues(alpha: 0.3),
          width: isActive ? 2.0 : 1.0,
        ),
      ),
      child: Row(
        children: [
          Icon(Icons.badge_rounded, color: color, size: 20.0),
          const SizedBox(width: 12.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  role,
                  style: Theme.of(
                    context,
                  ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold),
                ),
                Text(
                  description,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                ),
              ],
            ),
          ),
          if (isActive)
            Icon(Icons.check_circle_rounded, color: color, size: 20.0),
        ],
      ),
    );
  }

  Widget _buildLoginEntry(
    BuildContext context,
    String time,
    String device,
    String ip,
    String status,
  ) {
    return Container(
      padding: const EdgeInsets.all(12.0),
      decoration: BoxDecoration(
        color: Theme.of(
          context,
        ).colorScheme.secondaryContainer.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(
          color: Theme.of(
            context,
          ).colorScheme.secondaryContainer.withValues(alpha: 0.3),
        ),
      ),
      child: Row(
        children: [
          Icon(
            Icons.login_rounded,
            color: Theme.of(context).colorScheme.secondaryContainer,
            size: 20.0,
          ),
          const SizedBox(width: 12.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  time,
                  style: Theme.of(
                    context,
                  ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold),
                ),
                Text(
                  '$device • $ip',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
            decoration: BoxDecoration(
              color: Theme.of(
                context,
              ).colorScheme.secondaryContainer.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(8.0),
            ),
            child: Text(
              status,
              style: TextStyle(
                color: Theme.of(context).colorScheme.secondaryContainer,
                fontSize: 12.0,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showLoginHistoryDialog(BuildContext context, bool isWolof) {
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
                    Theme.of(context).colorScheme.secondary,
                  ],
                ),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.history_rounded,
                color: Colors.white,
                size: 20.0,
              ),
            ),
            const SizedBox(width: 10.0),
            Expanded(
              child: Text(
                isWolof ? 'Historique de connexion' : 'Historique de connexion',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 17.0,
                    ),
                overflow: TextOverflow.ellipsis,
                maxLines: 1,
              ),
            ),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildLoginEntry(
                context,
                'Aujourd\'hui 09:30',
                'iPhone 14 Pro',
                '192.168.1.100',
                'Succès',
              ),
              const SizedBox(height: 12.0),
              _buildLoginEntry(
                context,
                'Hier 14:15',
                'MacBook Pro',
                '192.168.1.101',
                'Succès',
              ),
              const SizedBox(height: 12.0),
              _buildLoginEntry(
                context,
                'Il y a 2 jours 18:45',
                'iPad Air',
                '192.168.1.102',
                'Succès',
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              isWolof ? 'Fermer' : 'Fermer',
              style: TextStyle(
                color: Theme.of(context).colorScheme.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterOption(
    BuildContext context, {
    required String label,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    final isSelected = _filterLogsBy == value;
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          setState(() {
            _filterLogsBy = value;
          });
          Navigator.pop(context);
        },
        borderRadius: BorderRadius.circular(12.0),
        child: Container(
          padding: const EdgeInsets.all(16.0),
          decoration: BoxDecoration(
            color: isSelected
                ? color.withValues(alpha: 0.15)
                : Theme.of(context).colorScheme.surface,
            border: Border.all(
              color: isSelected
                  ? color
                  : Theme.of(
                      context,
                    ).colorScheme.outlineVariant.withValues(alpha: 0.3),
              width: isSelected ? 2.0 : 1.0,
            ),
            borderRadius: BorderRadius.circular(12.0),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10.0),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(10.0),
                ),
                child: Icon(icon, color: color, size: 20.0),
              ),
              const SizedBox(width: 12.0),
              Expanded(
                child: Text(
                  label,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        fontWeight:
                            isSelected ? FontWeight.bold : FontWeight.normal,
                        color: isSelected ? color : null,
                      ),
                ),
              ),
              if (isSelected)
                Icon(Icons.check_circle_rounded, color: color, size: 20.0),
            ],
          ),
        ),
      ),
    );
  }

  void _showLogsFilterMenu(BuildContext context, bool isWolof) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      isDismissible: true,
      enableDrag: true,
      builder: (bottomSheetContext) => Container(
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24.0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 20.0,
              offset: const Offset(0.0, -4.0),
            ),
          ],
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SizedBox(height: 12.0),
                Container(
                  width: 40.0,
                  height: 4.0,
                  decoration: BoxDecoration(
                    color: Theme.of(
                      context,
                    ).colorScheme.onSurfaceVariant.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(2.0),
                  ),
                ),
                const SizedBox(height: 24.0),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12.0),
                        decoration: BoxDecoration(
                          color: Theme.of(
                            context,
                          ).colorScheme.primaryContainer.withValues(alpha: 0.3),
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                        child: Icon(
                          Icons.filter_list_rounded,
                          color: Theme.of(context).colorScheme.primary,
                          size: 24.0,
                        ),
                      ),
                      const SizedBox(width: 16.0),
                      Text(
                        isWolof
                            ? 'Filtrer les activités'
                            : 'Filtrer les activités',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24.0),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0),
                  child: Column(
                    children: [
                      _buildFilterOption(
                        context,
                        label: isWolof ? 'Tous' : 'Tous',
                        value: 'all',
                        icon: Icons.list_rounded,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                      const SizedBox(height: 12.0),
                      _buildFilterOption(
                        context,
                        label: isWolof ? 'Utilisateurs' : 'Utilisateurs',
                        value: 'users',
                        icon: Icons.people_rounded,
                        color: Theme.of(context).colorScheme.secondary,
                      ),
                      const SizedBox(height: 12.0),
                      _buildFilterOption(
                        context,
                        label: isWolof ? 'Tracteurs' : 'Tracteurs',
                        value: 'tractors',
                        icon: Icons.agriculture_rounded,
                        color: Theme.of(context).colorScheme.primaryContainer,
                      ),
                      const SizedBox(height: 12.0),
                      _buildFilterOption(
                        context,
                        label: isWolof ? 'Réservations' : 'Réservations',
                        value: 'reservations',
                        icon: Icons.event_available_rounded,
                        color: Theme.of(context).colorScheme.secondaryContainer,
                      ),
                      const SizedBox(height: 12.0),
                      _buildFilterOption(
                        context,
                        label: isWolof ? 'Accès' : 'Accès',
                        value: 'access',
                        icon: Icons.security_rounded,
                        color: Theme.of(context).colorScheme.secondary,
                      ),
                      const SizedBox(height: 12.0),
                      _buildFilterOption(
                        context,
                        label: isWolof ? 'Paramètres' : 'Paramètres',
                        value: 'settings',
                        icon: Icons.settings_rounded,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24.0),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showNotificationsMenu(BuildContext context, bool isWolof) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      isDismissible: true,
      enableDrag: true,
      builder: (bottomSheetContext) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(24.0),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.1),
                blurRadius: 20.0,
                offset: const Offset(0.0, -4.0),
              ),
            ],
          ),
          child: SafeArea(
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SizedBox(height: 12.0),
                  Container(
                    width: 40.0,
                    height: 4.0,
                    decoration: BoxDecoration(
                      color: Theme.of(
                        context,
                      ).colorScheme.onSurfaceVariant.withValues(alpha: 0.3),
                      borderRadius: BorderRadius.circular(2.0),
                    ),
                  ),
                  const SizedBox(height: 24.0),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12.0),
                          decoration: BoxDecoration(
                            color: Theme.of(context)
                                .colorScheme
                                .primaryContainer
                                .withValues(alpha: 0.3),
                            borderRadius: BorderRadius.circular(12.0),
                          ),
                          child: Icon(
                            Icons.notifications_active_rounded,
                            color: Theme.of(context).colorScheme.primary,
                            size: 24.0,
                          ),
                        ),
                        const SizedBox(width: 16.0),
                        Text(
                          isWolof
                              ? 'Notifications Système'
                              : 'Notifications Système',
                          style: Theme.of(context)
                              .textTheme
                              .titleLarge
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24.0),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Column(
                      children: [
                        _buildNotificationToggleItem(
                          context,
                          icon: Icons.person_add_rounded,
                          title: isWolof
                              ? 'Nouveaux Utilisateurs'
                              : 'Nouveaux Utilisateurs',
                          subtitle: isWolof
                              ? 'Alertes pour les nouvelles inscriptions'
                              : 'Alertes pour les nouvelles inscriptions',
                          value: _notifyNewUsers,
                          onChanged: (newValue) {
                            setState(() {
                              _notifyNewUsers = newValue;
                            });
                            setModalState(() {});
                          },
                        ),
                        const SizedBox(height: 12.0),
                        _buildNotificationToggleItem(
                          context,
                          icon: Icons.event_available_rounded,
                          title: isWolof ? 'Réservations' : 'Réservations',
                          subtitle: isWolof
                              ? 'Alertes pour les nouvelles réservations'
                              : 'Alertes pour les nouvelles réservations',
                          value: _notifyReservations,
                          onChanged: (newValue) {
                            setState(() {
                              _notifyReservations = newValue;
                            });
                            setModalState(() {});
                          },
                        ),
                        const SizedBox(height: 12.0),
                        _buildNotificationToggleItem(
                          context,
                          icon: Icons.warning_rounded,
                          title:
                              isWolof ? 'Alertes Système' : 'Alertes Système',
                          subtitle: isWolof
                              ? 'Erreurs et problèmes techniques'
                              : 'Erreurs et problèmes techniques',
                          value: _notifySystemAlerts,
                          onChanged: (newValue) {
                            setState(() {
                              _notifySystemAlerts = newValue;
                            });
                            setModalState(() {});
                          },
                        ),
                        const SizedBox(height: 12.0),
                        _buildNotificationToggleItem(
                          context,
                          icon: Icons.mail_rounded,
                          title: isWolof
                              ? 'Notifications Email'
                              : 'Notifications Email',
                          subtitle: isWolof
                              ? 'Recevoir les alertes par email'
                              : 'Recevoir les alertes par email',
                          value: _notifyEmails,
                          onChanged: (newValue) {
                            setState(() {
                              _notifyEmails = newValue;
                            });
                            setModalState(() {});
                          },
                        ),
                        const SizedBox(height: 12.0),
                        _buildNotificationToggleItem(
                          context,
                          icon: Icons.notifications_rounded,
                          title: isWolof
                              ? 'Notifications Push'
                              : 'Notifications Push',
                          subtitle: isWolof
                              ? 'Notifications en temps réel'
                              : 'Notifications en temps réel',
                          value: _notifyPush,
                          onChanged: (newValue) {
                            setState(() {
                              _notifyPush = newValue;
                            });
                            setModalState(() {});
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24.0),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSecuritySection(bool isWolof) {
    return SingleChildScrollView(
      key: const ValueKey('security'),
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Sécurité & Accès',
            style: Theme.of(
              context,
            ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 24.0),
          _buildSecurityCard(
            context,
            icon: Icons.lock_rounded,
            title: 'Mot de passe',
            subtitle: 'Modifier le mot de passe',
            color: Theme.of(context).colorScheme.secondary,
            onTap: () {
              _showPasswordChangeDialog(context, isWolof);
            },
          ),
          const SizedBox(height: 12.0),
          _buildToggleSettingCard(
            context,
            icon: Icons.security_rounded,
            title: 'Authentification à deux facteurs',
            subtitle: _twoFactorEnabled
                ? 'Sécurité renforcée activée'
                : 'Sécurité renforcée désactivée',
            color: const Color(0xff4caf50),
            value: _twoFactorEnabled,
            onChanged: (newValue) {
              setState(() {
                _twoFactorEnabled = newValue;
              });
            },
          ),
          const SizedBox(height: 12.0),
          _buildSecurityCard(
            context,
            icon: Icons.devices_rounded,
            title: 'Appareils connectés',
            subtitle: '3 appareils actifs',
            color: const Color(0xff2196f3),
            onTap: () {
              _showDevicesDialog(context, isWolof);
            },
          ),
          const SizedBox(height: 12.0),
          _buildSecurityCard(
            context,
            icon: Icons.admin_panel_settings_rounded,
            title: 'Permissions & Rôles',
            subtitle: 'Gérer les accès utilisateurs',
            color: Theme.of(context).colorScheme.primaryContainer,
            onTap: () {
              _showPermissionsDialog(context, isWolof);
            },
          ),
          const SizedBox(height: 12.0),
          _buildSecurityCard(
            context,
            icon: Icons.history_rounded,
            title: 'Historique de connexion',
            subtitle: 'Dernière connexion: Aujourd\'hui 09:30',
            color: const Color(0xff9c27b0),
            onTap: () {
              _showLoginHistoryDialog(context, isWolof);
            },
          ),
          const SizedBox(height: 32.0),
          Container(
            padding: const EdgeInsets.all(20.0),
            decoration: BoxDecoration(
              color: const Color(0xfff44336).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(16.0),
              border: Border.all(
                color: const Color(0xfff44336).withValues(alpha: 0.3),
                width: 2.0,
              ),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.warning_rounded,
                  color: Color(0xfff44336),
                  size: 32.0,
                ),
                const SizedBox(width: 16.0),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Zone de danger',
                        style: TextStyle(
                          fontSize: 16.0,
                          fontWeight: FontWeight.bold,
                          color: Color(0xfff44336),
                        ),
                      ),
                      const SizedBox(height: 4.0),
                      Text(
                        'Supprimer toutes les données',
                        style: TextStyle(
                          fontSize: 14.0,
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSystemSettingsSection(bool isWolof) {
    final themeProvider = ThemeModeProvider.of(context, listen: true);
    final languageProvider = LanguageProvider.of(context, listen: true);
    return SingleChildScrollView(
      key: const ValueKey('settings'),
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            isWolof
                ? 'Configuration de l\'application'
                : 'Configuration de l\'application',
            style: Theme.of(
              context,
            ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 24.0),
          _buildToggleSettingCard(
            context,
            icon: Icons.palette_rounded,
            title:
                isWolof ? 'Thème de l\'application' : 'Thème de l\'application',
            subtitle: themeProvider.isDarkMode
                ? (isWolof ? 'Mode Sombre' : 'Mode Sombre')
                : (isWolof ? 'Mode Clair' : 'Mode Clair'),
            color: const Color(0xff9c27b0),
            value: themeProvider.isDarkMode,
            onChanged: (newValue) {
              themeProvider.setDarkMode(newValue);
            },
          ),
          const SizedBox(height: 12.0),
          _buildToggleSettingCard(
            context,
            icon: Icons.language_rounded,
            title: isWolof ? 'Langue par défaut' : 'Langue par défaut',
            subtitle: languageProvider.isWolof ? 'Wolof' : 'Français',
            color: const Color(0xff2196f3),
            value: languageProvider.isWolof,
            onChanged: (newValue) {
              languageProvider.setLanguage(newValue ? 'wo' : 'fr');
            },
          ),
          const SizedBox(height: 12.0),
          _buildSettingsCard(
            context,
            icon: Icons.notifications_active_rounded,
            title: isWolof ? 'Notifications système' : 'Notifications système',
            subtitle: isWolof
                ? 'Gérer les alertes globales'
                : 'Gérer les alertes globales',
            color: Theme.of(context).colorScheme.primaryContainer,
            onTap: () {
              _showNotificationsMenu(context, isWolof);
            },
          ),
          const SizedBox(height: 12.0),
          _buildSettingsCard(
            context,
            icon: Icons.backup_rounded,
            title:
                isWolof ? 'Sauvegarde automatique' : 'Sauvegarde automatique',
            subtitle: isWolof
                ? 'Backup quotidien des données'
                : 'Backup quotidien des données',
            color: const Color(0xff4caf50),
            onTap: () {
              _showBackupDialog(context, isWolof);
            },
          ),
          const SizedBox(height: 12.0),
          _buildSettingsCard(
            context,
            icon: Icons.update_rounded,
            title: isWolof ? 'Mises à jour' : 'Mises à jour',
            subtitle:
                isWolof ? 'Version 2.1.0 - À jour' : 'Version 2.1.0 - À jour',
            color: const Color(0xffe91e63),
            onTap: () {
              _showUpdateDialog(context, isWolof);
            },
          ),
          const SizedBox(height: 12.0),
          _buildSettingsCard(
            context,
            icon: Icons.storage_rounded,
            title: isWolof ? 'Base de données' : 'Base de données',
            subtitle: isWolof
                ? 'Optimisation et maintenance'
                : 'Optimisation et maintenance',
            color: const Color(0xff607d8b),
            onTap: () {
              _showDatabaseDialog(context, isWolof);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildToggleSettingCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16.0),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8.0,
            offset: const Offset(0.0, 2.0),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12.0),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12.0),
            ),
            child: Icon(icon, color: color, size: 24.0),
          ),
          const SizedBox(width: 16.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16.0,
                    fontWeight: FontWeight.bold,
                  ),
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
            thumbColor: const WidgetStatePropertyAll(Colors.white),
            trackColor: WidgetStateProperty.resolveWith<Color>((states) {
              if (states.contains(WidgetState.selected)) {
                return Theme.of(context).colorScheme.primary;
              }
              return Theme.of(context).colorScheme.surfaceContainerHighest;
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationToggleItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12.0),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8.0,
            offset: const Offset(0.0, 2.0),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10.0),
            decoration: BoxDecoration(
              color: Theme.of(
                context,
              ).colorScheme.primaryContainer.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(10.0),
            ),
            child: Icon(
              icon,
              color: Theme.of(context).colorScheme.primary,
              size: 20.0,
            ),
          ),
          const SizedBox(width: 12.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(
                    context,
                  ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600),
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
            thumbColor: const WidgetStatePropertyAll(Colors.white),
            trackColor: WidgetStateProperty.resolveWith<Color>((states) {
              if (states.contains(WidgetState.selected)) {
                return Theme.of(context).colorScheme.primaryContainer;
              }
              return Theme.of(context).colorScheme.surfaceContainerHighest;
            }),
          ),
        ],
      ),
    );
  }
}
