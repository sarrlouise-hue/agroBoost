import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:allotracteur/globals/auth_provider.dart';
import 'package:allotracteur/globals/app_state.dart';
import 'package:allotracteur/pages/login_screen.dart';
import 'package:allotracteur/pages/received_reservations_screen.dart';
import 'package:allotracteur/pages/add_tractor_screen.dart';
import 'package:allotracteur/pages/maintenance_dashboard_screen.dart';
import 'package:allotracteur/providers_collection.dart';
import 'package:allotracteur/components/safe_image.dart';
import 'package:allotracteur/models/booking_model.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({required this.language, super.key});

  final String language;

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _isLoading = true;
  Map<String, dynamic> _stats = {
    'totalTractors': 0,
    'activeReservations': 0,
    'totalReservations': 0,
    'revenue': 0,
  };
  List<BookingModel> _recentBookings = [];

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    try {
      if (mounted) {
        setState(() {
          _isLoading = true;
        });
      }

      // Récupérer les stats
      final statsResponse =
          await ProvidersCollection.instance.getDashboardStats();
      final statsData = statsResponse.data;

      // Récupérer les réservations (pour l'affichage récent)
      final bookingsResponse =
          await ProvidersCollection.instance.getProviderBookings();
      // Prendre les 2 plus récentes
      final List<BookingModel> allBookings =
          (bookingsResponse.data as List<dynamic>?)
                  ?.map((item) => BookingModel.fromJson(item))
                  .toList() ??
              [];

      if (mounted) {
        setState(() {
          if (statsData != null) {
            _stats = {
              'totalTractors': statsData['totalTractors'] ??
                  statsData['total_tractors'] ??
                  0,
              'activeReservations': statsData['activeReservations'] ??
                  statsData['active_reservations'] ??
                  0,
              'totalReservations': statsData['totalReservations'] ??
                  statsData['total_reservations'] ??
                  0,
              'revenue':
                  statsData['revenue'] ?? statsData['total_revenue'] ?? 0,
            };
          }
          _recentBookings = allBookings.take(2).toList();
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Erreur lors du chargement du dashboard: $e');
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  String _extractHectares(String? notes) {
    if (notes == null || notes.isEmpty) return '0';
    try {
      // Format attendu: "Hectares: 2.5ha..."
      if (notes.contains('Hectares:')) {
        final part = notes.split('Hectares:')[1];
        final val = part.split('ha')[0].trim();
        return val;
      }
    } catch (e) {
      debugPrint('Error extracting hectares: $e');
    }
    return '0';
  }

  String _formatDate(String? dateStr) {
    if (dateStr == null) return '';
    try {
      final date = DateTime.parse(dateStr);
      final day = date.day.toString().padLeft(2, '0');
      final month = date.month.toString().padLeft(2, '0');
      final year = date.year;
      return '$day/$month/$year';
    } catch (e) {
      return dateStr;
    }
  }

  String _formatRevenue(dynamic revenue) {
    final double val = double.tryParse(revenue.toString()) ?? 0.0;
    if (val >= 1000) {
      return '${(val / 1000).toStringAsFixed(0)}K F';
    }
    return '${val.toStringAsFixed(0)} F';
  }

  Widget _buildStatCard(
    BuildContext context, {
    required IconData icon,
    required String value,
    required String label,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 32.0),
          const SizedBox(height: 12.0),
          Text(
            value,
            style: TextStyle(
              fontSize: 24.0,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 4.0),
          Text(
            label,
            style: TextStyle(
              fontSize: 12.0,
              color: color,
              fontWeight: FontWeight.w600,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  List<Widget> _buildRecentBookings(BuildContext context, bool isWolof) {
    if (_recentBookings.isEmpty) {
      return [
        Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 20.0),
            child: Text(
              isWolof
                  ? 'Amul bénn réservation bu bees'
                  : 'Aucune réservation récente',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
          ),
        ),
      ];
    }

    return _recentBookings.map((booking) {
      final status = booking.status;

      // Extraction sécurisée des données client
      String clientName = 'Client';
      if (booking.client != null) {
        final firstName = booking.client!.firstName;
        final lastName = booking.client!.lastName;
        clientName = '$firstName $lastName'.trim();
        if (clientName.isEmpty) clientName = 'Client';
      }

      // Extraction sécurisée des données service
      String serviceName = 'Service';
      if (booking.service != null) {
        serviceName = booking.service!.name;
      }

      final hectares = _extractHectares(booking.notes);

      final dateStr = _formatDate(booking.startDate?.toIso8601String());

      Color statusColor = status == 'confirmed'
          ? Theme.of(context).colorScheme.secondary
          : Theme.of(context).colorScheme.primaryContainer;
      String statusText = status == 'confirmed'
          ? (isWolof ? 'Konfirme' : 'Confirmé')
          : (isWolof ? 'Dëmandé' : 'En attente');

      if (status == 'completed') {
        statusColor = Colors.green;
        statusText = isWolof ? 'Paré' : 'Terminé';
      }

      return Card(
        margin: const EdgeInsets.only(bottom: 12.0),
        child: ListTile(
          leading: ClipRRect(
            borderRadius: BorderRadius.circular(10.0),
            child: SizedBox(
              width: 48.0,
              height: 48.0,
              child: SafeImage(
                imageUrl: (booking.service != null &&
                        booking.service!.images.isNotEmpty)
                    ? booking.service!.images[0]
                    : '',
                fit: BoxFit.cover,
                errorWidget: Icon(Icons.person, color: statusColor),
              ),
            ),
          ),
          title: Text(
            clientName,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          subtitle: Text(
            '$serviceName • $hectares ha • ${_formatRevenue(booking.totalPrice)}',
          ),
          trailing: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 8.0,
                  vertical: 4.0,
                ),
                decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12.0),
                ),
                child: Text(
                  statusText,
                  style: TextStyle(
                    fontSize: 11.0,
                    fontWeight: FontWeight.bold,
                    color: statusColor,
                  ),
                ),
              ),
              const SizedBox(height: 4.0),
              Text(dateStr, style: Theme.of(context).textTheme.bodySmall),
            ],
          ),
        ),
      );
    }).toList();
  }

  Widget _buildQuickAction(
    BuildContext context, {
    required IconData icon,
    required String label,
    required Color color,
    required void Function() onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12.0),
      child: Container(
        padding: const EdgeInsets.all(20.0),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(12.0),
          border: Border.all(color: color.withValues(alpha: 0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 32.0),
            const SizedBox(height: 8.0),
            Text(
              label,
              style: TextStyle(color: color, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReservationStatusItem(
    BuildContext context,
    IconData icon,
    String label,
    String count,
    Color color,
  ) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8.0),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.2),
            borderRadius: BorderRadius.circular(8.0),
          ),
          child: Icon(icon, size: 20.0, color: color),
        ),
        const SizedBox(width: 12.0),
        Expanded(
          child: Text(
            label,
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600),
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 6.0),
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(20.0),
          ),
          child: Text(
            count,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14.0,
            ),
          ),
        ),
      ],
    );
  }

  void _showProfileQuickView(BuildContext context, bool isWolof) {
    bool isBalanceHidden = false;
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (modalContext) => StatefulBuilder(
        builder: (builderContext, setModalState) => Container(
          decoration: BoxDecoration(
            color: Theme.of(builderContext).colorScheme.surface,
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(24.0),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.1),
                blurRadius: 20.0,
                offset: const Offset(0.0, -5.0),
              ),
            ],
          ),
          padding: EdgeInsets.fromLTRB(
            24.0,
            24.0,
            24.0,
            24.0 + MediaQuery.of(builderContext).padding.bottom,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40.0,
                height: 4.0,
                margin: const EdgeInsets.only(bottom: 20.0),
                decoration: BoxDecoration(
                  color: Theme.of(builderContext).colorScheme.outlineVariant,
                  borderRadius: BorderRadius.circular(2.0),
                ),
              ),
              Row(
                children: [
                  Container(
                    width: 64.0,
                    height: 64.0,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Theme.of(builderContext).colorScheme.primary,
                          Theme.of(builderContext).colorScheme.secondary,
                        ],
                      ),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.person,
                      color: Colors.white,
                      size: 32.0,
                    ),
                  ),
                  const SizedBox(width: 16.0),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Consumer<AuthProvider>(
                          builder: (context, authProvider, _) {
                            final user = authProvider.currentUser;
                            final fullName = user != null
                                ? '${user.firstName} ${user.lastName}'
                                : 'Utilisateur';
                            return Text(
                              fullName,
                              style: Theme.of(builderContext)
                                  .textTheme
                                  .titleLarge
                                  ?.copyWith(fontWeight: FontWeight.bold),
                            );
                          },
                        ),
                        Text(
                          isWolof ? 'Prestataire' : 'Prestataire',
                          style: Theme.of(builderContext)
                              .textTheme
                              .bodyMedium
                              ?.copyWith(
                                color: Theme.of(
                                  builderContext,
                                ).colorScheme.onSurfaceVariant,
                              ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24.0),
              Container(
                padding: const EdgeInsets.all(20.0),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Theme.of(builderContext).colorScheme.primary,
                      Theme.of(builderContext).colorScheme.secondary,
                    ],
                  ),
                  borderRadius: BorderRadius.circular(16.0),
                  boxShadow: [
                    BoxShadow(
                      color: Theme.of(
                        builderContext,
                      ).colorScheme.primary.withValues(alpha: 0.3),
                      blurRadius: 12.0,
                      offset: const Offset(0.0, 4.0),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(
                              Icons.account_balance_wallet,
                              color: Colors.white,
                              size: 24.0,
                            ),
                            const SizedBox(width: 12.0),
                            Text(
                              isWolof ? 'Sold bi' : 'Solde du compte',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 14.0,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                        InkWell(
                          onTap: () {
                            setModalState(() {
                              isBalanceHidden = !isBalanceHidden;
                            });
                          },
                          borderRadius: BorderRadius.circular(20.0),
                          child: Container(
                            padding: const EdgeInsets.all(6.0),
                            child: Icon(
                              isBalanceHidden
                                  ? Icons.visibility_off
                                  : Icons.visibility,
                              color: Colors.white,
                              size: 20.0,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12.0),
                    Row(
                      children: [
                        if (isBalanceHidden)
                          const Text(
                            '*******',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 36.0,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 4.0,
                            ),
                          )
                        else
                          Text(
                            // Utilisation du formatteur de revenus
                            (double.tryParse(_stats['revenue'].toString()) ?? 0)
                                .toStringAsFixed(0),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 36.0,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        const SizedBox(width: 8.0),
                        if (!isBalanceHidden)
                          const Text(
                            'FCFA',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18.0,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20.0),
              Container(
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Theme.of(
                        builderContext,
                      ).colorScheme.primaryContainer.withValues(alpha: 0.3),
                      Theme.of(
                        builderContext,
                      ).colorScheme.secondaryContainer.withValues(alpha: 0.2),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(16.0),
                  border: Border.all(
                    color: Theme.of(
                      builderContext,
                    ).colorScheme.primary.withValues(alpha: 0.3),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8.0),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Theme.of(builderContext).colorScheme.primary,
                                Theme.of(builderContext).colorScheme.secondary,
                              ],
                            ),
                            borderRadius: BorderRadius.circular(8.0),
                          ),
                          child: const Icon(
                            Icons.calendar_today,
                            color: Colors.white,
                            size: 20.0,
                          ),
                        ),
                        const SizedBox(width: 12.0),
                        Text(
                          isWolof
                              ? 'Réservations ci cours'
                              : 'Réservations en cours',
                          style: Theme.of(builderContext)
                              .textTheme
                              .titleMedium
                              ?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: Theme.of(
                                  builderContext,
                                ).colorScheme.primary,
                              ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16.0),
                    _buildReservationStatusItem(
                      builderContext,
                      Icons.pending_actions,
                      isWolof ? 'Ci attente' : 'En attente',
                      '2',
                      Theme.of(builderContext).colorScheme.primaryContainer,
                    ),
                    const SizedBox(height: 12.0),
                    _buildReservationStatusItem(
                      builderContext,
                      Icons.check_circle,
                      isWolof ? 'Accepté' : 'Acceptées',
                      '1',
                      Theme.of(builderContext).colorScheme.secondaryContainer,
                    ),
                    const SizedBox(height: 12.0),
                    _buildReservationStatusItem(
                      builderContext,
                      Icons.agriculture,
                      isWolof ? 'Ci liggéey' : 'En cours',
                      '1',
                      Theme.of(builderContext).colorScheme.secondary,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20.0),
              InkWell(
                onTap: () async {
                  final shouldLogout = await showDialog<bool>(
                    context: builderContext,
                    builder: (dialogContext) => AlertDialog(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20.0),
                      ),
                      title: Text(isWolof ? 'Génn?' : 'Déconnexion?'),
                      content: Text(
                        isWolof
                            ? 'Bëgg nga génn?'
                            : 'Voulez-vous vraiment vous déconnecter ?',
                      ),
                      actions: [
                        TextButton(
                          onPressed: () {
                            Navigator.pop(dialogContext, false);
                          },
                          child: Text(isWolof ? 'Deedeet' : 'Annuler'),
                        ),
                        Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Theme.of(dialogContext).colorScheme.error,
                                Theme.of(
                                  dialogContext,
                                ).colorScheme.error.withValues(alpha: 0.8),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(12.0),
                          ),
                          child: ElevatedButton(
                            onPressed: () {
                              Navigator.pop(dialogContext, true);
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              foregroundColor: Colors.white,
                              shadowColor: Colors.transparent,
                            ),
                            child: Text(isWolof ? 'Génn' : 'Déconnexion'),
                          ),
                        ),
                      ],
                    ),
                  );
                  if (shouldLogout == true) {
                    Navigator.pop(modalContext);
                    final appState = AppState.of(context, listen: false);
                    await appState.logout();
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(
                        builder: (navContext) => const LoginScreen(),
                      ),
                      (route) => false,
                    );
                  }
                },
                borderRadius: BorderRadius.circular(12.0),
                child: Container(
                  padding: const EdgeInsets.all(16.0),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Theme.of(
                          builderContext,
                        ).colorScheme.error.withValues(alpha: 0.1),
                        Theme.of(
                          builderContext,
                        ).colorScheme.error.withValues(alpha: 0.05),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12.0),
                    border: Border.all(
                      color: Theme.of(
                        builderContext,
                      ).colorScheme.error.withValues(alpha: 0.3),
                      width: 1.5,
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.logout_outlined,
                        color: Theme.of(builderContext).colorScheme.error,
                        size: 22.0,
                      ),
                      const SizedBox(width: 12.0),
                      Text(
                        isWolof ? 'Génn' : 'Se déconnecter',
                        style: TextStyle(
                          color: Theme.of(builderContext).colorScheme.error,
                          fontSize: 16.0,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Si chargement, afficher spinner
    if (_isLoading) {
      return Scaffold(
        body: Center(
          child: CircularProgressIndicator(
            color: Theme.of(context).colorScheme.primary,
          ),
        ),
      );
    }

    final bool isWolof = widget.language == 'wo';
    final int totalReservations =
        int.tryParse(_stats['totalReservations'].toString()) ?? 0;
    final int activeReservations =
        int.tryParse(_stats['activeReservations'].toString()) ?? 0;
    final int totalTractors =
        int.tryParse(_stats['totalTractors'].toString()) ?? 0;

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text(isWolof ? 'Tableau de Bord' : 'Tableau de Bord'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: InkWell(
              onTap: () {
                _showProfileQuickView(context, isWolof);
              },
              borderRadius: BorderRadius.circular(24.0),
              child: Container(
                width: 48.0,
                height: 48.0,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
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
                      blurRadius: 8.0,
                      offset: const Offset(0.0, 2.0),
                    ),
                  ],
                ),
                child: const Icon(Icons.person, color: Colors.white),
              ),
            ),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadDashboardData,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Consumer<AuthProvider>(
                builder: (context, authProvider, _) {
                  final user = authProvider.currentUser;
                  final name = user?.firstName ?? '';
                  return Text(
                    isWolof
                        ? (name.isEmpty
                            ? 'Asalaam alekum!'
                            : 'Asalaam alekum $name!')
                        : (name.isEmpty ? 'Bonjour !' : 'Bonjour $name !'),
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  );
                },
              ),
              const SizedBox(height: 8.0),
              Text(
                isWolof
                    ? 'Gis sa statistiques bu jot'
                    : 'Voici vos statistiques du jour',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
              ),
              const SizedBox(height: 24.0),
              Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      context,
                      icon: Icons.agriculture,
                      value: totalTractors.toString(),
                      label: isWolof ? 'Traktëër' : 'Tracteurs',
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                  const SizedBox(width: 12.0),
                  Expanded(
                    child: _buildStatCard(
                      context,
                      icon: Icons.pending_actions,
                      value: activeReservations.toString(),
                      label: isWolof ? 'En cours' : 'En cours',
                      color: Theme.of(context).colorScheme.primaryContainer,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12.0),
              Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      context,
                      icon: Icons.check_circle,
                      value: totalReservations.toString(),
                      label: isWolof ? 'Total' : 'Total',
                      color: Theme.of(context).colorScheme.secondaryContainer,
                    ),
                  ),
                  const SizedBox(width: 12.0),
                  Expanded(
                    child: _buildStatCard(
                      context,
                      icon: Icons.attach_money,
                      value: _formatRevenue(_stats['revenue']),
                      label: isWolof ? 'Revenu' : 'Revenu',
                      color: Theme.of(context).colorScheme.secondary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    isWolof ? 'Liggéey yu bees' : 'Activités récentes',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ReceivedReservationsScreen(
                            language: widget.language,
                          ),
                        ),
                      );
                    },
                    child: Text(isWolof ? 'Gis lépp' : 'Tout voir'),
                  ),
                ],
              ),
              const SizedBox(height: 16.0),
              ..._buildRecentBookings(context, isWolof),
              const SizedBox(height: 32.0),
              Text(
                isWolof ? 'Tànnal yu yagg' : 'Actions rapides',
                style: Theme.of(
                  context,
                ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16.0),
              Row(
                children: [
                  Expanded(
                    child: _buildQuickAction(
                      context,
                      icon: Icons.add_circle,
                      label: isWolof ? 'Yokk Traktëër' : 'Ajouter Tracteur',
                      color: Theme.of(context).colorScheme.primary,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const AddTractorScreen(),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 12.0),
                  Expanded(
                    child: _buildQuickAction(
                      context,
                      icon: Icons.build,
                      label: isWolof ? 'Entretien' : 'Entretien',
                      color: Theme.of(context).colorScheme.secondaryContainer,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => MaintenanceDashboardScreen(
                              language: widget.language,
                              showBackButton: true,
                            ),
                          ),
                        );
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
}
