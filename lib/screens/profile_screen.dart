import 'package:flutter/material.dart';
import 'package:agro_boost/core/constants/app_colors.dart';
import 'package:agro_boost/core/constants/app_styles.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isEditing = false;

  // Données utilisateur
  final user = UserProfile(
    id: '1',
    firstName: 'Amadou',
    lastName: 'Sow',
    email: 'amadou.sow@example.com',
    phone: '+221 77 123 45 67',
    userType: 'farmer',
    location: 'Kaolack, Sénégal',
    profileImage: 'assets/images/profile.jpg',
    totalBookings: 12,
    totalSpent: '450 000',
    rating: 4.8,
    reviews: 24,
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.veryLightGrey,
      appBar: _buildAppBar(),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // =========================================
            // 1️⃣ EN-TÊTE PROFIL
            // =========================================
            _buildProfileHeader(),

            // =========================================
            // 2️⃣ STATISTIQUES
            // =========================================
            _buildStatistics(),

            // =========================================
            // 3️⃣ FORMULAIRE ÉDITION
            // =========================================
            if (_isEditing) _buildEditForm(),

            // =========================================
            // 4️⃣ MENU PARAMÈTRES
            // =========================================
            _buildSettingsMenu(),

            // Espace final
            const SizedBox(height: AppStyles.spacing24),
          ],
        ),
      ),
    );
  }

  // =========================================
  // 🔷 APP BAR
  // =========================================
  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      backgroundColor: AppColors.primary,
      elevation: 0,
      title: Text(
        'Mon Profil',
        style: AppStyles.headingMedium.copyWith(
          color: Colors.white,
          fontSize: 20,
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
    );
  }

  // =========================================
  // 🔷 EN-TÊTE PROFIL
  // =========================================
  Widget _buildProfileHeader() {
    return Container(
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(20),
          bottomRight: Radius.circular(20),
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppStyles.spacing20,
            vertical: AppStyles.spacing24,
          ),
          child: Column(
            children: [
              // Photo de profil
              Stack(
                children: [
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(50),
                      border: Border.all(
                        color: Colors.white.withOpacity(0.5),
                        width: 3,
                      ),
                    ),
                    child: const Icon(
                      Icons.person,
                      size: 50,
                      color: Colors.white,
                    ),
                  ),
                  if (_isEditing)
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        decoration: BoxDecoration(
                          color: AppColors.secondary,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: Colors.white,
                            width: 2,
                          ),
                        ),
                        child: IconButton(
                          icon: const Icon(
                            Icons.camera_alt_outlined,
                            color: Colors.white,
                            size: 20,
                          ),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Prendre une photo...'),
                              ),
                            );
                          },
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: AppStyles.spacing16),

              // Nom
              Text(
                '${user.firstName} ${user.lastName}',
                style: AppStyles.headingSmall.copyWith(
                  color: Colors.white,
                  fontSize: 22,
                ),
              ),
              const SizedBox(height: AppStyles.spacing4),

              // Type d'utilisateur
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppStyles.spacing12,
                  vertical: AppStyles.spacing6,
                ),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: Colors.white.withOpacity(0.3),
                  ),
                ),
                child: Text(
                  user.userType == 'farmer'
                      ? '👨‍🌾 Agriculteur'
                      : '👨‍💼 Prestataire',
                  style: AppStyles.labelSmall.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(height: AppStyles.spacing12),

              // Email
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.email_outlined,
                    color: Colors.white70,
                    size: 16,
                  ),
                  const SizedBox(width: AppStyles.spacing6),
                  Text(
                    user.email,
                    style: AppStyles.bodySmall.copyWith(
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppStyles.spacing8),

              // Localisation
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.location_on_outlined,
                    color: Colors.white70,
                    size: 16,
                  ),
                  const SizedBox(width: AppStyles.spacing6),
                  Text(
                    user.location,
                    style: AppStyles.bodySmall.copyWith(
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // =========================================
  // 🔷 STATISTIQUES
  // =========================================
  Widget _buildStatistics() {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppStyles.spacing16,
        vertical: AppStyles.spacing20,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStatCard(
            icon: Icons.shopping_bag_outlined,
            label: 'Réservations',
            value: user.totalBookings.toString(),
          ),
          _buildStatCard(
            icon: Icons.payment_outlined,
            label: 'Dépensé',
            value: '${user.totalSpent} FCFA',
          ),
          _buildStatCard(
            icon: Icons.star_outlined,
            label: 'Rating',
            value: '${user.rating}',
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Container(
      padding: const EdgeInsets.all(AppStyles.spacing16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppStyles.radiusMedium),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 8,
          ),
        ],
      ),
      child: Column(
        children: [
          Icon(
            icon,
            color: AppColors.primary,
            size: 28,
          ),
          const SizedBox(height: AppStyles.spacing8),
          Text(
            value,
            style: AppStyles.bodyLarge.copyWith(
              fontWeight: FontWeight.bold,
              color: AppColors.primary,
            ),
          ),
          const SizedBox(height: AppStyles.spacing4),
          Text(
            label,
            style: AppStyles.caption,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  // =========================================
  // 🔷 FORMULAIRE D'ÉDITION
  // =========================================
  Widget _buildEditForm() {
    return Container(
      margin: const EdgeInsets.symmetric(
        horizontal: AppStyles.spacing16,
        vertical: AppStyles.spacing16,
      ),
      padding: const EdgeInsets.all(AppStyles.spacing16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppStyles.radiusMedium),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 8,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Éditer votre profil',
            style: AppStyles.bodyLarge.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: AppStyles.spacing16),

          // Prénom
          _buildTextField(
            label: 'Prénom',
            initialValue: user.firstName,
          ),
          const SizedBox(height: AppStyles.spacing12),

          // Nom
          _buildTextField(
            label: 'Nom',
            initialValue: user.lastName,
          ),
          const SizedBox(height: AppStyles.spacing12),

          // Email
          _buildTextField(
            label: 'Email',
            initialValue: user.email,
            enabled: false,
          ),
          const SizedBox(height: AppStyles.spacing12),

          // Téléphone
          _buildTextField(
            label: 'Téléphone',
            initialValue: user.phone,
          ),
          const SizedBox(height: AppStyles.spacing12),

          // Localisation
          _buildTextField(
            label: 'Localisation',
            initialValue: user.location,
          ),
          const SizedBox(height: AppStyles.spacing16),

          // Boutons
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () {
                    setState(() => _isEditing = false);
                  },
                  child: const Text('Annuler'),
                ),
              ),
              const SizedBox(width: AppStyles.spacing12),
              Expanded(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                  ),
                  onPressed: () {
                    setState(() => _isEditing = false);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Profil mis à jour'),
                        backgroundColor: AppColors.success,
                      ),
                    );
                  },
                  child: const Text('Enregistrer'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required String label,
    required String initialValue,
    bool enabled = true,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: AppStyles.labelSmall,
        ),
        const SizedBox(height: AppStyles.spacing6),
        TextField(
          controller: TextEditingController(text: initialValue),
          enabled: enabled,
          decoration: InputDecoration(
            hintText: label,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppStyles.radiusMedium),
            ),
            filled: true,
            fillColor: enabled
                ? Colors.white
                : AppColors.lightGrey,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: AppStyles.spacing12,
              vertical: AppStyles.spacing10,
            ),
          ),
        ),
      ],
    );
  }

  // =========================================
  // 🔷 MENU PARAMÈTRES
  // =========================================
  Widget _buildSettingsMenu() {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppStyles.spacing16,
        vertical: AppStyles.spacing16,
      ),
      child: Column(
        children: [
          // Section Compte
          _buildMenuSection(
            title: 'COMPTE',
            items: [
              MenuItem(
                icon: Icons.lock_outlined,
                label: 'Changer le mot de passe',
                onTap: () => _showPasswordDialog(),
              ),
              MenuItem(
                icon: Icons.notifications_outlined,
                label: 'Notifications',
                onTap: () => _showNotificationSettings(),
              ),
              MenuItem(
                icon: Icons.language_outlined,
                label: 'Langue',
                onTap: () => _showLanguageSettings(),
              ),
            ],
          ),
          const SizedBox(height: AppStyles.spacing16),

          // Section Infos
          _buildMenuSection(
            title: 'INFORMATIONS',
            items: [
              MenuItem(
                icon: Icons.info_outlined,
                label: 'À propos de AGRO BOOST',
                onTap: () => _showAboutDialog(),
              ),
              MenuItem(
                icon: Icons.description_outlined,
                label: 'Conditions d\'utilisation',
                onTap: () => _showTermsDialog(),
              ),
              MenuItem(
                icon: Icons.privacy_tip_outlined,
                label: 'Politique de confidentialité',
                onTap: () => _showPrivacyDialog(),
              ),
            ],
          ),
          const SizedBox(height: AppStyles.spacing16),

          // Bouton Déconnexion
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              icon: const Icon(Icons.logout_outlined),
              label: const Text('Se déconnecter'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.error,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  vertical: AppStyles.spacing12,
                ),
              ),
              onPressed: () {
                _showLogoutDialog();
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuSection({
    required String title,
    required List<MenuItem> items,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppStyles.radiusMedium),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 8,
          ),
        ],
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(AppStyles.spacing12),
            child: Text(
              title,
              style: AppStyles.labelSmall.copyWith(
                color: AppColors.grey,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          ...List.generate(items.length, (index) {
            return Column(
              children: [
                ListTile(
                  leading: Icon(
                    items[index].icon,
                    color: AppColors.primary,
                  ),
                  title: Text(
                    items[index].label,
                    style: AppStyles.bodyMedium,
                  ),
                  trailing: const Icon(
                    Icons.arrow_forward_ios,
                    size: 16,
                    color: AppColors.grey,
                  ),
                  onTap: items[index].onTap,
                ),
                if (index < items.length - 1)
                  Divider(
                    height: 1,
                    color: AppColors.border,
                  ),
              ],
            );
          }),
        ],
      ),
    );
  }

  // =========================================
  // 🔷 DIALOGUES
  // =========================================
  void _showPasswordDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Changer le mot de passe'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              obscureText: true,
              decoration: InputDecoration(
                labelText: 'Ancien mot de passe',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
            const SizedBox(height: AppStyles.spacing12),
            TextField(
              obscureText: true,
              decoration: InputDecoration(
                labelText: 'Nouveau mot de passe',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
            const SizedBox(height: AppStyles.spacing12),
            TextField(
              obscureText: true,
              decoration: InputDecoration(
                labelText: 'Confirmer',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Mot de passe changé'),
                  backgroundColor: AppColors.success,
                ),
              );
            },
            child: const Text('Enregistrer'),
          ),
        ],
      ),
    );
  }

  void _showNotificationSettings() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Notifications'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CheckboxListTile(
              value: true,
              onChanged: (value) {},
              title: const Text('Notifications par email'),
            ),
            CheckboxListTile(
              value: true,
              onChanged: (value) {},
              title: const Text('Notifications par SMS'),
            ),
            CheckboxListTile(
              value: false,
              onChanged: (value) {},
              title: const Text('Notifications push'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }

  void _showLanguageSettings() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Langue'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            RadioListTile(
              value: 'fr',
              groupValue: 'fr',
              onChanged: (value) {},
              title: const Text('🇫🇷 Français'),
            ),
            RadioListTile(
              value: 'wo',
              groupValue: 'fr',
              onChanged: (value) {},
              title: const Text('🇸🇳 Wolof'),
            ),
            RadioListTile(
              value: 'en',
              groupValue: 'fr',
              onChanged: (value) {},
              title: const Text('🇬🇧 English'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }

  void _showAboutDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('À propos'),
        content: Text(
          'AGRO BOOST v1.0.0\n\n'
              'Application de réservation de services agricoles au Sénégal.\n\n'
              '© 2024 AGRO BOOST. Tous droits réservés.',
          style: AppStyles.bodyMedium,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }

  void _showTermsDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Conditions d\'utilisation'),
        content: SingleChildScrollView(
          child: Text(
            'Lorem ipsum dolor sit amet...\n\n'
                '1. Utilisation du service\n'
                '2. Responsabilités de l\'utilisateur\n'
                '3. Propriété intellectuelle\n'
                '4. Limitations de responsabilité\n'
                '5. Modifications des conditions',
            style: AppStyles.bodySmall,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }

  void _showPrivacyDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Politique de confidentialité'),
        content: SingleChildScrollView(
          child: Text(
            'Vos données personnelles sont protégées...\n\n'
                '1. Données collectées\n'
                '2. Utilisation des données\n'
                '3. Protection des données\n'
                '4. Cookies\n'
                '5. Vos droits',
            style: AppStyles.bodySmall,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }

  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Se déconnecter?'),
        content: const Text('Êtes-vous sûr de vouloir vous déconnecter?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Non'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // TODO: Implémenter la déconnexion
              // Navigator.pushReplacementNamed(context, '/login');
            },
            child: const Text('Oui, déconnecter'),
          ),
        ],
      ),
    );
  }
}

// =========================================
// 🔷 MODÈLES
// =========================================
class UserProfile {
  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final String phone;
  final String userType;
  final String location;
  final String profileImage;
  final int totalBookings;
  final String totalSpent;
  final double rating;
  final int reviews;

  UserProfile({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.phone,
    required this.userType,
    required this.location,
    required this.profileImage,
    required this.totalBookings,
    required this.totalSpent,
    required this.rating,
    required this.reviews,
  });
}

class MenuItem {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  MenuItem({
    required this.icon,
    required this.label,
    required this.onTap,
  });
}