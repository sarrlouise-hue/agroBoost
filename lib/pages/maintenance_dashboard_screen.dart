import 'package:flutter/material.dart';
import 'package:allotracteur/tractor_maintenance.dart';
import 'package:allotracteur/maintenance_alert.dart';
import 'package:allotracteur/pages/tractor_maintenance_detail_screen.dart';
import 'package:allotracteur/globals/notification_provider.dart';
import 'package:allotracteur/components/notification_badge.dart';
import 'package:allotracteur/pages/maintenance_planning_screen.dart';
import 'package:allotracteur/pages/add_tractor_screen.dart';

class MaintenanceDashboardScreen extends StatefulWidget {
  const MaintenanceDashboardScreen({
    required this.language,
    super.key,
    this.showBackButton = false,
  });

  final String language;

  final bool showBackButton;

  @override
  State<MaintenanceDashboardScreen> createState() {
    return _MaintenanceDashboardScreenState();
  }
}

class _MaintenanceDashboardScreenState
    extends State<MaintenanceDashboardScreen> {
  final List<TractorMaintenance> _tractors = [
    TractorMaintenance(
      id: '1',
      name: 'John Deere 5065E',
      model: 'JD5065E',
      year: 2020,
      currentEngineHours: 1450,
      lastMaintenanceDate: DateTime.now().subtract(const Duration(days: 15)),
      nextMaintenanceHours: 1500,
      nextMaintenanceDate: DateTime.now().add(const Duration(days: 5)),
      healthStatus: 'good',
      totalMaintenanceCost: 450000.0,
      totalMaintenanceCount: 12,
    ),
    TractorMaintenance(
      id: '2',
      name: 'Massey Ferguson 385',
      model: 'MF385',
      year: 2019,
      currentEngineHours: 2890,
      lastMaintenanceDate: DateTime.now().subtract(const Duration(days: 3)),
      nextMaintenanceHours: 2950,
      nextMaintenanceDate: DateTime.now().add(const Duration(days: 60)),
      healthStatus: 'excellent',
      totalMaintenanceCost: 380000.0,
      totalMaintenanceCount: 18,
    ),
  ];

  final List<MaintenanceAlert> _alerts = [
    MaintenanceAlert(
      id: '1',
      tractorId: '1',
      tractorName: 'John Deere 5065E',
      type: 'engine_hours',
      title: 'Vidange moteur proche',
      description: 'Vidange d\'huile moteur recommandée dans 50 heures',
      dueDate: DateTime.now().add(const Duration(days: 5)),
      targetEngineHours: 1500,
      priority: 'medium',
    ),
    MaintenanceAlert(
      id: '2',
      tractorId: '1',
      tractorName: 'John Deere 5065E',
      type: 'date_based',
      title: 'Inspection annuelle',
      description: 'Inspection technique annuelle obligatoire',
      dueDate: DateTime.now().add(const Duration(days: 30)),
      priority: 'high',
    ),
  ];

  Widget _buildStatsOverview(bool isWolof) {
    int totalTractors = _tractors.length;
    int tractorsNeedingMaintenance =
        _tractors.where((t) => t.hoursUntilMaintenance < 100).length;
    int urgentAlerts = _alerts
        .where((a) => a.priority == 'high' || a.priority == 'critical')
        .length;
    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            icon: Icons.agriculture,
            value: totalTractors.toString(),
            label: isWolof ? 'Traktëër' : 'Tracteurs',
            color: Theme.of(context).colorScheme.primary,
          ),
        ),
        const SizedBox(width: 12.0),
        Expanded(
          child: _buildStatCard(
            icon: Icons.build,
            value: tractorsNeedingMaintenance.toString(),
            label: isWolof ? 'À entretenir' : 'À entretenir',
            color: const Color(0xffffda79),
          ),
        ),
        const SizedBox(width: 12.0),
        Expanded(
          child: _buildStatCard(
            icon: Icons.warning,
            value: urgentAlerts.toString(),
            label: isWolof ? 'Alertes' : 'Alertes',
            color: urgentAlerts > 0
                ? Theme.of(context).colorScheme.error
                : const Color(0xff2d5016),
          ),
        ),
      ],
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
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 28.0),
          const SizedBox(height: 8.0),
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

  Widget _buildSectionTitle(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: Theme.of(context).colorScheme.primary),
        const SizedBox(width: 8.0),
        Text(
          title,
          style: Theme.of(
            context,
          ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  Widget _buildAlertCard(MaintenanceAlert alert, bool isWolof) {
    Color priorityColor;
    switch (alert.priority) {
      case 'critical':
        priorityColor = Colors.red;
        break;
      case 'high':
        priorityColor = Colors.orange;
        break;
      case 'medium':
        priorityColor = Colors.yellow[700]!;
        break;
      default:
        priorityColor = Colors.blue;
    }
    return Container(
      margin: const EdgeInsets.only(bottom: 12.0),
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: priorityColor.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(color: priorityColor.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          Icon(Icons.warning_amber, color: priorityColor, size: 28.0),
          const SizedBox(width: 12.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  alert.title,
                  style: Theme.of(
                    context,
                  ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4.0),
                Text(
                  alert.description,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: 4.0),
                Text(
                  '${alert.tractorName} • ${alert.daysUntilMaintenance} ${isWolof ? 'bës' : 'jours'}',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: priorityColor,
                        fontWeight: FontWeight.w600,
                      ),
                ),
              ],
            ),
          ),
          Icon(Icons.arrow_forward_ios, size: 16.0, color: priorityColor),
        ],
      ),
    );
  }

  Widget _buildTractorMaintenanceCard(
    TractorMaintenance tractor,
    bool isWolof,
  ) {
    Color statusColor;
    String statusText;
    switch (tractor.healthStatus) {
      case 'excellent':
        statusColor = const Color(0xff2d5016);
        statusText = isWolof ? 'Baax na lool' : 'Excellent';
        break;
      case 'good':
        statusColor = Colors.green;
        statusText = isWolof ? 'Baax na' : 'Bon';
        break;
      case 'needs_attention':
        statusColor = Colors.orange;
        statusText = isWolof ? 'Attention' : 'Attention';
        break;
      default:
        statusColor = Colors.red;
        statusText = isWolof ? 'Critique' : 'Critique';
    }
    return Card(
      margin: const EdgeInsets.only(bottom: 16.0),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => TractorMaintenanceDetailScreen(
                tractor: tractor,
                language: widget.language,
              ),
            ),
          );
        },
        borderRadius: BorderRadius.circular(12.0),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          tractor.name,
                          style: Theme.of(context)
                              .textTheme
                              .titleMedium
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        Text(
                          '${tractor.model} • ${tractor.year}',
                          style: Theme.of(context).textTheme.bodySmall,
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
                      color: statusColor.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(20.0),
                      border: Border.all(color: statusColor),
                    ),
                    child: Text(
                      statusText,
                      style: TextStyle(
                        color: statusColor,
                        fontWeight: FontWeight.w600,
                        fontSize: 12.0,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16.0),
              Row(
                children: [
                  Icon(
                    Icons.speed,
                    size: 20.0,
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                  const SizedBox(width: 8.0),
                  Text(
                    '${tractor.currentEngineHours} h',
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const Spacer(),
                  Text(
                    '${isWolof ? 'Ndax' : 'Prochaine'}: ${tractor.hoursUntilMaintenance} h',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
              const SizedBox(height: 8.0),
              ClipRRect(
                borderRadius: BorderRadius.circular(8.0),
                child: LinearProgressIndicator(
                  value:
                      tractor.currentEngineHours / tractor.nextMaintenanceHours,
                  minHeight: 8.0,
                  backgroundColor: Theme.of(
                    context,
                  ).colorScheme.surfaceContainerHighest,
                  valueColor: AlwaysStoppedAnimation<Color>(statusColor),
                ),
              ),
              const SizedBox(height: 12.0),
              Container(
                padding: const EdgeInsets.all(12.0),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(8.0),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.calendar_today,
                      size: 16.0,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    const SizedBox(width: 8.0),
                    Text(
                      '${isWolof ? 'Ndax entretien:' : 'Prochain entretien:'} ${tractor.daysUntilMaintenance} ${isWolof ? 'bës' : 'jours'}',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            fontWeight: FontWeight.w600,
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

  @override
  void initState() {
    super.initState();
    _addTestNotifications();
  }

  void _addTestNotifications() {
    final notificationProvider = NotificationProvider.of(
      context,
      listen: false,
    );
    notificationProvider.scheduleMaintenanceReminder(_tractors[0]);
    notificationProvider.notifyReservationConfirmed(
      'John Deere 5065E',
      DateTime.now().add(const Duration(days: 2)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isWolof = widget.language == 'wo';
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: widget.showBackButton,
        leading: widget.showBackButton
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () => Navigator.pop(context),
              )
            : null,
        title: Text(isWolof ? 'Entretien' : 'Entretien'),
        actions: [const NotificationBadge()],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20.0, 20.0, 20.0, 32.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildStatsOverview(isWolof),
            const SizedBox(height: 24.0),
            if (_alerts.isNotEmpty) ...[
              _buildSectionTitle(
                isWolof ? 'Alertes' : 'Alertes',
                Icons.warning_amber,
              ),
              const SizedBox(height: 12.0),
              ..._alerts
                  .take(2)
                  .map((alert) => _buildAlertCard(alert, isWolof)),
              if (_alerts.length > 2)
                TextButton(
                  onPressed: () {},
                  child: Text(isWolof ? 'Gis lépp' : 'Voir toutes les alertes'),
                ),
              const SizedBox(height: 24.0),
            ],
            _buildSectionTitle(
              isWolof ? 'Sama Traktëër' : 'Mes Tracteurs',
              Icons.agriculture,
            ),
            const SizedBox(height: 12.0),
            ..._tractors.map(
              (tractor) => _buildTractorMaintenanceCard(tractor, isWolof),
            ),
            const SizedBox(height: 24.0),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _showActionMenu(context, isWolof);
        },
        backgroundColor: const Color(0xffe56d4b),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  void _showActionMenu(BuildContext context, bool isWolof) {
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
            Text(
              isWolof ? 'Tànnal' : 'Actions',
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24.0),
            ListTile(
              leading: Container(
                padding: const EdgeInsets.all(12.0),
                decoration: BoxDecoration(
                  color: const Color(0xffe56d4b).withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12.0),
                ),
                child: const Icon(
                  Icons.calendar_month,
                  color: Color(0xffe56d4b),
                ),
              ),
              title: Text(
                isWolof ? 'Planning' : 'Planning',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
              subtitle: Text(
                isWolof
                    ? 'Gis planning bi entretien'
                    : 'Voir le calendrier des entretiens',
              ),
              trailing: const Icon(Icons.arrow_forward_ios, size: 16.0),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const MaintenancePlanningScreen(),
                  ),
                );
              },
            ),
            const SizedBox(height: 12.0),
            ListTile(
              leading: Container(
                padding: const EdgeInsets.all(12.0),
                decoration: BoxDecoration(
                  color: Colors.green.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12.0),
                ),
                child: const Icon(Icons.add_circle, color: Colors.green),
              ),
              title: Text(
                isWolof ? 'Yokk traktëër' : 'Ajouter un tracteur',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
              subtitle: Text(
                isWolof
                    ? 'Yokk benn traktëër bu bees'
                    : 'Ajouter un nouveau tracteur',
              ),
              trailing: const Icon(Icons.arrow_forward_ios, size: 16.0),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>
                        const AddTractorScreen(showBackButton: false),
                  ),
                );
              },
            ),
            const SizedBox(height: 16.0),
          ],
        ),
      ),
    );
  }
}
