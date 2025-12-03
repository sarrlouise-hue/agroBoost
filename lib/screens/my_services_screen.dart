import 'package:flutter/material.dart';
import 'package:agro_boost/core/constants/app_colors.dart';
import 'package:agro_boost/core/constants/app_styles.dart';

class MyServicesScreen extends StatefulWidget {
  const MyServicesScreen({Key? key}) : super(key: key);

  @override
  State<MyServicesScreen> createState() => _MyServicesScreenState();
}

class _MyServicesScreenState extends State<MyServicesScreen> {
  int _selectedTabIndex = 0;

  // Réservations de l'utilisateur
  final List<Booking> bookings = [
    Booking(
      id: '1',
      title: 'Tracteur MASSEY FERGUSON',
      location: 'Kaolack, Sénégal',
      startDate: DateTime.now().add(const Duration(days: 2)),
      endDate: DateTime.now().add(const Duration(days: 4)),
      price: '15 000',
      status: 'confirmed',
      providerName: 'Moussa Diop',
      image: 'assets/images/tractor.jpg',
    ),
    Booking(
      id: '2',
      title: 'Semoir mécanique JOHN DEERE',
      location: 'Tambacounda',
      startDate: DateTime.now().add(const Duration(days: 5)),
      endDate: DateTime.now().add(const Duration(days: 7)),
      price: '8 000',
      status: 'pending',
      providerName: 'Aminata Sow',
      image: 'assets/images/seeder.jpg',
    ),
    Booking(
      id: '3',
      title: 'Opérateur agricole expérimenté',
      location: 'Thiès',
      startDate: DateTime.now().subtract(const Duration(days: 3)),
      endDate: DateTime.now().subtract(const Duration(days: 1)),
      price: '5 000',
      status: 'completed',
      providerName: 'Ibrahim Ndiaye',
      image: 'assets/images/operator.jpg',
    ),
    Booking(
      id: '4',
      title: 'Pulvérisateur agricole STIHL',
      location: 'Dakar',
      startDate: DateTime.now().subtract(const Duration(days: 10)),
      endDate: DateTime.now().subtract(const Duration(days: 8)),
      price: '3 500',
      status: 'cancelled',
      providerName: 'Fatou Ba',
      image: 'assets/images/sprayer.jpg',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.veryLightGrey,
      appBar: _buildAppBar(),
      body: Column(
        children: [
          // =========================================
          // 1️⃣ ONGLETS
          // =========================================
          _buildTabBar(),

          // =========================================
          // 2️⃣ CONTENU
          // =========================================
          Expanded(
            child: _buildTabContent(),
          ),
        ],
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
        'Mes Services',
        style: AppStyles.headingMedium.copyWith(
          color: Colors.white,
          fontSize: 20,
        ),
      ),
      centerTitle: true,
      actions: [
        IconButton(
          icon: const Icon(Icons.notifications_outlined),
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Pas de nouvelles notifications')),
            );
          },
        ),
      ],
    );
  }

  // =========================================
  // 🔷 ONGLETS
  // =========================================
  Widget _buildTabBar() {
    final tabs = [
      {'label': 'En cours', 'count': 1, 'icon': Icons.schedule},
      {'label': 'En attente', 'count': 1, 'icon': Icons.pending_actions},
      {'label': 'Complétées', 'count': 1, 'icon': Icons.check_circle},
      {'label': 'Annulées', 'count': 1, 'icon': Icons.cancel},
    ];

    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: AppStyles.spacing8),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: List.generate(tabs.length, (index) {
            bool isSelected = _selectedTabIndex == index;
            return GestureDetector(
              onTap: () {
                setState(() => _selectedTabIndex = index);
              },
              child: Container(
                margin: const EdgeInsets.symmetric(
                  horizontal: AppStyles.spacing8,
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: AppStyles.spacing12,
                  vertical: AppStyles.spacing8,
                ),
                decoration: BoxDecoration(
                  color: isSelected
                      ? AppColors.primary.withOpacity(0.1)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isSelected ? AppColors.primary : AppColors.border,
                    width: 1.5,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      tabs[index]['icon'] as IconData,
                      size: 16,
                      color: isSelected
                          ? AppColors.primary
                          : AppColors.grey,
                    ),
                    const SizedBox(width: AppStyles.spacing6),
                    Text(
                      tabs[index]['label'] as String,
                      style: AppStyles.labelSmall.copyWith(
                        color: isSelected
                            ? AppColors.primary
                            : AppColors.grey,
                        fontWeight: isSelected
                            ? FontWeight.bold
                            : FontWeight.normal,
                      ),
                    ),
                    const SizedBox(width: AppStyles.spacing6),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppStyles.spacing6,
                        vertical: AppStyles.spacing2,
                      ),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppColors.primary
                            : AppColors.grey,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        '${tabs[index]['count']}',
                        style: AppStyles.caption.copyWith(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ),
      ),
    );
  }

  // =========================================
  // 🔷 CONTENU DES ONGLETS
  // =========================================
  Widget _buildTabContent() {
    List<Booking> filteredBookings;

    switch (_selectedTabIndex) {
      case 0: // En cours
        filteredBookings =
            bookings.where((b) => b.status == 'confirmed').toList();
        break;
      case 1: // En attente
        filteredBookings =
            bookings.where((b) => b.status == 'pending').toList();
        break;
      case 2: // Complétées
        filteredBookings =
            bookings.where((b) => b.status == 'completed').toList();
        break;
      case 3: // Annulées
        filteredBookings =
            bookings.where((b) => b.status == 'cancelled').toList();
        break;
      default:
        filteredBookings = bookings;
    }

    if (filteredBookings.isEmpty) {
      return _buildEmptyState();
    }

    return ListView.builder(
      padding: const EdgeInsets.all(AppStyles.spacing16),
      itemCount: filteredBookings.length,
      itemBuilder: (context, index) {
        return _buildBookingCard(filteredBookings[index]);
      },
    );
  }

  // =========================================
  // 🔷 CARTE DE RÉSERVATION
  // =========================================
  Widget _buildBookingCard(Booking booking) {
    Color statusColor = _getStatusColor(booking.status);
    String statusLabel = _getStatusLabel(booking.status);

    return Container(
      margin: const EdgeInsets.only(bottom: AppStyles.spacing16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppStyles.radiusMedium),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          // ===== IMAGE + BADGE =====
          Stack(
            children: [
              Container(
                height: 140,
                decoration: BoxDecoration(
                  color: AppColors.secondary.withOpacity(0.1),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(AppStyles.radiusMedium),
                    topRight: Radius.circular(AppStyles.radiusMedium),
                  ),
                ),
                child: const Center(
                  child: Icon(
                    Icons.image_not_supported,
                    color: AppColors.grey,
                    size: 50,
                  ),
                ),
              ),
              Positioned(
                top: AppStyles.spacing12,
                right: AppStyles.spacing12,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppStyles.spacing12,
                    vertical: AppStyles.spacing6,
                  ),
                  decoration: BoxDecoration(
                    color: statusColor,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    statusLabel,
                    style: AppStyles.labelSmall.copyWith(
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),

          // ===== CONTENU =====
          Padding(
            padding: const EdgeInsets.all(AppStyles.spacing16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Titre
                Text(
                  booking.title,
                  style: AppStyles.bodyLarge.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: AppStyles.spacing8),

                // Prestataire
                Row(
                  children: [
                    const Icon(
                      Icons.person_outline,
                      size: 16,
                      color: AppColors.grey,
                    ),
                    const SizedBox(width: AppStyles.spacing6),
                    Text(
                      booking.providerName,
                      style: AppStyles.bodySmall,
                    ),
                  ],
                ),
                const SizedBox(height: AppStyles.spacing6),

                // Localisation
                Row(
                  children: [
                    const Icon(
                      Icons.location_on_outlined,
                      size: 16,
                      color: AppColors.grey,
                    ),
                    const SizedBox(width: AppStyles.spacing6),
                    Expanded(
                      child: Text(
                        booking.location,
                        style: AppStyles.bodySmall,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppStyles.spacing12),

                // Dates
                Container(
                  padding: const EdgeInsets.all(AppStyles.spacing12),
                  decoration: BoxDecoration(
                    color: AppColors.lightGrey,
                    borderRadius:
                    BorderRadius.circular(AppStyles.radiusMedium),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(
                            Icons.calendar_today_outlined,
                            size: 14,
                            color: AppColors.grey,
                          ),
                          const SizedBox(width: AppStyles.spacing8),
                          Expanded(
                            child: Text(
                              _formatDate(booking.startDate),
                              style: AppStyles.bodySmall,
                            ),
                          ),
                          const Icon(Icons.arrow_forward,
                              size: 14, color: AppColors.grey),
                          const SizedBox(width: AppStyles.spacing8),
                          Expanded(
                            child: Text(
                              _formatDate(booking.endDate),
                              style: AppStyles.bodySmall,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppStyles.spacing12),

                // Prix + Boutons
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Total',
                          style: AppStyles.caption,
                        ),
                        Text(
                          '${booking.price} FCFA',
                          style: AppStyles.bodyLarge.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    _buildActionButtons(booking),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(Booking booking) {
    return Row(
      children: [
        if (booking.status == 'confirmed' || booking.status == 'pending')
          ElevatedButton.icon(
            icon: const Icon(Icons.cancel_outlined, size: 16),
            label: const Text('Annuler'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error.withOpacity(0.2),
              foregroundColor: AppColors.error,
              padding: const EdgeInsets.symmetric(
                horizontal: AppStyles.spacing12,
                vertical: AppStyles.spacing8,
              ),
            ),
            onPressed: () {
              _showCancelDialog(booking);
            },
          ),
        if (booking.status == 'completed')
          ElevatedButton.icon(
            icon: const Icon(Icons.star_outline, size: 16),
            label: const Text('Évaluer'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.secondary.withOpacity(0.2),
              foregroundColor: AppColors.secondary,
              padding: const EdgeInsets.symmetric(
                horizontal: AppStyles.spacing12,
                vertical: AppStyles.spacing8,
              ),
            ),
            onPressed: () {
              _showRatingDialog(booking);
            },
          ),
        const SizedBox(width: AppStyles.spacing8),
        ElevatedButton.icon(
          icon: const Icon(Icons.info_outline, size: 16),
          label: const Text('Détails'),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(
              horizontal: AppStyles.spacing12,
              vertical: AppStyles.spacing8,
            ),
          ),
          onPressed: () {
            _showDetailsDialog(booking);
          },
        ),
      ],
    );
  }

  // =========================================
  // 🔷 ÉTAT VIDE
  // =========================================
  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.shopping_bag_outlined,
            size: 80,
            color: AppColors.grey.withOpacity(0.5),
          ),
          const SizedBox(height: AppStyles.spacing16),
          Text(
            'Aucune réservation',
            style: AppStyles.headingSmall.copyWith(
              color: AppColors.grey,
            ),
          ),
          const SizedBox(height: AppStyles.spacing8),
          Text(
            'Vous n\'avez pas de réservation pour cette catégorie',
            style: AppStyles.bodyMedium.copyWith(
              color: AppColors.grey,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppStyles.spacing24),
          ElevatedButton.icon(
            icon: const Icon(Icons.add),
            label: const Text('Faire une réservation'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
            ),
            onPressed: () {
              // Naviguer vers accueil
            },
          ),
        ],
      ),
    );
  }

  // =========================================
  // 🔷 DIALOGUES
  // =========================================
  void _showCancelDialog(Booking booking) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Annuler la réservation?'),
        content: Text(
          'Êtes-vous sûr de vouloir annuler "${booking.title}"?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Non'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Réservation annulée'),
                  backgroundColor: AppColors.success,
                ),
              );
            },
            child: const Text('Oui, annuler'),
          ),
        ],
      ),
    );
  }

  void _showRatingDialog(Booking booking) {
    int rating = 5;
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Évaluer le service'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(5, (index) {
                return IconButton(
                  icon: Icon(
                    index < rating ? Icons.star : Icons.star_outline,
                    color: Colors.amber,
                    size: 32,
                  ),
                  onPressed: () {
                    rating = index + 1;
                  },
                );
              }),
            ),
            const SizedBox(height: AppStyles.spacing16),
            TextField(
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'Partager votre avis...',
                border: OutlineInputBorder(
                  borderRadius:
                  BorderRadius.circular(AppStyles.radiusMedium),
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
                  content: Text('Avis publié'),
                  backgroundColor: AppColors.success,
                ),
              );
            },
            child: const Text('Publier'),
          ),
        ],
      ),
    );
  }

  void _showDetailsDialog(Booking booking) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Détails de la réservation'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDetailRow('Service', booking.title),
            _buildDetailRow('Prestataire', booking.providerName),
            _buildDetailRow('Localisation', booking.location),
            _buildDetailRow('Du', _formatDate(booking.startDate)),
            _buildDetailRow('Au', _formatDate(booking.endDate)),
            _buildDetailRow('Prix', '${booking.price} FCFA'),
            _buildDetailRow('Statut', booking.title),
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

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppStyles.spacing8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: AppStyles.bodySmall.copyWith(
              color: AppColors.grey,
            ),
          ),
          Expanded(
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: AppStyles.bodySmall.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // =========================================
  // 🔷 UTILITAIRES
  // =========================================
  Color _getStatusColor(String status) {
    switch (status) {
      case 'confirmed':
        return AppColors.success;
      case 'pending':
        return AppColors.warning;
      case 'completed':
        return AppColors.primary;
      case 'cancelled':
        return AppColors.error;
      default:
        return AppColors.grey;
    }
  }

  String _getStatusLabel(String status) {
    switch (status) {
      case 'confirmed':
        return '✓ Confirmée';
      case 'pending':
        return '⏳ En attente';
      case 'completed':
        return '✓ Complétée';
      case 'cancelled':
        return '✗ Annulée';
      default:
        return status;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}

// =========================================
// 🔷 MODÈLE RÉSERVATION
// =========================================
class Booking {
  final String id;
  final String title;
  final String location;
  final DateTime startDate;
  final DateTime endDate;
  final String price;
  final String status;
  final String providerName;
  final String image;

  Booking({
    required this.id,
    required this.title,
    required this.location,
    required this.startDate,
    required this.endDate,
    required this.price,
    required this.status,
    required this.providerName,
    required this.image,
  });
}