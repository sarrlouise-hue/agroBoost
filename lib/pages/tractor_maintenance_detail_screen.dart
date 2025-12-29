import 'package:flutter/material.dart';
import 'package:allotracteur/tractor_maintenance.dart';
import 'package:allotracteur/maintenance_record.dart';
import 'package:allotracteur/pages/add_maintenance_screen.dart';
import 'package:allotracteur/pages/maintenance_report_screen.dart';
import 'package:allotracteur/pages/maintenance_planning_screen.dart';
import 'package:allotracteur/components/maintenance_record_detail_sheet.dart';

class _OverviewTab extends StatelessWidget {
  const _OverviewTab({
    required this.tractor,
    required this.language,
  });

  final TractorMaintenance tractor;

  final String language;

  @override
  Widget build(BuildContext context) {
    final bool isWolof = language == 'wo';
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(20.0),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Theme.of(context).colorScheme.primary,
                  Theme.of(context).colorScheme.secondary,
                ],
              ),
              borderRadius: BorderRadius.circular(16.0),
            ),
            child: Column(
              children: [
                const Icon(Icons.check_circle, color: Colors.white, size: 48.0),
                const SizedBox(height: 12.0),
                Text(
                  isWolof ? 'Baax na' : 'Bon état',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 24.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16.0),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Column(
                      children: [
                        Icon(
                          Icons.speed,
                          color: Colors.white.withValues(alpha: 0.9),
                          size: 20.0,
                        ),
                        const SizedBox(height: 4.0),
                        Text(
                          '${tractor.currentEngineHours}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 18.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          isWolof ? 'Heures' : 'Heures',
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.9),
                            fontSize: 12.0,
                          ),
                        ),
                      ],
                    ),
                    Column(
                      children: [
                        Icon(
                          Icons.build,
                          color: Colors.white.withValues(alpha: 0.9),
                          size: 20.0,
                        ),
                        const SizedBox(height: 4.0),
                        Text(
                          '${tractor.totalMaintenanceCount}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 18.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          isWolof ? 'Entretiens' : 'Entretiens',
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.9),
                            fontSize: 12.0,
                          ),
                        ),
                      ],
                    ),
                    Column(
                      children: [
                        Icon(
                          Icons.calendar_today,
                          color: Colors.white.withValues(alpha: 0.9),
                          size: 20.0,
                        ),
                        const SizedBox(height: 4.0),
                        Text(
                          '${tractor.year}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 18.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          isWolof ? 'Année' : 'Année',
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.9),
                            fontSize: 12.0,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24.0),
          Text(
            isWolof ? 'Ndax entretien' : 'Prochain entretien',
            style: Theme.of(
              context,
            ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12.0),
          Container(
            padding: const EdgeInsets.all(20.0),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surfaceContainerHighest,
              borderRadius: BorderRadius.circular(16.0),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    const Icon(Icons.speed, size: 20.0),
                    const SizedBox(width: 8.0),
                    Text('${tractor.nextMaintenanceHours} heures'),
                    const Spacer(),
                    Text(
                      '${tractor.hoursUntilMaintenance} h restantes',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.primary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12.0),
                ClipRRect(
                  borderRadius: BorderRadius.circular(8.0),
                  child: LinearProgressIndicator(
                    value: tractor.currentEngineHours /
                        tractor.nextMaintenanceHours,
                    minHeight: 8.0,
                    backgroundColor: Theme.of(context).colorScheme.surface,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      Theme.of(context).colorScheme.primary,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class TractorMaintenanceDetailScreen extends StatefulWidget {
  const TractorMaintenanceDetailScreen({
    required this.tractor,
    required this.language,
    super.key,
  });

  final TractorMaintenance tractor;

  final String language;

  @override
  State<TractorMaintenanceDetailScreen> createState() {
    return _TractorMaintenanceDetailScreenState();
  }
}

class _TractorMaintenanceDetailScreenState
    extends State<TractorMaintenanceDetailScreen> {
  final List<MaintenanceRecord> _maintenanceRecords = [];

  @override
  void initState() {
    super.initState();
    _loadSampleData();
  }

  void _loadSampleData() {
    _maintenanceRecords.addAll([
      MaintenanceRecord(
        id: '1',
        tractorId: widget.tractor.id,
        tractorName: widget.tractor.name,
        date: DateTime.now().subtract(const Duration(days: 30)),
        type: 'Vidange',
        title: 'Vidange moteur complète',
        description: 'Changement huile moteur et filtre à huile',
        cost: 75000.0,
        engineHours: widget.tractor.currentEngineHours - 50,
        technician: 'Moussa Diop',
        partsReplaced: ['Filtre à huile', 'Huile moteur 10L'],
        status: 'Terminé',
        imageUrl:
            'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800',
      ),
      MaintenanceRecord(
        id: '2',
        tractorId: widget.tractor.id,
        tractorName: widget.tractor.name,
        date: DateTime.now().subtract(const Duration(days: 90)),
        type: 'Révision',
        title: 'Révision complète',
        description: 'Contrôle général du tracteur',
        cost: 150000.0,
        engineHours: widget.tractor.currentEngineHours - 150,
        technician: 'Amadou Seck',
        partsReplaced: ['Filtre à air', 'Courroie'],
        status: 'Terminé',
      ),
    ]);
  }

  Future<void> _addMaintenance() async {
    final result = await Navigator.push<MaintenanceRecord>(
      context,
      MaterialPageRoute(
        builder: (context) => AddMaintenanceScreen(tractor: widget.tractor),
      ),
    );
    if (result != null) {
      setState(() {
        _maintenanceRecords.insert(0, result);
      });
    }
  }

  void _openReport() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MaintenanceReportScreen(
          tractor: widget.tractor,
          maintenances: _maintenanceRecords,
        ),
      ),
    );
  }

  void _openPlanning() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const MaintenancePlanningScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isWolof = widget.language == 'wo';
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(widget.tractor.name),
              Text(
                '${widget.tractor.model} • ${widget.tractor.year}',
                style: const TextStyle(fontSize: 12.0),
              ),
            ],
          ),
          actions: [
            IconButton(
              onPressed: _openPlanning,
              icon: const Icon(Icons.calendar_month),
              tooltip: isWolof ? 'Planning' : 'Planning',
            ),
            IconButton(
              onPressed: _openReport,
              icon: const Icon(Icons.picture_as_pdf),
              tooltip: isWolof ? 'Rapport' : 'Rapport',
            ),
          ],
          bottom: TabBar(
            tabs: [
              Tab(text: isWolof ? 'Vue d\'ensemble' : 'Vue d\'ensemble'),
              Tab(text: isWolof ? 'Historique' : 'Historique'),
              Tab(text: isWolof ? 'Planning' : 'Planning'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _OverviewTab(tractor: widget.tractor, language: widget.language),
            _HistoryTab(
              language: widget.language,
              maintenanceRecords: _maintenanceRecords,
            ),
            _PlanningTab(
              language: widget.language,
              onOpenFullPlanning: _openPlanning,
            ),
          ],
        ),
        floatingActionButton: FloatingActionButton.extended(
          onPressed: _addMaintenance,
          backgroundColor: const Color(0xffe56d4b),
          icon: const Icon(Icons.add, color: Colors.white),
          label: Text(
            isWolof ? 'Yokk entretien' : 'Ajouter entretien',
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}

class _HistoryTab extends StatelessWidget {
  const _HistoryTab({
    required this.language,
    required this.maintenanceRecords,
  });

  final String language;

  final List<MaintenanceRecord> maintenanceRecords;

  @override
  Widget build(BuildContext context) {
    final bool isWolof = language == 'wo';
    if (maintenanceRecords.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.history,
              size: 80.0,
              color: Theme.of(
                context,
              ).colorScheme.primary.withValues(alpha: 0.5),
            ),
            const SizedBox(height: 16.0),
            Text(
              isWolof ? 'Amul historique' : 'Aucun historique',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8.0),
            Text(
              isWolof
                  ? 'Yokk entretien bu njëkk'
                  : 'Ajoutez votre premier entretien',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
          ],
        ),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: maintenanceRecords.length,
      itemBuilder: (context, index) {
        final record = maintenanceRecords[index];
        Color typeColor = const Color(0xffe56d4b);
        if (record.type == 'Réparation') {
          typeColor = Colors.red;
        } else {
          if (record.type == 'Vidange') {
            typeColor = Colors.blue;
          } else {
            if (record.type == 'Révision') {
              typeColor = Colors.orange;
            }
          }
        }
        return Card(
          margin: const EdgeInsets.only(bottom: 12.0),
          elevation: 0.0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16.0),
            side: BorderSide(
              color: Theme.of(context).colorScheme.outlineVariant,
            ),
          ),
          child: InkWell(
            onTap: () {
              showModalBottomSheet(
                context: context,
                backgroundColor: Colors.transparent,
                isScrollControlled: true,
                builder: (context) => MaintenanceRecordDetailSheet(
                  record: record,
                  language: language,
                ),
              );
            },
            borderRadius: BorderRadius.circular(16.0),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8.0),
                        decoration: BoxDecoration(
                          color: typeColor.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(8.0),
                        ),
                        child: Icon(
                          Icons.build_circle,
                          color: typeColor,
                          size: 20.0,
                        ),
                      ),
                      const SizedBox(width: 12.0),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              record.title,
                              style: Theme.of(context)
                                  .textTheme
                                  .titleMedium
                                  ?.copyWith(fontWeight: FontWeight.bold),
                            ),
                            Text(
                              record.type,
                              style: TextStyle(
                                color: typeColor,
                                fontSize: 12.0,
                                fontWeight: FontWeight.w600,
                              ),
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
                          color: record.status == 'Terminé'
                              ? Colors.green.withValues(alpha: 0.2)
                              : Colors.orange.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                        child: Text(
                          record.status,
                          style: TextStyle(
                            color: record.status == 'Terminé'
                                ? Colors.green
                                : Colors.orange,
                            fontSize: 12.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12.0),
                  Row(
                    children: [
                      Icon(
                        Icons.calendar_today,
                        size: 16.0,
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                      const SizedBox(width: 4.0),
                      Text(
                        '${record.date.day}/${record.date.month}/${record.date.year}',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Theme.of(context)
                                  .colorScheme
                                  .onSurfaceVariant,
                            ),
                      ),
                      const SizedBox(width: 16.0),
                      Icon(
                        Icons.access_time,
                        size: 16.0,
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                      const SizedBox(width: 4.0),
                      Text(
                        '${record.engineHours}h',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Theme.of(context)
                                  .colorScheme
                                  .onSurfaceVariant,
                            ),
                      ),
                      const Spacer(),
                      Text(
                        '${record.cost.toStringAsFixed(0)} FCFA',
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                      ),
                    ],
                  ),
                  if (record.partsReplaced.isNotEmpty) ...[
                    const SizedBox(height: 8.0),
                    Wrap(
                      spacing: 4.0,
                      runSpacing: 4.0,
                      children: record.partsReplaced
                          .take(3)
                          .map(
                            (part) => Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8.0,
                                vertical: 4.0,
                              ),
                              decoration: BoxDecoration(
                                color: Theme.of(context)
                                    .colorScheme
                                    .primaryContainer
                                    .withValues(alpha: 0.5),
                                borderRadius: BorderRadius.circular(8.0),
                              ),
                              child: Text(
                                part,
                                style: TextStyle(
                                  fontSize: 10.0,
                                  color: Theme.of(
                                    context,
                                  ).colorScheme.onSurfaceVariant,
                                ),
                              ),
                            ),
                          )
                          .toList(),
                    ),
                  ],
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

class _PlanningTab extends StatelessWidget {
  const _PlanningTab({
    required this.language,
    required this.onOpenFullPlanning,
  });

  final String language;

  final void Function() onOpenFullPlanning;

  @override
  Widget build(BuildContext context) {
    final bool isWolof = language == 'wo';
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24.0),
              decoration: BoxDecoration(
                color: const Color(0xffe56d4b).withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.calendar_month,
                size: 80.0,
                color: Color(0xffe56d4b),
              ),
            ),
            const SizedBox(height: 24.0),
            Text(
              isWolof ? 'Planning bi Entretien' : 'Planning d\'Entretien',
              style: Theme.of(
                context,
              ).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12.0),
            Text(
              isWolof
                  ? 'Gis bu baax planning bi entretien yu planifie'
                  : 'Visualisez le calendrier complet des entretiens planifiés',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32.0),
            ElevatedButton.icon(
              onPressed: onOpenFullPlanning,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xffe56d4b),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 32.0,
                  vertical: 16.0,
                ),
              ),
              icon: const Icon(Icons.calendar_month),
              label: Text(
                isWolof ? 'Ubbeeku Planning' : 'Ouvrir le Planning',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
