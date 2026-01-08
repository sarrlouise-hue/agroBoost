import 'package:flutter/material.dart';
import 'package:hallo/models/booking_model.dart';
import 'package:hallo/models/service_model.dart';
import 'package:hallo/booking_data.dart';
import 'package:hallo/bookings_collection.dart';
import 'package:hallo/services_collection.dart';

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

  List<BookingModel> _bookingsFromBackend = [];

  bool _isLoading = true;

  final Map<String, ServiceModel> _servicesMap = {};

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

  List<BookingData> get _bookings {
    return _bookingsFromBackend.map((booking) {
      final service = _servicesMap[booking.serviceId];
      final tractorName = service?.name ?? 'Service non trouvé';
      final tractorImage =
          service?.images.isNotEmpty == true ? service?.images[0] : null;
      String serviceTypeDisplay = 'Service';
      if (booking.type == 'daily') {
        serviceTypeDisplay = 'Location journalière';
      } else {
        if (booking.type == 'hourly') {
          serviceTypeDisplay = 'Location horaire';
        }
      }
      double hectares = 0.0;
      if (booking.notes != null && booking.notes!.contains('Hectares:')) {
        try {
          final match = RegExp(
            'Hectares:\\s*(\\d+\\.?\\d*)',
          ).firstMatch(booking.notes!);
          if (match != null) {
            hectares = double.parse(match.group(1) ?? '0');
          }
        } catch (e) {
          hectares = 0.0;
        }
      }
      DateTime bookingDate =
          booking.startDate ?? booking.bookingDate ?? DateTime.now();
      print('📋 Création BookingData:');
      print('   Service ID: ${booking.serviceId}');
      print('   Nom tracteur: ${tractorName}');
      print('   Image tracteur: ${tractorImage}');
      print('   Type: ${serviceTypeDisplay}');
      print('   ---');
      return BookingData(
        id: booking.id,
        tractorName: tractorName,
        tractorModel: service?.serviceType ?? booking.serviceId,
        service: serviceTypeDisplay,
        date: bookingDate,
        hectares: hectares,
        totalPrice: booking.totalPrice,
        status: booking.status,
        tractorImage: tractorImage,
        ownerName: 'Prestataire',
      );
    }).toList();
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
            '${label}:',
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

  @override
  void initState() {
    super.initState();
    _loadBookings();
  }

  @override
  Widget build(BuildContext context) {
    final bool isWolof = widget.language == 'wo';
    if (_isLoading) {
      return Scaffold(
        backgroundColor: Theme.of(context).colorScheme.surface,
        appBar: AppBar(
          automaticallyImplyLeading: false,
          title: Text(isWolof ? 'Sama Réserwasioŋ' : 'Mes Réservations'),
          backgroundColor: Theme.of(context).colorScheme.surface,
          elevation: 0.0,
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(
                color: Theme.of(context).colorScheme.primary,
              ),
              const SizedBox(height: 16.0),
              Text(
                isWolof ? 'Dalay charge...' : 'Chargement...',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
            ],
          ),
        ),
      );
    }
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text(isWolof ? 'Sama Réserwasioŋ' : 'Mes Réservations'),
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0.0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadBookings,
            tooltip: isWolof ? 'Rafraîchir' : 'Rafraîchir',
          ),
        ],
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
                    color: Theme.of(context).colorScheme.primary,
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
                              Icons.book_online,
                              size: 64.0,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                          ),
                          const SizedBox(height: 24.0),
                          Text(
                            isWolof ? 'Amul réservation' : 'Aucune réservation',
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
                                ? 'Sa réservations dañuy wone fi'
                                : 'Vos réservations apparaîtront ici',
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
                : RefreshIndicator(
                    onRefresh: _loadBookings,
                    child: ListView.builder(
                      padding: const EdgeInsets.fromLTRB(16.0, 0.0, 16.0, 16.0),
                      itemCount: _filteredBookings.length,
                      itemBuilder: (context, index) =>
                          _buildBookingCard(_filteredBookings[index], isWolof),
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Future<void> _loadBookings() async {
    try {
      setState(() {
        _isLoading = true;
      });
      print('📥 Chargement des réservations...');
      final bookingsResult = await BookingsCollection.instance.getAllBookings(
        page: 1,
        limit: 50,
      );
      print('📥 Chargement des services...');
      final servicesResult = await ServicesCollection.instance.getAllServices(
        page: 1,
        limit: 100,
      );
      if (mounted) {
        setState(() {
          _bookingsFromBackend = List<BookingModel>.from(bookingsResult.data);
          _servicesMap.clear();
          for (var service in servicesResult.data) {
            _servicesMap[service.id] = service;
          }
          _isLoading = false;
        });
        print('✅ Réservations chargées: ${_bookingsFromBackend.length}');
        print('✅ Services chargés: ${_servicesMap.length}');
        for (var booking in _bookingsFromBackend) {
          final service = _servicesMap[booking.serviceId];
          print('📋 Réservation:');
          print('   ID: ${booking.id}');
          print('   Service ID: ${booking.serviceId}');
          print(
            '   Service trouvé: ${service != null ? service.name : 'NON TROUVÉ'}',
          );
          if (service != null) {
            print('   Nom: ${service.name}');
            print('   Images: ${service.images}');
          }
          print('   Type: ${booking.type}');
          print('   Prix: ${booking.totalPrice} F');
          print('   Statut: ${booking.status}');
          print('   ---');
        }
      }
    } catch (e) {
      print('❌ Erreur lors du chargement: ${e}');
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur: ${e}'),
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
        );
      }
    }
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
                booking.tractorImage ?? '',
                width: double.infinity,
                height: 180.0,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  width: double.infinity,
                  height: 180.0,
                  decoration: BoxDecoration(
                    color: Theme.of(
                      context,
                    ).colorScheme.surfaceContainerHighest,
                    borderRadius: BorderRadius.circular(16.0),
                  ),
                  child: Icon(
                    Icons.agriculture,
                    size: 64.0,
                    color: Theme.of(
                      context,
                    ).colorScheme.primary.withValues(alpha: 0.3),
                  ),
                ),
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
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Theme.of(context).colorScheme.error,
                          Theme.of(
                            context,
                          ).colorScheme.error.withValues(alpha: 0.8),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    child: ElevatedButton.icon(
                      onPressed: () async {
                        Navigator.pop(context);
                        if (!mounted) {
                          return;
                        }
                        final shouldCancel = await showDialog<bool>(
                          context: this.context,
                          builder: (dialogContext) => AlertDialog(
                            title: Text(
                              isWolof
                                  ? 'Bisantil réservation?'
                                  : 'Annuler la réservation?',
                            ),
                            content: Text(
                              isWolof
                                  ? 'Danga bëgg bisantil réservation bi?'
                                  : 'Êtes-vous sûr de vouloir annuler cette réservation?',
                            ),
                            actions: [
                              TextButton(
                                onPressed: () =>
                                    Navigator.pop(dialogContext, false),
                                child: Text(isWolof ? 'Déedéet' : 'Non'),
                              ),
                              ElevatedButton(
                                onPressed: () =>
                                    Navigator.pop(dialogContext, true),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Theme.of(
                                    dialogContext,
                                  ).colorScheme.error,
                                  foregroundColor: Colors.white,
                                ),
                                child: Text(
                                  isWolof ? 'Waaw, bisantil' : 'Oui, annuler',
                                ),
                              ),
                            ],
                          ),
                        );
                        if (shouldCancel == true && mounted) {
                          showDialog(
                            context: this.context,
                            barrierDismissible: false,
                            builder: (loaderContext) => Center(
                              child: Card(
                                child: Padding(
                                  padding: const EdgeInsets.all(24.0),
                                  child: Column(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      CircularProgressIndicator(
                                        color: Theme.of(
                                          loaderContext,
                                        ).colorScheme.primary,
                                      ),
                                      const SizedBox(height: 16.0),
                                      Text(
                                        isWolof
                                            ? 'Daldi bisantil...'
                                            : 'Annulation en cours...',
                                        style: Theme.of(
                                          loaderContext,
                                        ).textTheme.bodyLarge,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          );
                          try {
                            print(
                              '🚫 Annulation de la réservation: ${booking.id}',
                            );
                            await BookingsCollection.instance.cancelBooking(
                              id: booking.id,
                              reason: 'Annulée par le client',
                            );
                            if (mounted) {
                              Navigator.pop(this.context);
                            }
                            await _loadBookings();
                            if (mounted) {
                              ScaffoldMessenger.of(this.context).showSnackBar(
                                SnackBar(
                                  content: Row(
                                    children: [
                                      const Icon(
                                        Icons.check_circle,
                                        color: Colors.white,
                                      ),
                                      const SizedBox(width: 8.0),
                                      Text(
                                        isWolof
                                            ? 'Réservation bisantil na !'
                                            : 'Réservation annulée avec succès !',
                                      ),
                                    ],
                                  ),
                                  backgroundColor: const Color(0xff4caf50),
                                  behavior: SnackBarBehavior.floating,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12.0),
                                  ),
                                  duration: const Duration(seconds: 3),
                                ),
                              );
                            }
                          } catch (e) {
                            if (mounted) {
                              Navigator.pop(this.context);
                            }
                            if (mounted) {
                              ScaffoldMessenger.of(this.context).showSnackBar(
                                SnackBar(
                                  content: Row(
                                    children: [
                                      const Icon(
                                        Icons.error,
                                        color: Colors.white,
                                      ),
                                      const SizedBox(width: 8.0),
                                      Expanded(
                                        child: Text(
                                          isWolof
                                              ? 'Problème bu am: ${e.toString()}'
                                              : 'Erreur lors de l\'annulation: ${e.toString()}',
                                        ),
                                      ),
                                    ],
                                  ),
                                  backgroundColor: Theme.of(
                                    this.context,
                                  ).colorScheme.error,
                                  behavior: SnackBarBehavior.floating,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12.0),
                                  ),
                                  duration: const Duration(seconds: 4),
                                ),
                              );
                            }
                            print('❌ Erreur lors de l\'annulation: ${e}');
                          }
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        foregroundColor: Colors.white,
                        shadowColor: Colors.transparent,
                        padding: const EdgeInsets.symmetric(vertical: 16.0),
                      ),
                      icon: const Icon(Icons.cancel_outlined),
                      label: Text(
                        isWolof ? 'Bisantil' : 'Annuler la réservation',
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
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
                  if (booking.tractorImage != null &&
                      booking.tractorImage!.isNotEmpty)
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12.0),
                      child: Image.network(
                        booking.tractorImage!,
                        width: 80.0,
                        height: 80.0,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(
                          width: 80.0,
                          height: 80.0,
                          decoration: BoxDecoration(
                            color: Theme.of(
                              context,
                            ).colorScheme.surfaceContainerHighest,
                            borderRadius: BorderRadius.circular(12.0),
                          ),
                          child: Icon(
                            Icons.agriculture,
                            size: 40.0,
                            color: Theme.of(
                              context,
                            ).colorScheme.primary.withValues(alpha: 0.3),
                          ),
                        ),
                      ),
                    )
                  else
                    Container(
                      width: 80.0,
                      height: 80.0,
                      decoration: BoxDecoration(
                        color: Theme.of(
                          context,
                        ).colorScheme.surfaceContainerHighest,
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      child: Icon(
                        Icons.agriculture,
                        size: 40.0,
                        color: Theme.of(
                          context,
                        ).colorScheme.primary.withValues(alpha: 0.3),
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
                                color: booking.status == 'cancelled'
                                    ? Theme.of(
                                        context,
                                      ).colorScheme.primaryContainer
                                    : booking.getStatusColor().withValues(
                                          alpha: 0.2,
                                        ),
                                borderRadius: BorderRadius.circular(8.0),
                              ),
                              child: Text(
                                booking.getStatusText(),
                                style: TextStyle(
                                  fontSize: 12.0,
                                  fontWeight: FontWeight.bold,
                                  color: booking.status == 'cancelled'
                                      ? Theme.of(context).colorScheme.primary
                                      : booking.getStatusColor(),
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
                            color: Theme.of(context).colorScheme.primary,
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
}
