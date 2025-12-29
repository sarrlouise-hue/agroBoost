import 'package:flutter/material.dart';
import 'package:allotracteur/booking_data.dart';

class ReservationsScreen extends StatefulWidget {
  const ReservationsScreen({
    required this.language,
    required this.userType,
    super.key,
  });

  final String language;

  final String userType;

  @override
  State<ReservationsScreen> createState() {
    return _ReservationsScreenState();
  }
}

class _ReservationsScreenState extends State<ReservationsScreen> {
  String _selectedFilter = 'all';

  List<BookingData> get _filteredBookings {
    if (_selectedFilter == 'all') {
      return _bookings;
    }
    if (_selectedFilter == 'upcoming') {
      return _bookings
          .where((b) => b.status == 'confirmed' || b.status == 'pending')
          .toList();
    }
    if (_selectedFilter == 'completed') {
      return _bookings.where((b) => b.status == 'completed').toList();
    }
    if (_selectedFilter == 'cancelled') {
      return _bookings.where((b) => b.status == 'cancelled').toList();
    }
    return _bookings;
  }

  final List<BookingData> _bookings = [
    BookingData(
      id: '1',
      tractorName: 'John Deere 5065E',
      tractorModel: 'JD5065E',
      service: 'Labour',
      date: DateTime.now().add(const Duration(days: 2)),
      hectares: 3.5,
      totalPrice: 140000.0,
      status: 'confirmed',
      tractorImage:
          'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      ownerName: 'Moussa Diop',
    ),
    BookingData(
      id: '2',
      tractorName: 'Massey Ferguson 385',
      tractorModel: 'MF385',
      service: 'Semis',
      date: DateTime.now().subtract(const Duration(days: 5)),
      hectares: 2.0,
      totalPrice: 70000.0,
      status: 'completed',
      tractorImage:
          'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=400',
      ownerName: 'Amadou Seck',
    ),
    BookingData(
      id: '3',
      tractorName: 'Fendt 724',
      tractorModel: 'F724',
      service: 'Récolte',
      date: DateTime.now().add(const Duration(days: 7)),
      hectares: 5.0,
      totalPrice: 250000.0,
      status: 'pending',
      tractorImage:
          'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
      ownerName: 'Ibrahima Fall',
    ),
  ];

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
      selectedColor: const Color(0xffe56d4b),
      labelStyle: TextStyle(
        color:
            isSelected ? Colors.white : Theme.of(context).colorScheme.onSurface,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
      ),
    );
  }

  Widget _buildDetailRow(
    BuildContext context,
    IconData icon,
    String label,
    String value,
  ) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
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

  @override
  Widget build(BuildContext context) {
    final bool isWolof = widget.language == 'wo';
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text(isWolof ? 'Sama Réserwasioŋ' : 'Mes Réservations'),
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0.0,
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
                  'upcoming',
                  isWolof ? 'À venir' : 'À venir',
                  Icons.upcoming,
                ),
                const SizedBox(width: 8.0),
                _buildFilterChip(
                  'completed',
                  isWolof ? 'Jeexal' : 'Terminées',
                  Icons.check_circle,
                ),
                const SizedBox(width: 8.0),
                _buildFilterChip(
                  'cancelled',
                  isWolof ? 'Bisantil' : 'Annulées',
                  Icons.cancel,
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
                    icon: Icons.pending_actions,
                    value: _bookings
                        .where(
                          (b) =>
                              b.status == 'pending' || b.status == 'confirmed',
                        )
                        .length
                        .toString(),
                    label: isWolof ? 'En cours' : 'En cours',
                    color: const Color(0xffe56d4b),
                  ),
                ),
                const SizedBox(width: 12.0),
                Expanded(
                  child: _buildStatCard(
                    icon: Icons.check_circle,
                    value: _bookings
                        .where((b) => b.status == 'completed')
                        .length
                        .toString(),
                    label: isWolof ? 'Terminées' : 'Terminées',
                    color: Colors.green,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: _filteredBookings.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.book_online,
                          size: 80.0,
                          color: Theme.of(context).colorScheme.outlineVariant,
                        ),
                        const SizedBox(height: 16.0),
                        Text(
                          isWolof ? 'Amul réservation' : 'Aucune réservation',
                          style:
                              Theme.of(context).textTheme.titleMedium?.copyWith(
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.onSurfaceVariant,
                                  ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16.0, 0.0, 16.0, 16.0),
                    itemCount: _filteredBookings.length,
                    itemBuilder: (context, index) =>
                        _buildBookingCard(_filteredBookings[index], isWolof),
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
    return Container(
      padding: const EdgeInsets.all(10.0),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 20.0),
          const SizedBox(height: 4.0),
          Text(
            value,
            style: TextStyle(
              fontSize: 20.0,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 2.0),
          Text(
            label,
            style: TextStyle(
              fontSize: 10.0,
              color: color,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBookingCard(BookingData booking, bool isWolof) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16.0),
      elevation: 2.0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16.0),
        side: BorderSide(color: Theme.of(context).colorScheme.outlineVariant),
      ),
      child: InkWell(
        onTap: () {
          _showBookingDetails(booking, isWolof);
        },
        borderRadius: BorderRadius.circular(16.0),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12.0),
                    child: Image.network(
                      booking.tractorImage ??
                          'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400',
                      width: 80.0,
                      height: 80.0,
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(width: 16.0),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                booking.tractorName,
                                style: Theme.of(context)
                                    .textTheme
                                    .titleMedium
                                    ?.copyWith(fontWeight: FontWeight.bold),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8.0,
                                vertical: 4.0,
                              ),
                              decoration: BoxDecoration(
                                color: booking.getStatusColor().withValues(
                                      alpha: 0.2,
                                    ),
                                borderRadius: BorderRadius.circular(8.0),
                              ),
                              child: Text(
                                booking.getStatusText(),
                                style: TextStyle(
                                  fontSize: 12.0,
                                  fontWeight: FontWeight.bold,
                                  color: booking.getStatusColor(),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4.0),
                        Text(
                          booking.tractorModel,
                          style:
                              Theme.of(context).textTheme.bodySmall?.copyWith(
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.onSurfaceVariant,
                                  ),
                        ),
                        const SizedBox(height: 8.0),
                        Row(
                          children: [
                            Icon(
                              Icons.category,
                              size: 14.0,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                            const SizedBox(width: 4.0),
                            Text(
                              booking.service,
                              style: TextStyle(
                                fontSize: 12.0,
                                color: Theme.of(context).colorScheme.primary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ],
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
                      child: Row(
                        children: [
                          Icon(
                            Icons.calendar_today,
                            size: 16.0,
                            color: Theme.of(
                              context,
                            ).colorScheme.onSurfaceVariant,
                          ),
                          const SizedBox(width: 6.0),
                          Text(
                            '${booking.date.day}/${booking.date.month}/${booking.date.year}',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Row(
                        children: [
                          Icon(
                            Icons.landscape,
                            size: 16.0,
                            color: Theme.of(
                              context,
                            ).colorScheme.onSurfaceVariant,
                          ),
                          const SizedBox(width: 6.0),
                          Text(
                            '${booking.hectares} ha',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ),
                    Text(
                      '${booking.totalPrice.toStringAsFixed(0)} F',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: const Color(0xffe56d4b),
                          ),
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

  void _showBookingDetails(BookingData booking, bool isWolof) {
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
            ClipRRect(
              borderRadius: BorderRadius.circular(16.0),
              child: Image.network(
                booking.tractorImage ??
                    'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400',
                width: double.infinity,
                height: 180.0,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(height: 16.0),
            Text(
              booking.tractorName,
              style: Theme.of(
                context,
              ).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24.0),
            Expanded(
              child: ListView(
                children: [
                  _buildDetailRow(
                    context,
                    Icons.category,
                    'Service',
                    booking.service,
                  ),
                  _buildDetailRow(
                    context,
                    Icons.calendar_today,
                    'Date',
                    '${booking.date.day}/${booking.date.month}/${booking.date.year}',
                  ),
                  _buildDetailRow(
                    context,
                    Icons.landscape,
                    'Surface',
                    '${booking.hectares} hectares',
                  ),
                  _buildDetailRow(
                    context,
                    Icons.person,
                    'Propriétaire',
                    booking.ownerName,
                  ),
                  _buildDetailRow(
                    context,
                    Icons.payment,
                    'Prix total',
                    '${booking.totalPrice.toStringAsFixed(0)} FCFA',
                  ),
                  _buildDetailRow(
                    context,
                    Icons.info,
                    'Statut',
                    booking.getStatusText(),
                  ),
                  const SizedBox(height: 80.0),
                ],
              ),
            ),
            if (booking.status == 'pending' || booking.status == 'confirmed')
              Padding(
                padding: EdgeInsets.only(
                  top: 16.0,
                  bottom: MediaQuery.of(context).padding.bottom,
                ),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            isWolof
                                ? 'Réservation annulée'
                                : 'Réservation annulée',
                          ),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16.0),
                    ),
                    icon: const Icon(Icons.cancel),
                    label: Text(
                      isWolof ? 'Bisantil' : 'Annuler la réservation',
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
