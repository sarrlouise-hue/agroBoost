// ===== PROFILE SCREEN (Modifiée) =====
import 'package:flutter/material.dart';
import 'package:agro_boost/core/constants/app_colors.dart';
import 'package:agro_boost/core/constants/app_styles.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> with TickerProviderStateMixin {
  bool _isEditing = false;
  late AnimationController _scaleController;

  @override
  void initState() {
    super.initState();
    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    )..forward();
  }

  @override
  void dispose() {
    _scaleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.veryLightGrey,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        elevation: 0,
        title: Text(
          '👤 Mon Profil',
          style: AppStyles.headingMedium.copyWith(
            color: Colors.white,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: Icon(
              _isEditing ? Icons.close : Icons.edit_outlined,
              color: Colors.white,
            ),
            onPressed: () {
              setState(() => _isEditing = !_isEditing);
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildProfileHeader(),
            const SizedBox(height: 10),
            _buildMenu(),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader() {
    return ScaleTransition(
      scale: Tween<double>(begin: 0.8, end: 1).animate(
        CurvedAnimation(parent: _scaleController, curve: Curves.easeOut),
      ),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: const BorderRadius.only(
            bottomLeft: Radius.circular(24),
            bottomRight: Radius.circular(24),
          ),
        ),
        padding: const EdgeInsets.symmetric(vertical: 30),
        child: Column(
          children: [
            const Icon(
              Icons.person,
              size: 80,
              color: Colors.black,
            ),
            const SizedBox(height: 16),
            const Text(
              '👨‍🌾 Agriculteur',
              style: TextStyle(
                color: Colors.black,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenu() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '⚙️ Paramètres',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          _buildMenuItem(Icons.lock_outline, 'Mot de passe', () {
            Navigator.push(context, MaterialPageRoute(
              builder: (context) => const ChangePasswordScreen(),
            ));
          }),
          _buildMenuItem(Icons.notifications_none, 'Notifications', () {
            Navigator.push(context, MaterialPageRoute(
              builder: (context) => const NotificationsScreen(),
            ));
          }),
          _buildMenuItem(Icons.language, 'Langue', () {
            Navigator.push(context, MaterialPageRoute(
              builder: (context) => const LanguageScreen(),
            ));
          }),
          const SizedBox(height: 16),
          const Text(
            'ℹ️ À Propos',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          _buildMenuItem(Icons.description_outlined, 'Conditions d\'utilisation', () {
            Navigator.push(context, MaterialPageRoute(
              builder: (context) => const TermsScreen(),
            ));
          }),
          _buildMenuItem(Icons.privacy_tip_outlined, 'Confidentialité', () {
            Navigator.push(context, MaterialPageRoute(
              builder: (context) => const PrivacyScreen(),
            ));
          }),
          _buildMenuItem(Icons.info_outline, 'Version 1.0.0', () {
            Navigator.push(context, MaterialPageRoute(
              builder: (context) => const VersionScreen(),
            ));
          }),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton.icon(
              icon: const Icon(Icons.logout),
              label: const Text('Se déconnecter'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.error,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    title: const Text('Déconnexion'),
                    content: const Text('Êtes-vous sûr ?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Non'),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.error,
                        ),
                        onPressed: () {
                          Navigator.pop(context);
                          Navigator.pushReplacementNamed(context, '/login');
                        },
                        child: const Text('Oui'),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuItem(IconData icon, String title, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
        margin: const EdgeInsets.only(bottom: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: AppColors.border,
            width: 1,
          ),
        ),
        child: Row(
          children: [
            Icon(icon, size: 20, color: AppColors.primary),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontWeight: FontWeight.w500,
                  fontSize: 13,
                ),
              ),
            ),
            const Icon(
              Icons.arrow_forward_ios,
              size: 14,
              color: AppColors.grey,
            ),
          ],
        ),
      ),
    );
  }
}

// ===== CHANGE PASSWORD SCREEN =====
class ChangePasswordScreen extends StatefulWidget {
  const ChangePasswordScreen({Key? key}) : super(key: key);

  @override
  State<ChangePasswordScreen> createState() => _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends State<ChangePasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _currentPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _showCurrentPassword = false;
  bool _showNewPassword = false;
  bool _showConfirmPassword = false;

  @override
  void dispose() {
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.veryLightGrey,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        elevation: 0,
        title: const Text(
          'Changer le mot de passe',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              const SizedBox(height: 20),
              _buildPasswordField(
                label: 'Mot de passe actuel',
                controller: _currentPasswordController,
                obscure: !_showCurrentPassword,
                onToggle: () {
                  setState(() => _showCurrentPassword = !_showCurrentPassword);
                },
              ),
              const SizedBox(height: 16),
              _buildPasswordField(
                label: 'Nouveau mot de passe',
                controller: _newPasswordController,
                obscure: !_showNewPassword,
                onToggle: () {
                  setState(() => _showNewPassword = !_showNewPassword);
                },
              ),
              const SizedBox(height: 16),
              _buildPasswordField(
                label: 'Confirmer le mot de passe',
                controller: _confirmPasswordController,
                obscure: !_showConfirmPassword,
                onToggle: () {
                  setState(() => _showConfirmPassword = !_showConfirmPassword);
                },
              ),
              const SizedBox(height: 30),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Mot de passe mis à jour')),
                      );
                      Navigator.pop(context);
                    }
                  },
                  child: const Text('Mettre à jour', style: TextStyle(color: Colors.white)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPasswordField({
    required String label,
    required TextEditingController controller,
    required bool obscure,
    required VoidCallback onToggle,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: obscure,
      decoration: InputDecoration(
        labelText: label,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        filled: true,
        fillColor: Colors.white,
        suffixIcon: IconButton(
          icon: Icon(obscure ? Icons.visibility_off : Icons.visibility),
          onPressed: onToggle,
        ),
      ),
      validator: (value) {
        if (value?.isEmpty ?? true) return 'Ce champ est requis';
        if (label.contains('Confirmer') &&
            value != _newPasswordController.text) {
          return 'Les mots de passe ne correspondent pas';
        }
        if (label.contains('Nouveau') && value!.length < 6) {
          return 'Minimum 6 caractères';
        }
        return null;
      },
    );
  }
}

// ===== NOTIFICATIONS SCREEN =====
class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({Key? key}) : super(key: key);

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  bool _emailNotifications = true;
  bool _pushNotifications = true;
  bool _smsNotifications = false;
  bool _weeklyDigest = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.veryLightGrey,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        elevation: 0,
        title: const Text(
          'Notifications',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const SizedBox(height: 10),
          _buildNotificationTile(
            'Notifications par email',
            'Recevoir les mises à jour par email',
            _emailNotifications,
                (value) => setState(() => _emailNotifications = value),
          ),
          _buildNotificationTile(
            'Notifications push',
            'Recevoir les alertes en temps réel',
            _pushNotifications,
                (value) => setState(() => _pushNotifications = value),
          ),
          _buildNotificationTile(
            'Notifications SMS',
            'Recevoir les alertes par SMS',
            _smsNotifications,
                (value) => setState(() => _smsNotifications = value),
          ),
          _buildNotificationTile(
            'Résumé hebdomadaire',
            'Recevoir un résumé de la semaine',
            _weeklyDigest,
                (value) => setState(() => _weeklyDigest = value),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationTile(
      String title,
      String subtitle,
      bool value,
      ValueChanged<bool> onChanged,
      ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: ListTile(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 12)),
        trailing: Switch(
          value: value,
          onChanged: onChanged,
          activeColor: AppColors.primary,
        ),
      ),
    );
  }
}

// ===== LANGUAGE SCREEN =====
class LanguageScreen extends StatefulWidget {
  const LanguageScreen({Key? key}) : super(key: key);

  @override
  State<LanguageScreen> createState() => _LanguageScreenState();
}

class _LanguageScreenState extends State<LanguageScreen> {
  String _selectedLanguage = 'fr';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.veryLightGrey,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        elevation: 0,
        title: const Text(
          'Langue',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const SizedBox(height: 10),
          _buildLanguageTile('Français', 'fr', '🇫🇷'),
          _buildLanguageTile('Wolof', 'wo', '🇸🇳'),
        ],
      ),
    );
  }

  Widget _buildLanguageTile(String name, String code, String flag) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: _selectedLanguage == code ? AppColors.primary : AppColors.border,
          width: _selectedLanguage == code ? 2 : 1,
        ),
      ),
      child: ListTile(
        leading: Text(flag, style: const TextStyle(fontSize: 24)),
        title: Text(name, style: const TextStyle(fontWeight: FontWeight.w600)),
        trailing: Radio<String>(
          value: code,
          groupValue: _selectedLanguage,
          onChanged: (value) {
            setState(() => _selectedLanguage = value!);
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Langue changée en $name')),
            );
          },
          activeColor: AppColors.primary,
        ),
        onTap: () {
          setState(() => _selectedLanguage = code);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Langue changée en $name')),
          );
        },
      ),
    );
  }
}

// ===== TERMS SCREEN =====
class TermsScreen extends StatelessWidget {
  const TermsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.veryLightGrey,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        elevation: 0,
        title: const Text(
          'Conditions d\'utilisation',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Conditions d\'utilisation',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 16),
                Text(
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n'
                      '1. Acceptation des conditions\n'
                      'En utilisant cette application, vous acceptez les présentes conditions.\n\n'
                      '2. Utilisation de l\'application\n'
                      'Vous acceptez d\'utiliser l\'application conformément à la loi et à ces conditions.\n\n'
                      '3. Propriété intellectuelle\n'
                      'Tout contenu de l\'application est protégé par les droits d\'auteur.\n\n'
                      '4. Limitation de responsabilité\n'
                      'L\'application est fournie "telle quelle" sans garantie.',
                  style: TextStyle(fontSize: 13, height: 1.6),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ===== PRIVACY SCREEN =====
class PrivacyScreen extends StatelessWidget {
  const PrivacyScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.veryLightGrey,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        elevation: 0,
        title: const Text(
          'Politique de Confidentialité',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Politique de Confidentialité',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 16),
                Text(
                  'Nous nous engageons à protéger votre vie privée.\n\n'
                      '1. Collecte de données\n'
                      'Nous collectons uniquement les données nécessaires pour fournir nos services.\n\n'
                      '2. Utilisation des données\n'
                      'Vos données sont utilisées pour améliorer nos services.\n\n'
                      '3. Partage des données\n'
                      'Vos données ne seront jamais partagées avec des tiers sans votre consentement.\n\n'
                      '4. Sécurité\n'
                      'Nous utilisons le chiffrement pour protéger vos données.',
                  style: TextStyle(fontSize: 13, height: 1.6),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ===== VERSION SCREEN =====
class VersionScreen extends StatelessWidget {
  const VersionScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.veryLightGrey,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        elevation: 0,
        title: const Text(
          'À propos',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Center(
        child: Container(
          margin: const EdgeInsets.all(16),
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.info_outline, size: 60, color: AppColors.primary),
              const SizedBox(height: 16),
              const Text(
                'AgroBoost',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'Version 1.0.0',
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
              const SizedBox(height: 24),
              const Text(
                'Application de gestion agricole développée pour les agriculteurs sénégalais.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13),
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.veryLightGrey,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Column(
                  children: [
                    Text(
                      'Droits d\'auteur © 2024',
                      style: TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Tous droits réservés',
                      style: TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}