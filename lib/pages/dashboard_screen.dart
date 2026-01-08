// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:hallo/globals/app_state.dart';
import 'package:hallo/pages/login_screen.dart';
import 'package:hallo/pages/received_reservations_screen.dart';
import 'package:hallo/pages/add_tractor_screen.dart';
import 'package:hallo/pages/maintenance_dashboard_screen.dart';

class DashboardScreen extends StatelessWidget {
    const DashboardScreen({required this.language, super.key});

  final String language;

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
    final recentBookings = [
      {
        'client': 'Fatou Sall',
        'service': 'Labour',
        'hectares': 3.5,
        'status': 'pending',
        'date': 'Aujourd\'hui',
      },
      {
        'client': 'Ibrahima Ndiaye',
        'service': 'Offset',
        'hectares': 2.0,
        'status': 'confirmed',
        'date': 'Demain',
      },
    ];
    return recentBookings.map((booking) {
      Color statusColor = booking['status'] == 'confirmed'
          ? Theme.of(context).colorScheme.secondary
          : Theme.of(context).colorScheme.primaryContainer;
      String statusText = booking['status'] == 'confirmed'
          ? (isWolof ? 'Konfirme' : 'Confirmé')
          : (isWolof ? 'Dëmandé' : 'En attente');
      return Card(
        margin: const EdgeInsets.only(bottom: 12.0),
        child: ListTile(
          leading: Container(
            padding: const EdgeInsets.all(10.0),
            decoration: BoxDecoration(
              color: statusColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10.0),
            ),
            child: Icon(Icons.person, color: statusColor),
          ),
          title: Text(
            booking['client'] as String,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          subtitle: Text('${booking['service']} • ${booking['hectares']} ha'),
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
              Text(
                booking['date'] as String,
                style: Theme.of(context).textTheme.bodySmall,
              ),
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
                        Text(
                          'Mamadou Diop',
                          style: Theme.of(builderContext)
                              .textTheme
                              .titleLarge
                              ?.copyWith(fontWeight: FontWeight.bold),
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
                          const Text(
                            '2,450,000',
                            style: TextStyle(
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
    final bool isWolof = language == 'wo';
    final int totalReservations = 24;
    final int activeReservations = 3;
    final double totalRevenue = 2450000.0;
    final int totalTractors = 2;
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
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              isWolof ? 'Asalaam alekum!' : 'Bonjour !',
              style: Theme.of(
                context,
              ).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
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
                    value: '${(totalRevenue / 1000).toStringAsFixed(0)}K F',
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
                  style: Theme.of(
                    context,
                  ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            ReceivedReservationsScreen(language: language),
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
                            language: language,
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
    );
  }
}
