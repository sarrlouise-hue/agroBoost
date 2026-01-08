import 'package:flutter/material.dart';
import 'package:hallo/globals/app_state.dart';
import 'package:hallo/pages/login_screen.dart';

class AdminProfileBottomSheet extends StatelessWidget {
    const AdminProfileBottomSheet({
    required this.language,
    required this.currentSection,
    required this.onSectionChanged,
    super.key,
  });

  final String language;

  final int currentSection;

  final Function(int) onSectionChanged;

  @override
  Widget build(BuildContext context) {
    final bool isWolof = language == 'wo';
    return Container(
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
            Container(
              padding: const EdgeInsets.all(16.0),
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
                Icons.admin_panel_settings_rounded,
                color: Colors.white,
                size: 48.0,
              ),
            ),
            const SizedBox(height: 16.0),
            Text(
              'Administrateur',
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4.0),
            Text(
              'admin@agroboost.com',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 32.0),
            _buildMenuItem(
              context,
              icon: Icons.dashboard_rounded,
              title: isWolof ? 'Tableau de bord' : 'Tableau de bord',
              isActive: currentSection == 0,
              onTap: () {
                onSectionChanged(0);
                Navigator.pop(context);
              },
            ),
            _buildMenuItem(
              context,
              icon: Icons.person_rounded,
              title: isWolof ? 'Mon Profil Admin' : 'Mon Profil Admin',
              isActive: currentSection == 1,
              onTap: () {
                onSectionChanged(1);
                Navigator.pop(context);
              },
            ),
            _buildMenuItem(
              context,
              icon: Icons.settings_suggest_rounded,
              title: isWolof ? 'Paramètres Système' : 'Paramètres Système',
              isActive: currentSection == 2,
              onTap: () {
                onSectionChanged(2);
                Navigator.pop(context);
              },
            ),
            _buildMenuItem(
              context,
              icon: Icons.history_rounded,
              title: isWolof ? 'Activités & Logs' : 'Activités & Logs',
              isActive: currentSection == 3,
              onTap: () {
                onSectionChanged(3);
                Navigator.pop(context);
              },
            ),
            _buildMenuItem(
              context,
              icon: Icons.security_rounded,
              title: isWolof ? 'Sécurité' : 'Sécurité',
              isActive: currentSection == 4,
              onTap: () {
                onSectionChanged(4);
                Navigator.pop(context);
              },
            ),
            const Divider(height: 32.0),
            _buildMenuItem(
              context,
              icon: Icons.logout_rounded,
              title: isWolof ? 'Déconnexion' : 'Déconnexion',
              isActive: false,
              onTap: () {
                Navigator.pop(context);
                _showLogoutConfirmation(context, isWolof);
              },
            ),
            const SizedBox(height: 24.0),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required void Function() onTap,
    required bool isActive,
    Color? color,
  }) {
    final itemColor =
        color ??
        (isActive
            ? Theme.of(context).colorScheme.primary
            : Theme.of(context).colorScheme.onSurface);
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          decoration: BoxDecoration(
            color: isActive
                ? Theme.of(context).colorScheme.primary.withValues(alpha: 0.1)
                : Colors.transparent,
            borderRadius: BorderRadius.circular(12.0),
          ),
          margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
          child: Row(
            children: [
              Icon(icon, color: itemColor, size: 24.0),
              const SizedBox(width: 16.0),
              Expanded(
                child: Text(
                  title,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: itemColor,
                    fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
                  ),
                ),
              ),
              if (isActive)
                Container(
                  padding: const EdgeInsets.all(4.0),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.primary,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check_rounded,
                    size: 16.0,
                    color: Colors.white,
                  ),
                )
              else
                Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: 16.0,
                  color: itemColor.withValues(alpha: 0.5),
                ),
            ],
          ),
        ),
      ),
    );
  }

  void _showLogoutConfirmation(BuildContext context, bool isWolof) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text(isWolof ? 'Génn?' : 'Déconnexion?'),
        content: Text(
          isWolof
              ? 'Bëgg nga génn?'
              : 'Voulez-vous vraiment vous déconnecter ?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: Text(isWolof ? 'Deedeet' : 'Annuler'),
          ),
          ElevatedButton(
            onPressed: () async {
              final appState = AppState.of(dialogContext, listen: false);
              await appState.logout();
              if (dialogContext.mounted) {
                Navigator.pushAndRemoveUntil(
                  dialogContext,
                  MaterialPageRoute(builder: (context) => const LoginScreen()),
                  (route) => false,
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: Text(isWolof ? 'Génn' : 'Déconnexion'),
          ),
        ],
      ),
    );
  }
}
