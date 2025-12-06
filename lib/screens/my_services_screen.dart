import 'package:flutter/material.dart';
import 'package:agro_boost/core/constants/app_colors.dart';
import 'package:agro_boost/core/constants/app_styles.dart';
import 'package:agro_boost/screens/chat_screen.dart';

class MyServicesScreen extends StatefulWidget {
  const MyServicesScreen({Key? key}) : super(key: key);

  @override
  State<MyServicesScreen> createState() => _MyServicesScreenState();
}

class _MyServicesScreenState extends State<MyServicesScreen>
    with TickerProviderStateMixin {
  int _selectedTabIndex = 0;
  late AnimationController _slideController;

  final List<Booking> bookings = [
    Booking(
      id: '1',
      title: 'Tracteur',
      location: 'Kaolack',
      startDate: DateTime.now().add(const Duration(days: 2)),
      endDate: DateTime.now().add(const Duration(days: 4)),
      price: '15000',
      status: 'confirmed',
      providerName: 'Moussa Diop',
      image: 'assets/images/tractor.jpg',
      icon: '🚜',
    ),
    Booking(
      id: '2',
      title: 'Semoir',
      location: 'Tambacounda',
      startDate: DateTime.now().add(const Duration(days: 5)),
      endDate: DateTime.now().add(const Duration(days: 7)),
      price: '8000',
      status: 'pending',
      providerName: 'Aminata Sow',
      image: 'assets/images/seeder.jpg',
      icon: '🌾',
    ),
    Booking(
      id: '3',
      title: 'Opérateur',
      location: 'Thiès',
      startDate: DateTime.now().subtract(const Duration(days: 3)),
      endDate: DateTime.now().subtract(const Duration(days: 1)),
      price: '5000',
      status: 'completed',
      providerName: 'Ibrahim Ndiaye',
      image: 'assets/images/operator.jpg',
      icon: '👨‍🌾',
    ),
    Booking(
      id: '4',
      title: 'Pulvérisateur',
      location: 'Dakar',
      startDate: DateTime.now().subtract(const Duration(days: 10)),
      endDate: DateTime.now().subtract(const Duration(days: 8)),
      price: '3500',
      status: 'cancelled',
      providerName: 'Fatou Ba',
      image: 'assets/images/sprayer.jpg',
      icon: '💨',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    )..forward();
  }

  @override
  void dispose() {
    _slideController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.veryLightGrey,
      appBar: _buildAppBar(),
      body: Column(
        children: [
          _buildTabBar(),
          Expanded(
            child: _buildTabContent(),
          ),
        ],
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      backgroundColor: AppColors.primary,
      elevation: 0,
      title: Text(
        '📦 Mes Services',
        style: AppStyles.headingMedium.copyWith(
          color: Colors.white,
          fontSize: 18,
        ),
      ),
      centerTitle: true,
      actions: [
        IconButton(
          icon: const Icon(Icons.notifications_outlined),
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Pas de nouvelles notifications'),
                duration: Duration(seconds: 1),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildTabBar() {
    final tabs = [
      {'label': '⏳ En cours', 'value': 'confirmed'},
      {'label': '⏱️ En attente', 'value': 'pending'},
      {'label': '✅ Complétées', 'value': 'completed'},
      {'label': '❌ Annulées', 'value': 'cancelled'},
    ];

    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: List.generate(tabs.length, (index) {
            bool isSelected = _selectedTabIndex == index;
            return GestureDetector(
              onTap: () {
                setState(() => _selectedTabIndex = index);
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                margin: const EdgeInsets.symmetric(horizontal: 6),
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: isSelected
                      ? AppColors.primary.withOpacity(0.1)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isSelected ? AppColors.primary : AppColors.border,
                    width: 1.5,
                  ),
                ),
                child: Text(
                  tabs[index]['label']!,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    color: isSelected ? AppColors.primary : AppColors.grey,
                  ),
                ),
              ),
            );
          }),
        ),
      ),
    );
  }

  Widget _buildTabContent() {
    List<Booking> filteredBookings;

    switch (_selectedTabIndex) {
      case 0:
        filteredBookings =
            bookings.where((b) => b.status == 'confirmed').toList();
        break;
      case 1:
        filteredBookings =
            bookings.where((b) => b.status == 'pending').toList();
        break;
      case 2:
        filteredBookings =
            bookings.where((b) => b.status == 'completed').toList();
        break;
      case 3:
        filteredBookings =
            bookings.where((b) => b.status == 'cancelled').toList();
        break;
      default:
        filteredBookings = bookings;
    }

    if (filteredBookings.isEmpty) {
      return _buildEmptyState();
    }

    return SlideTransition(
      position: Tween<Offset>(
        begin: const Offset(1, 0),
        end: Offset.zero,
      ).animate(CurvedAnimation(parent: _slideController, curve: Curves.easeOut)),
      child: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: filteredBookings.length,
        itemBuilder: (context, index) {
          return _buildBookingCard(filteredBookings[index]);
        },
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            '📭',
            style: TextStyle(fontSize: 60),
          ),
          const SizedBox(height: 16),
          Text(
            'Aucune réservation',
            style: AppStyles.headingSmall.copyWith(
              color: AppColors.grey,
              fontSize: 18,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Faites votre première réservation',
            style: AppStyles.bodyMedium.copyWith(
              color: AppColors.grey,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBookingCard(Booking booking) {
    Color statusColor = _getStatusColor(booking.status);
    String statusEmoji = _getStatusEmoji(booking.status);

    return GestureDetector(
      onTap: () {
        _showDetailsDialog(booking);
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            children: [
              // En-tête
              Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Center(
                      child: Text(
                        booking.icon,
                        style: const TextStyle(fontSize: 32),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          booking.title,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(
                              Icons.location_on,
                              size: 12,
                              color: AppColors.grey,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              booking.location,
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.grey,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: statusColor,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      statusEmoji,
                      style: const TextStyle(fontSize: 16),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              // Dates
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: AppColors.lightGrey,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '📅 ${_formatDate(booking.startDate)}',
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '➜',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.grey,
                      ),
                    ),
                    Text(
                      '${_formatDate(booking.endDate)}',
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              // Boutons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      icon: const Icon(Icons.chat_bubble_outline, size: 14),
                      label: const Text('Chat'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        side: const BorderSide(
                          color: AppColors.secondary,
                          width: 1.5,
                        ),
                      ),
                        // Dans le bouton Chat
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => ChatScreen(
                                providerName: booking.providerName,
                                providerEmoji: booking.icon,
                              ),
                            ),
                          );
                        }
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.info_outline, size: 14),
                      label: const Text('Détails'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(vertical: 8),
                      ),
                      onPressed: () {
                        _showDetailsDialog(booking);
                      },
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

  void _showDetailsDialog(Booking booking) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'ℹ️ Détails',
                  style: AppStyles.headingSmall.copyWith(fontSize: 18),
                ),
                const SizedBox(height: 16),
                _buildDetailRow('Service', booking.title),
                _buildDetailRow('Prestataire', booking.providerName),
                _buildDetailRow('Localisation', booking.location),
                _buildDetailRow('Du', _formatDate(booking.startDate)),
                _buildDetailRow('Au', _formatDate(booking.endDate)),
                _buildDetailRow('Prix', '${booking.price} FCFA'),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Fermer'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: AppColors.grey,
              fontSize: 12,
            ),
          ),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
    );
  }

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

  String _getStatusEmoji(String status) {
    switch (status) {
      case 'confirmed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'completed':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}

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
  final String icon;

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
    required this.icon,
  });
}