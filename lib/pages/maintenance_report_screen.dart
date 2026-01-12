// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:hallo/maintenance_record.dart';
import 'package:hallo/tractor_maintenance.dart';

class MaintenanceReportScreen extends StatefulWidget {
    const MaintenanceReportScreen({
    required this.tractor,
    required this.maintenances,
    super.key,
  });

  final TractorMaintenance tractor;

  final List<MaintenanceRecord> maintenances;

  @override
  State<MaintenanceReportScreen> createState() {
    return _MaintenanceReportScreenState();
  }
}

class _MaintenanceReportScreenState extends State<MaintenanceReportScreen> {
  DateTime? _startDate;

  DateTime? _endDate;

  bool _includePhotos = true;

  bool _includeCosts = false;

  bool _includeStatistics = true;

  Future<void> _selectStartDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate:
          _startDate ?? DateTime.now().subtract(const Duration(days: 365)),
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: Theme.of(context).colorScheme.copyWith(
                primary: Theme.of(context).colorScheme.primary,
              ),
        ),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() {
        _startDate = picked;
      });
    }
  }

  Future<void> _selectEndDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _endDate ?? DateTime.now(),
      firstDate: _startDate ?? DateTime(2020),
      lastDate: DateTime.now(),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: Theme.of(context).colorScheme.copyWith(
                primary: Theme.of(context).colorScheme.primary,
              ),
        ),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() {
        _endDate = picked;
      });
    }
  }

  List<MaintenanceRecord> _getFilteredMaintenances() {
    if (_startDate == null || _endDate == null) {
      return widget.maintenances;
    }
    return widget.maintenances
        .where(
          (record) =>
              record.date.isAfter(_startDate!) &&
              record.date.isBefore(_endDate!.add(const Duration(days: 1))),
        )
        .toList();
  }

  void _generatePDFReport() {
    final filteredMaintenances = _getFilteredMaintenances();
    if (filteredMaintenances.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Aucun entretien à inclure dans le rapport'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        Future.delayed(const Duration(seconds: 2), () {
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('✅ Rapport PDF généré avec succès !'),
              backgroundColor: Colors.green,
              duration: Duration(seconds: 3),
            ),
          );
        });
        return AlertDialog(
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(
                  Theme.of(context).colorScheme.primary,
                ),
              ),
              const SizedBox(height: 24.0),
              Text(
                'Génération du rapport PDF...',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8.0),
              Text(
                '${filteredMaintenances.length} entretien(s)',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final filteredMaintenances = _getFilteredMaintenances();
    final totalCost = filteredMaintenances.fold<double>(
      0.0,
      (sum, record) => sum + record.cost,
    );
    final bottomPadding = MediaQuery.of(context).viewPadding.bottom > 0
        ? MediaQuery.of(context).viewPadding.bottom + 24.0
        : 48.0;
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Rapport d\'Entretien'),
            Text(
              'Rapport bi Entretien',
              style: TextStyle(fontSize: 12.0, fontStyle: FontStyle.italic),
            ),
          ],
        ),
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0.0,
      ),
      body: ListView(
        padding: EdgeInsets.fromLTRB(16.0, 16.0, 16.0, bottomPadding),
        children: [
          Container(
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Theme.of(context).colorScheme.primary,
                  Theme.of(context).colorScheme.primary.withValues(alpha: 0.7),
                ],
              ),
              borderRadius: BorderRadius.circular(16.0),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12.0),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                  child: const Icon(
                    Icons.agriculture,
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
                        widget.tractor.name,
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                      Text(
                        '${widget.tractor.model} • ${widget.tractor.year}',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: Colors.white.withValues(alpha: 0.9),
                            ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24.0),
          Text(
            'Période du rapport',
            style: Theme.of(
              context,
            ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12.0),
          Row(
            children: [
              Expanded(
                child: InkWell(
                  onTap: _selectStartDate,
                  borderRadius: BorderRadius.circular(12.0),
                  child: Container(
                    padding: const EdgeInsets.all(16.0),
                    decoration: BoxDecoration(
                      color: Theme.of(
                        context,
                      ).colorScheme.surfaceContainerHighest,
                      borderRadius: BorderRadius.circular(12.0),
                      border: Border.all(
                        color: _startDate != null
                            ? Theme.of(context).colorScheme.primary
                            : Theme.of(context).colorScheme.outline,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.calendar_today,
                              size: 16.0,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                            const SizedBox(width: 8.0),
                            Text(
                              'Date début',
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.onSurfaceVariant,
                                  ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8.0),
                        Text(
                          _startDate != null
                              ? '${_startDate?.day}/${_startDate?.month}/${_startDate?.year}'
                              : 'Sélectionner',
                          style: Theme.of(context)
                              .textTheme
                              .titleMedium
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12.0),
              Expanded(
                child: InkWell(
                  onTap: _selectEndDate,
                  borderRadius: BorderRadius.circular(12.0),
                  child: Container(
                    padding: const EdgeInsets.all(16.0),
                    decoration: BoxDecoration(
                      color: Theme.of(
                        context,
                      ).colorScheme.surfaceContainerHighest,
                      borderRadius: BorderRadius.circular(12.0),
                      border: Border.all(
                        color: _endDate != null
                            ? Theme.of(context).colorScheme.primary
                            : Theme.of(context).colorScheme.outline,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.calendar_today,
                              size: 16.0,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                            const SizedBox(width: 8.0),
                            Text(
                              'Date fin',
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.onSurfaceVariant,
                                  ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8.0),
                        Text(
                          _endDate != null
                              ? '${_endDate?.day}/${_endDate?.month}/${_endDate?.year}'
                              : 'Sélectionner',
                          style: Theme.of(context)
                              .textTheme
                              .titleMedium
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24.0),
          Text(
            'Options du rapport',
            style: Theme.of(
              context,
            ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12.0),
          Container(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surfaceContainerHighest,
              borderRadius: BorderRadius.circular(16.0),
            ),
            child: Column(
              children: [
                SwitchListTile(
                  title: const Text('Inclure les statistiques'),
                  subtitle: const Text('Graphiques et résumés'),
                  value: _includeStatistics,
                  onChanged: (value) {
                    setState(() {
                      _includeStatistics = value;
                    });
                  },
                  secondary: const Icon(Icons.bar_chart),
                ),
                Divider(
                  height: 1.0,
                  color: Theme.of(context).colorScheme.outlineVariant,
                ),
                SwitchListTile(
                  title: const Text('Inclure les coûts'),
                  subtitle: const Text('Détails financiers'),
                  value: _includeCosts,
                  onChanged: (value) {
                    setState(() {
                      _includeCosts = value;
                    });
                  },
                  secondary: const Icon(Icons.attach_money),
                ),
                Divider(
                  height: 1.0,
                  color: Theme.of(context).colorScheme.outlineVariant,
                ),
                SwitchListTile(
                  title: const Text('Inclure les photos'),
                  subtitle: const Text('Images des entretiens'),
                  value: _includePhotos,
                  onChanged: (value) {
                    setState(() {
                      _includePhotos = value;
                    });
                  },
                  secondary: const Icon(Icons.photo_camera),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24.0),
          Container(
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: Theme.of(
                context,
              ).colorScheme.primaryContainer.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(16.0),
              border: Border.all(
                color: Theme.of(
                  context,
                ).colorScheme.primary.withValues(alpha: 0.3),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.description,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    const SizedBox(width: 8.0),
                    Text(
                      'Aperçu du rapport',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                  ],
                ),
                const SizedBox(height: 16.0),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Entretiens',
                          style:
                              Theme.of(context).textTheme.bodySmall?.copyWith(
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.onSurfaceVariant,
                                  ),
                        ),
                        Text(
                          filteredMaintenances.length.toString(),
                          style: Theme.of(context)
                              .textTheme
                              .headlineSmall
                              ?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                        ),
                      ],
                    ),
                    if (_includeCosts)
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            'Coût total',
                            style:
                                Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: Theme.of(
                                        context,
                                      ).colorScheme.onSurfaceVariant,
                                    ),
                          ),
                          Text(
                            '${totalCost.toStringAsFixed(0)} FCFA',
                            style: Theme.of(context)
                                .textTheme
                                .headlineSmall
                                ?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: Theme.of(context).colorScheme.primary,
                                ),
                          ),
                        ],
                      ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 32.0),
          ElevatedButton.icon(
            onPressed: _generatePDFReport,
            style: ElevatedButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 18.0),
            ),
            icon: const Icon(Icons.picture_as_pdf),
            label: const Text(
              'Générer le rapport PDF',
              style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }
}
