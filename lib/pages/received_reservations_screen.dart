// ignore_for_file: unnecessary_cast, unused_field, use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:hallo/models/booking_model.dart';
import 'package:hallo/bookings_collection.dart';

class ReceivedReservationsScreen extends StatefulWidget {
    const ReceivedReservationsScreen({required this.language, super.key});

  final String language;

  @override
  State<ReceivedReservationsScreen> createState() {
    return _ReceivedReservationsScreenState();
  }
}

class _ReceivedReservationsScreenState
    extends State<ReceivedReservationsScreen> {
  String _selectedFilter = 'all';

  List<Map<String, dynamic>> get _filteredBookings {
    if (_selectedFilter == 'all') {
      return _receivedBookings;
    }
    return _receivedBookings
        .where((b) => b['status'] == _selectedFilter)
        .toList();
  }

  List<BookingModel> _receivedBookingsFromBackend = [];

  bool _isLoading = true;

  List<Map<String, dynamic>> get _receivedBookings {
    return _receivedBookingsFromBackend
        .map(
          (booking) => {
            'id': booking.id,
            'clientName': 'Client',
            'service': 'Service',
            'hectares': 0.0,
            'date': booking.bookingDate,
            'status': booking.status,
            'price': booking.totalPrice,
            'location': 'Localisation',
          },
        )
        .toList();
  }

  Widget _buildFilterChip(String value, String label, IconData icon) {
    final isSelected = _selectedFilter == value;
    return FilterChip(
      selected: isSelected,
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 18.0,
            color: isSelected
                ? Colors.white
                : Theme.of(context).colorScheme.onSurface,
          ),
          const SizedBox(width: 6.0),
          Text(label),
        ],
      ),
      onSelected: (selected) {
        setState(() {
          _selectedFilter = value;
        });
      },
      selectedColor: Theme.of(context).colorScheme.primary,
      labelStyle: TextStyle(
        color:
            isSelected ? Colors.white : Theme.of(context).colorScheme.onSurface,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
      ),
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String value,
    required String label,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24.0),
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
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isWolof = widget.language == 'wo';
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.surface,
        title: Text(isWolof ? 'Dëmande yi' : 'Demandes reçues'),
      ),
      body: Column(
        children: [
          Container(
            height: 60.0,
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              children: [
                _buildFilterChip(
                  'all',
                  isWolof ? 'Lépp' : 'Toutes',
                  Icons.list,
                ),
                const SizedBox(width: 8.0),
                _buildFilterChip(
                  'pending',
                  isWolof ? 'Dëmandé' : 'En attente',
                  Icons.pending_actions,
                ),
                const SizedBox(width: 8.0),
                _buildFilterChip(
                  'confirmed',
                  isWolof ? 'Konfirme' : 'Confirmées',
                  Icons.check_circle,
                ),
                const SizedBox(width: 8.0),
                _buildFilterChip(
                  'completed',
                  isWolof ? 'Jeexal' : 'Terminées',
                  Icons.task_alt,
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    icon: Icons.pending,
                    value: _receivedBookings
                        .where((b) => b['status'] == 'pending')
                        .length
                        .toString(),
                    label: isWolof ? 'En attente' : 'En attente',
                    color: Theme.of(context).colorScheme.primaryContainer,
                  ),
                ),
                const SizedBox(width: 12.0),
                Expanded(
                  child: _buildStatCard(
                    icon: Icons.check_circle,
                    value: _receivedBookings
                        .where((b) => b['status'] == 'confirmed')
                        .length
                        .toString(),
                    label: isWolof ? 'Confirmées' : 'Confirmées',
                    color: Theme.of(context).colorScheme.secondary,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: _filteredBookings.isEmpty
                ? Center(
                    child: Container(
                      padding: const EdgeInsets.all(32.0),
                      margin: const EdgeInsets.all(24.0),
                      decoration: BoxDecoration(
                        color: Theme.of(
                          context,
                        ).colorScheme.primaryContainer.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(20.0),
                        border: Border.all(
                          color: Theme.of(
                            context,
                          ).colorScheme.primary.withValues(alpha: 0.2),
                        ),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(20.0),
                            decoration: BoxDecoration(
                              color: Theme.of(
                                context,
                              ).colorScheme.primary.withValues(alpha: 0.15),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              Icons.inbox,
                              size: 64.0,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                          ),
                          const SizedBox(height: 24.0),
                          Text(
                            isWolof ? 'Amul dëmande' : 'Aucune demande',
                            style: Theme.of(context)
                                .textTheme
                                .titleLarge
                                ?.copyWith(
                                  color: Theme.of(context).colorScheme.primary,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                          const SizedBox(height: 8.0),
                          Text(
                            isWolof
                                ? 'Yënu ma dëmande yuy wone fi'
                                : 'Les demandes de réservation apparaîtront ici',
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.copyWith(
                                  color: Theme.of(
                                    context,
                                  ).colorScheme.onSurfaceVariant,
                                ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16.0, 0.0, 16.0, 80.0),
                    itemCount: _filteredBookings.length,
                    itemBuilder: (context, index) =>
                        _buildBookingCard(_filteredBookings[index], isWolof),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildBookingCard(Map<String, dynamic> booking, bool isWolof) {
    Color statusColor;
    String statusText;
    if (booking['status'] == 'pending') {
      statusColor = Theme.of(context).colorScheme.primaryContainer;
      statusText = isWolof ? 'Dëmandé' : 'En attente';
    } else {
      if (booking['status'] == 'confirmed') {
        statusColor = Theme.of(context).colorScheme.secondary;
        statusText = isWolof ? 'Konfirme' : 'Confirmé';
      } else {
        statusColor = Theme.of(context).colorScheme.primary;
        statusText = isWolof ? 'Jeexal' : 'Terminé';
      }
    }
    return Card(
      margin: const EdgeInsets.only(bottom: 16.0),
      child: InkWell(
        onTap: () => _showBookingActions(booking, isWolof),
        borderRadius: BorderRadius.circular(12.0),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 50.0,
                    height: 50.0,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Theme.of(context).colorScheme.primary,
                          Theme.of(context).colorScheme.secondary,
                        ],
                      ),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.person, color: Colors.white),
                  ),
                  const SizedBox(width: 16.0),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          booking['clientName'],
                          style: Theme.of(context)
                              .textTheme
                              .titleMedium
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4.0),
                        Row(
                          children: [
                            Icon(
                              Icons.location_on,
                              size: 14.0,
                              color: Theme.of(
                                context,
                              ).colorScheme.onSurfaceVariant,
                            ),
                            const SizedBox(width: 4.0),
                            Text(
                              booking['location'],
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12.0,
                      vertical: 6.0,
                    ),
                    decoration: BoxDecoration(
                      color: booking['status'] == 'pending'
                          ? Theme.of(context).colorScheme.primaryContainer
                          : statusColor.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    child: Text(
                      statusText,
                      style: TextStyle(
                        fontSize: 12.0,
                        fontWeight: FontWeight.bold,
                        color: booking['status'] == 'pending'
                            ? Theme.of(context).colorScheme.primary
                            : statusColor,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16.0),
              Container(
                padding: const EdgeInsets.all(12.0),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(12.0),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            isWolof ? 'Liggéey' : 'Service',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                          Text(
                            booking['service'],
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            isWolof ? 'Surface' : 'Surface',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                          Text(
                            '${booking['hectares']} ha',
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          isWolof ? 'Prix' : 'Prix',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                        Text(
                          '${booking['price'].toStringAsFixed(0)} F',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                        ),
                      ],
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

  @override
  void initState() {
    super.initState();
    _loadReceivedBookings();
  }

  Future<void> _loadReceivedBookings() async {
    try {
      setState(() {
        _isLoading = true;
      });
      final response = await BookingsCollection.instance.getAllBookings(
        page: 1,
        limit: 50,
      );
      if (mounted) {
        setState(() {
          _receivedBookingsFromBackend = (response.data as List<dynamic>)
              .map((item) => BookingModel.fromJson(item))
              .toList();
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _confirmBooking(String bookingId, bool isWolof) async {
    try {
      final response = await BookingsCollection.instance.confirmBooking(
        bookingId,
      );
      if (response.success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              isWolof ? 'Dëmande bi konfirme na' : 'Demande confirmée',
            ),
            backgroundColor: Theme.of(context).colorScheme.secondary,
          ),
        );
        _loadReceivedBookings();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              response.message,
            ),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            isWolof ? 'Xët bi: ${e.toString()}' : 'Erreur: ${e.toString()}',
          ),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _cancelBooking(String bookingId, bool isWolof) async {
    try {
      final response = await BookingsCollection.instance.cancelBooking(
        id: bookingId,
        reason: 'Refusé par le prestataire',
      );
      if (response.success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(isWolof ? 'Dëmande bi bisantil' : 'Demande refusée'),
            backgroundColor: const Color(0xffd32f2f),
          ),
        );
        _loadReceivedBookings();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              response.message,
            ),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            isWolof ? 'Xët bi: ${e.toString()}' : 'Erreur: ${e.toString()}',
          ),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _showBookingActions(Map<String, dynamic> booking, bool isWolof) {
    if (booking['status'] != 'pending') {
      return;
    }
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24.0)),
        ),
        padding: EdgeInsets.fromLTRB(
          24.0,
          24.0,
          24.0,
          24.0 + MediaQuery.of(context).padding.bottom,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              isWolof ? 'Tànnal' : 'Actions',
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24.0),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.pop(context);
                  _confirmBooking(booking['id'], isWolof);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.secondary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                ),
                icon: const Icon(Icons.check_circle),
                label: Text(isWolof ? 'Konfirme' : 'Accepter'),
              ),
            ),
            const SizedBox(height: 12.0),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () {
                  Navigator.pop(context);
                  _cancelBooking(booking['id'], isWolof);
                },
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xffd32f2f),
                  side: const BorderSide(color: Color(0xffd32f2f)),
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                ),
                icon: const Icon(Icons.cancel),
                label: Text(isWolof ? 'Bisantil' : 'Refuser'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
