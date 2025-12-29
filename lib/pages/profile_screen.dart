// ignore_for_file: unused_field, unused_element

import 'package:flutter/material.dart';
import 'package:allotracteur/pages/notifications_screen.dart';
import 'package:allotracteur/pages/settings_screen.dart';
import 'package:allotracteur/globals/app_state.dart';
import 'package:allotracteur/globals/language_provider.dart';
import 'package:allotracteur/pages/login_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({
    required this.language,
    required this.userType,
    super.key,
  });

  final String language;

  final String userType;

  @override
  State<ProfileScreen> createState() {
    return _ProfileScreenState();
  }
}

class _ProfileScreenState extends State<ProfileScreen> {
  String _currentView = 'main';

  final String _userName = 'Mamadou Diop';

  final String _userPhone = '+221 77 123 45 67';

  final String _userEmail = 'mamadou.diop@email.com';

  final String _userLocation = 'Dakar, Sénégal';

  final int _totalReservations = 12;

  final double _totalSpent = 1450000.0;

  final double _rating = 4.8;

  void _navigateToView(String viewName) {
    setState(() {
      _currentView = viewName;
    });
  }

  void _navigateBack() {
    setState(() {
      _currentView = 'main';
    });
  }

  Widget _buildVoiceCommandsView(bool isWolof) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 16.0),
          child: Row(
            children: [
              IconButton(
                onPressed: _navigateBack,
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
              const SizedBox(width: 12.0),
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
                child: const Icon(Icons.mic, color: Colors.white, size: 28.0),
              ),
              const SizedBox(width: 16.0),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      isWolof ? 'Commandes Vocales Wolof' : 'Commandes Vocales',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 4.0),
                    Text(
                      'Dites ces phrases pour contrôler l\'app',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color:
                                Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24.0),
        _buildCommandCard(Icons.search, 'Rechercher Tracteur', 'Gis traktëër', [
          const Color(0xff2196f3),
          const Color(0xff64b5f6),
        ]),
        const SizedBox(height: 12.0),
        _buildCommandCard(Icons.calendar_today, 'Réserver', 'Suma bëgg res', [
          const Color(0xffff9800),
          const Color(0xffffb74d),
        ]),
        const SizedBox(height: 12.0),
        _buildCommandCard(
          Icons.list,
          'Mes Réservations',
          'Wutal sama reservations',
          [const Color(0xff9c27b0), const Color(0xffba68c8)],
        ),
        const SizedBox(height: 12.0),
        _buildCommandCard(Icons.build, 'Entretien', 'Wutal entretien', [
          const Color(0xffe56d4b),
          const Color(0xfff19066),
        ]),
        const SizedBox(height: 12.0),
        _buildCommandCard(Icons.payment, 'Paiement', 'Dama bëgg fey', [
          const Color(0xff4caf50),
          const Color(0xff81c784),
        ]),
      ],
    );
  }

  Widget _buildCommandCard(
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

  Widget _buildStatCard({
    required IconData icon,
    required String value,
    required String label,
    required Color color,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(12.0),
          border: Border.all(color: color.withValues(alpha: 0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28.0),
            const SizedBox(height: 8.0),
            Text(
              value,
              style: TextStyle(
                fontSize: 20.0,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            const SizedBox(height: 4.0),
            Text(
              label,
              style: TextStyle(
                fontSize: 11.0,
                color: color,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(icon, size: 20.0, color: Theme.of(context).colorScheme.primary),
          const SizedBox(width: 12.0),
          Text(
            '$label:',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
          ),
          const SizedBox(width: 8.0),
          Expanded(
            child: Text(
              value,
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600),
              textAlign: TextAlign.end,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuOption({
    required IconData icon,
    required String title,
    required String subtitle,
    required void Function() onTap,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12.0),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(10.0),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(10.0),
          ),
          child: Icon(icon, color: Theme.of(context).colorScheme.primary),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16.0),
        onTap: onTap,
      ),
    );
  }

  void _showEditProfileDialog(bool isWolof) {
    final nameController = TextEditingController(text: _userName);
    final emailController = TextEditingController(text: _userEmail);
    final locationController = TextEditingController(text: _userLocation);
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isWolof ? 'Soppi profil' : 'Modifier le profil'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: InputDecoration(
                  labelText: isWolof ? 'Tur' : 'Nom',
                  prefixIcon: const Icon(Icons.person),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                ),
              ),
              const SizedBox(height: 16.0),
              TextField(
                controller: emailController,
                decoration: InputDecoration(
                  labelText: 'Email',
                  prefixIcon: const Icon(Icons.email),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                ),
              ),
              const SizedBox(height: 16.0),
              TextField(
                controller: locationController,
                decoration: InputDecoration(
                  labelText: isWolof ? 'Bes' : 'Localisation',
                  prefixIcon: const Icon(Icons.location_on),
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
            child: Text(isWolof ? 'Deedeet' : 'Annuler'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    isWolof
                        ? 'Profil bi soppi na'
                        : 'Profil modifié avec succès',
                  ),
                  backgroundColor: Colors.green,
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.primary,
              foregroundColor: Colors.white,
            ),
            child: Text(isWolof ? 'Yéesal' : 'Enregistrer'),
          ),
        ],
      ),
    );
  }

  void _showSecurityDialog(bool isWolof) {
    final currentPasswordController = TextEditingController();
    final newPasswordController = TextEditingController();
    final confirmPasswordController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isWolof ? 'Sécurité' : 'Sécurité'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: currentPasswordController,
                obscureText: true,
                decoration: InputDecoration(
                  labelText:
                      isWolof ? 'Mot de passe bu bees' : 'Mot de passe actuel',
                  prefixIcon: const Icon(Icons.lock_outline),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                ),
              ),
              const SizedBox(height: 16.0),
              TextField(
                controller: newPasswordController,
                obscureText: true,
                decoration: InputDecoration(
                  labelText:
                      isWolof ? 'Mot de passe bu bees' : 'Nouveau mot de passe',
                  prefixIcon: const Icon(Icons.lock),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                ),
              ),
              const SizedBox(height: 16.0),
              TextField(
                controller: confirmPasswordController,
                obscureText: true,
                decoration: InputDecoration(
                  labelText: isWolof
                      ? 'Konfirme mot de passe'
                      : 'Confirmer le mot de passe',
                  prefixIcon: const Icon(Icons.lock),
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
            child: Text(isWolof ? 'Deedeet' : 'Annuler'),
          ),
          ElevatedButton(
            onPressed: () {
              if (newPasswordController.text ==
                      confirmPasswordController.text &&
                  newPasswordController.text.length >= 6) {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      isWolof
                          ? 'Mot de passe bi soppi na'
                          : 'Mot de passe modifié',
                    ),
                    backgroundColor: Colors.green,
                  ),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      isWolof
                          ? 'Mot de passe yi ñu bokk ci'
                          : 'Les mots de passe ne correspondent pas',
                    ),
                    backgroundColor: Colors.red,
                  ),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.primary,
              foregroundColor: Colors.white,
            ),
            child: Text(isWolof ? 'Yéesal' : 'Modifier'),
          ),
        ],
      ),
    );
  }

  void _showHelpDialog(bool isWolof) {
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
            Text(
              isWolof ? 'Ndimbal' : 'Aide & Support',
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24.0),
            Expanded(
              child: ListView(
                children: [
                  _buildHelpItem(
                    Icons.contact_support,
                    'Comment réserver un tracteur ?',
                    'Parcourez la carte, sélectionnez un tracteur et cliquez sur Réserver.',
                  ),
                  _buildHelpItem(
                    Icons.payment,
                    'Comment effectuer un paiement ?',
                    'Vous pouvez payer via Wave, Orange Money ou Free Money après confirmation.',
                  ),
                  _buildHelpItem(
                    Icons.cancel,
                    'Comment annuler une réservation ?',
                    'Allez dans Mes Réservations, sélectionnez la réservation et cliquez sur Annuler.',
                  ),
                  _buildHelpItem(
                    Icons.phone,
                    'Contacter le support',
                    'Téléphone: +221 33 123 45 67\nEmail: support@agroboost.sn',
                  ),
                  _buildHelpItem(
                    Icons.info,
                    'À propos',
                    'AGRO BOOST v1.0.0\nPlateforme de location de tracteurs',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHelpItem(IconData icon, String title, String content) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12.0),
      child: ExpansionTile(
        leading: Container(
          padding: const EdgeInsets.all(8.0),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.primaryContainer,
            borderRadius: BorderRadius.circular(8.0),
          ),
          child: Icon(icon, color: Theme.of(context).colorScheme.primary),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(content, style: Theme.of(context).textTheme.bodyMedium),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isWolof = widget.language == 'wo';
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text(isWolof ? 'Sama Profil' : 'Mon Profil'),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const NotificationsScreen(),
                ),
              );
            },
            icon: const Icon(Icons.notifications_outlined),
          ),
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const SettingsScreen()),
              );
            },
            icon: const Icon(Icons.settings_outlined),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: _buildMainView(isWolof),
      ),
    );
  }

  Widget _buildSwitchOption({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool value,
    required void Function(bool) onChanged,
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
                color: Theme.of(
                  context,
                ).colorScheme.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(10.0),
              ),
              child: Icon(icon, color: Theme.of(context).colorScheme.primary),
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

  Widget _buildMainView(bool isWolof) {
    final appState = AppState.of(context, listen: true);
    final languageProvider = LanguageProvider.of(context, listen: true);
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(24.0),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Theme.of(context).colorScheme.primary,
                Theme.of(context).colorScheme.secondary,
              ],
            ),
            borderRadius: BorderRadius.circular(16.0),
          ),
          child: Column(
            children: [
              Container(
                width: 100.0,
                height: 100.0,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 4.0),
                ),
                child: Icon(
                  Icons.person,
                  size: 50.0,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
              const SizedBox(height: 16.0),
              Text(
                _userName,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 24.0,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4.0),
              Text(
                _userPhone,
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.9),
                  fontSize: 14.0,
                ),
              ),
              const SizedBox(height: 8.0),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12.0,
                  vertical: 6.0,
                ),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(20.0),
                ),
                child: Text(
                  widget.userType == 'producteur'
                      ? (isWolof ? 'Producteur' : 'Producteur')
                      : widget.userType == 'prestataire'
                          ? (isWolof ? 'Prestataire' : 'Prestataire')
                          : 'Admin',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12.0,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(height: 16.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.star, color: Colors.amber, size: 20.0),
                  const SizedBox(width: 4.0),
                  Text(
                    _rating.toString(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 24.0),
        if (widget.userType == 'producteur') ...[
          Row(
            children: [
              _buildStatCard(
                icon: Icons.shopping_cart,
                value: _totalReservations.toString(),
                label: isWolof ? 'Réserwasioŋ' : 'Réservations',
                color: const Color(0xffe56d4b),
              ),
              const SizedBox(width: 12.0),
              _buildStatCard(
                icon: Icons.attach_money,
                value: '${(_totalSpent / 1000).toStringAsFixed(0)}K',
                label: isWolof ? 'Njëg' : 'Dépensé',
                color: Colors.green,
              ),
            ],
          ),
          const SizedBox(height: 24.0),
        ],
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isWolof ? 'Ay informat' : 'Informations',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 16.0),
                _buildInfoRow(
                  Icons.phone,
                  isWolof ? 'Telefon' : 'Téléphone',
                  _userPhone,
                ),
                const Divider(),
                _buildInfoRow(Icons.email, 'Email', _userEmail),
                const Divider(),
                _buildInfoRow(
                  Icons.location_on,
                  isWolof ? 'Bes' : 'Localisation',
                  _userLocation,
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24.0),
        _buildSwitchOption(
          icon: appState.isDarkMode ? Icons.dark_mode : Icons.light_mode,
          title: isWolof ? 'Mode Sombre' : 'Mode Sombre',
          subtitle: isWolof
              ? (appState.isDarkMode ? 'Activé' : 'Désactivé')
              : (appState.isDarkMode ? 'Activé' : 'Désactivé'),
          value: appState.isDarkMode,
          onChanged: (value) {
            appState.setDarkMode(value);
          },
        ),
        _buildSwitchOption(
          icon: Icons.language,
          title: isWolof ? 'Langue' : 'Langue',
          subtitle: languageProvider.isWolof ? 'Wolof' : 'Français',
          value: languageProvider.isWolof,
          onChanged: (value) {
            languageProvider.toggleLanguage();
          },
        ),
        _buildMenuOption(
          icon: Icons.edit,
          title: isWolof ? 'Soppi profil' : 'Modifier le profil',
          subtitle:
              isWolof ? 'Soppi sa ay informat' : 'Modifier vos informations',
          onTap: () {
            _showEditProfileDialog(isWolof);
          },
        ),
        _buildMenuOption(
          icon: Icons.lock,
          title: isWolof ? 'Sécurité' : 'Sécurité',
          subtitle:
              isWolof ? 'Mot de passe ak sécurité' : 'Mot de passe et sécurité',
          onTap: () {
            _showSecurityDialog(isWolof);
          },
        ),
        _buildMenuOption(
          icon: Icons.help_outline,
          title: isWolof ? 'Ndimbal' : 'Aide & Support',
          subtitle: isWolof ? 'FAQ ak support' : 'FAQ et support',
          onTap: () {
            _showHelpDialog(isWolof);
          },
        ),
        _buildMenuOption(
          icon: Icons.logout,
          title: isWolof ? 'Génn' : 'Déconnexion',
          subtitle: isWolof ? 'Génn ci sa account' : 'Se déconnecter',
          onTap: () async {
            final shouldLogout = await showDialog<bool>(
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
                    onPressed: () => Navigator.pop(dialogContext, false),
                    child: Text(isWolof ? 'Deedeet' : 'Annuler'),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.pop(dialogContext, true);
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
            if (shouldLogout == true && mounted) {
              final appStateLogout = AppState.of(context, listen: false);
              await appStateLogout.logout();
              if (mounted) {
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginScreen()),
                  (route) => false,
                );
              }
            }
          },
        ),
      ],
    );
  }
}
