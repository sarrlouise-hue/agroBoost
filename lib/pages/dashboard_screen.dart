import 'package:flutter/material.dart';
import 'package:allotracteur/pages/received_reservations_screen.dart';
import 'package:allotracteur/pages/add_tractor_screen.dart';
import 'package:allotracteur/pages/maintenance_dashboard_screen.dart';

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
      Color statusColor =
          booking['status'] == 'confirmed' ? Colors.green : Colors.orange;
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
                    color: const Color(0xffe56d4b),
                  ),
                ),
                const SizedBox(width: 12.0),
                Expanded(
                  child: _buildStatCard(
                    context,
                    icon: Icons.pending_actions,
                    value: activeReservations.toString(),
                    label: isWolof ? 'En cours' : 'En cours',
                    color: Colors.orange,
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
                    color: Colors.green,
                  ),
                ),
                const SizedBox(width: 12.0),
                Expanded(
                  child: _buildStatCard(
                    context,
                    icon: Icons.attach_money,
                    value: '${(totalRevenue / 1000).toStringAsFixed(0)}K F',
                    label: isWolof ? 'Revenu' : 'Revenu',
                    color: const Color(0xff2d5016),
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
                    color: const Color(0xffe56d4b),
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
                    color: Colors.orange,
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
