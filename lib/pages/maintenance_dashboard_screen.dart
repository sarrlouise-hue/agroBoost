import 'package:flutter/material.dart';
import 'package:hallo/services_collection.dart';

import 'dart:math';
import 'package:hallo/tractor_maintenance.dart';
import 'package:hallo/maintenance_alert.dart';
import 'package:hallo/globals/notification_provider.dart';
import 'package:hallo/pages/maintenance_planning_screen.dart';
import 'package:hallo/pages/add_tractor_screen.dart';
import 'package:hallo/pages/tractor_maintenance_detail_screen.dart';
import 'package:hallo/components/notification_badge.dart';
import 'package:hallo/components/safe_image.dart';

class MaintenanceDashboardScreen extends StatefulWidget {
  const MaintenanceDashboardScreen({
    required this.language,
    this.showBackButton = false,
    super.key,
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
  bool _isLoading = true;
  List<TractorMaintenance> _tractors = [];

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

  @override
  void initState() {
    super.initState();
    _loadTractors();
  }

  Future<void> _loadTractors() async {
    setState(() {
      _isLoading = true;
    });
    try {
      final response =
          await ServicesCollection.instance.getMyServices(limit: 50);
      if (response.success && mounted) {
        setState(() {
          _tractors = response.data.map((service) {
            debugPrint(
                '🚜 TRACTOR DEBUG: ${service.name} - Image: ${service.images.isNotEmpty ? service.images[0].substring(0, service.images[0].length > 50 ? 50 : service.images[0].length) : "NONE"}');
            // Try to parse model/year from description if available
            // Format expected in AddTractorScreen: "Model - Year"
            String model = 'Unknown';
            int year = DateTime.now().year;

            if (service.description.contains('-')) {
              final parts = service.description.split('-');
              if (parts.length >= 2) {
                model = parts[0].trim();
                final yearStr = parts[1].trim();
                // Try to remove non-digit chars if any
                final yearMatch = RegExp(r'\d{4}').firstMatch(yearStr);
                if (yearMatch != null) {
                  year = int.tryParse(yearMatch.group(0)!) ?? year;
                }
              } else {
                model = service.description;
              }
            } else {
              model = service.description;
            }

            // Start with mock maintenance data as backend doesn't support it yet
            final random = Random(service.id.hashCode);
            final currentHours = 500 + random.nextInt(3000);
            final nextHours = (currentHours ~/ 500 + 1) * 500;

            return TractorMaintenance(
              id: service.id,
              name: service.name,
              model: model,
              year: year,
              currentEngineHours: currentHours, // Mock
              lastMaintenanceDate: DateTime.now()
                  .subtract(Duration(days: random.nextInt(100) + 1)),
              nextMaintenanceHours: nextHours,
              nextMaintenanceDate:
                  DateTime.now().add(Duration(days: random.nextInt(60) + 1)),
              healthStatus: random.nextBool() ? 'good' : 'excellent',
              totalMaintenanceCost: (random.nextInt(100) * 10000).toDouble(),
              totalMaintenanceCount: random.nextInt(20),
              imageUrl: service.images.isNotEmpty ? service.images[0] : null,
            );
          }).toList();
          _isLoading = false;
        });
        if (_tractors.isNotEmpty) {
          _addTestNotifications();
        }
      } else {
        setState(() {
          _isLoading = false;
        });
        print('Error loading tractors: ${response.message}');
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
        print('Exception loading tractors: $e');
      }
    }
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
                  color: Theme.of(
                    context,
                  ).colorScheme.primary.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12.0),
                ),
                child: Icon(
                  Icons.calendar_month,
                  color: Theme.of(context).colorScheme.primary,
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
                  color: Theme.of(
                    context,
                  ).colorScheme.secondaryContainer.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(12.0),
                ),
                child: Icon(
                  Icons.add_circle,
                  color: Theme.of(context).colorScheme.secondary,
                ),
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
              onTap: () async {
                Navigator.pop(context);
                await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>
                        const AddTractorScreen(showBackButton: false),
                  ),
                );
                _loadTractors();
              },
            ),
            const SizedBox(height: 16.0),
          ],
        ),
      ),
    );
  }

  Widget _buildAlertCard(MaintenanceAlert alert, bool isWolof) {
    Color priorityColor;
    switch (alert.priority) {
      case 'critical':
        priorityColor = Colors.red;
        break;
      case 'high':
        priorityColor = Theme.of(context).colorScheme.error;
        break;
      case 'medium':
        priorityColor = Theme.of(context).colorScheme.tertiary;
        break;
      default:
        priorityColor = Theme.of(context).colorScheme.secondary;
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
        statusColor = Theme.of(context).colorScheme.tertiary;
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
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10.0),
                    child: SizedBox(
                      width: 60.0,
                      height: 60.0,
                      child: SafeImage(
                        imageUrl: tractor.imageUrl ?? '',
                        fit: BoxFit.cover,
                        errorWidget: Icon(
                          Icons.agriculture_rounded,
                          size: 30,
                          color: Theme.of(context)
                              .colorScheme
                              .primary
                              .withValues(alpha: 0.5),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16.0),
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
                  const SizedBox(width: 8.0),
                  IconButton(
                    icon: const Icon(Icons.delete_outline, color: Colors.red),
                    onPressed: () => _confirmDeleteTractor(tractor, isWolof),
                    tooltip: isWolof ? 'Dindi' : 'Supprimer',
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
            color: Theme.of(context).colorScheme.secondary,
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
                : Theme.of(context).colorScheme.tertiary,
          ),
        ),
      ],
    );
  }

  Future<void> _confirmDeleteTractor(
      TractorMaintenance tractor, bool isWolof) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isWolof ? 'Dindi traktëër' : 'Supprimer le tracteur'),
        content: Text(
          isWolof
              ? 'Danga bëgg dindi ${tractor.name}?\nLii mënul dellu ginnaaw.'
              : 'Voulez-vous vraiment supprimer ${tractor.name} ?\nCette action est irréversible.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text(isWolof ? 'Deedeet' : 'Annuler'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: Text(isWolof ? 'Dindi' : 'Supprimer'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      _deleteTractor(tractor.id, isWolof);
    }
  }

  Future<void> _deleteTractor(String id, bool isWolof) async {
    setState(() {
      _isLoading = true;
    });
    try {
      final response = await ServicesCollection.instance.deleteService(id);
      if (!mounted) return;

      setState(() {
        _isLoading = false;
      });

      if (response.success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              isWolof
                  ? 'Traktëër dindi nañu ko'
                  : 'Tracteur supprimé avec succès',
            ),
            backgroundColor: Colors.green,
          ),
        );
        _loadTractors(); // Reload the list
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              isWolof
                  ? 'Am na njuumte: ${response.message}'
                  : 'Erreur: ${response.message}',
            ),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
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
        title: Text(isWolof ? 'Sama Traktëër' : 'Mes Tracteurs'),
        actions: [const NotificationBadge(), const SizedBox(width: 16.0)],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
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
                        child: Text(
                            isWolof ? 'Gis lépp' : 'Voir toutes les alertes'),
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
                  if (_tractors.isEmpty)
                    Padding(
                      padding: const EdgeInsets.all(32.0),
                      child: Center(
                        child: Text(
                          isWolof
                              ? 'Amuloo benn traktëër'
                              : 'Aucun tracteur trouvé',
                          style: TextStyle(
                            color:
                                Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ),
                    ),
                  const SizedBox(height: 24.0),
                ],
              ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _showActionMenu(context, isWolof);
        },
        backgroundColor: Theme.of(context).colorScheme.primary,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
