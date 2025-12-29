import 'package:flutter/material.dart';
import 'package:allotracteur/maintenance_alert.dart';
import 'package:allotracteur/components/maintenance_detail_modal.dart';

class MaintenancePlanningScreen extends StatefulWidget {
  const MaintenancePlanningScreen({super.key});

  @override
  State<MaintenancePlanningScreen> createState() {
    return _MaintenancePlanningScreenState();
  }
}

class _MaintenancePlanningScreenState extends State<MaintenancePlanningScreen> {
  DateTime _selectedDate = DateTime.now();

  DateTime _focusedDate = DateTime.now();

  late final Map<String, List<MaintenanceAlert>> _scheduledMaintenances;

  Color _getPriorityColor(String priority) {
    if (priority == 'critique') {
      return const Color(0xffd32f2f);
    } else {
      if (priority == 'haute') {
        return const Color(0xfff57c00);
      } else {
        if (priority == 'moyenne') {
          return const Color(0xff1976d2);
        } else {
          return const Color(0xff388e3c);
        }
      }
    }
  }

  void _showMaintenanceDetails(MaintenanceAlert maintenance) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) => MaintenanceDetailModal(
        maintenance: maintenance,
        getPriorityColor: _getPriorityColor,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final selectedMaintenances = _getMaintenancesForDay(_selectedDate);
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Planning Entretien'),
            Text(
              'Planning bi Entretien',
              style: TextStyle(fontSize: 12.0, fontStyle: FontStyle.italic),
            ),
          ],
        ),
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0.0,
      ),
      body: Column(
        children: [
          Container(
            margin: const EdgeInsets.all(16.0),
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surfaceContainerHighest,
              borderRadius: BorderRadius.circular(16.0),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    IconButton(
                      onPressed: () {
                        setState(() {
                          _focusedDate = DateTime(
                            _focusedDate.year,
                            _focusedDate.month - 1,
                          );
                        });
                      },
                      icon: const Icon(Icons.chevron_left),
                    ),
                    Text(
                      '${_getMonthName(_focusedDate.month)} ${_focusedDate.year}',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    IconButton(
                      onPressed: () {
                        setState(() {
                          _focusedDate = DateTime(
                            _focusedDate.year,
                            _focusedDate.month + 1,
                          );
                        });
                      },
                      icon: const Icon(Icons.chevron_right),
                    ),
                  ],
                ),
                const SizedBox(height: 16.0),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 7,
                    mainAxisSpacing: 8.0,
                    crossAxisSpacing: 8.0,
                  ),
                  itemCount: 35,
                  itemBuilder: (context, index) {
                    final firstDayOfMonth = DateTime(
                      _focusedDate.year,
                      _focusedDate.month,
                      1,
                    );
                    final startDay = firstDayOfMonth.weekday % 7;
                    final dayNumber = index - startDay + 1;
                    final daysInMonth = DateTime(
                      _focusedDate.year,
                      _focusedDate.month + 1,
                      0,
                    ).day;
                    if (dayNumber < 1 || dayNumber > daysInMonth) {
                      return Container();
                    }
                    final date = DateTime(
                      _focusedDate.year,
                      _focusedDate.month,
                      dayNumber,
                    );
                    final isSelected = date.day == _selectedDate.day &&
                        date.month == _selectedDate.month &&
                        date.year == _selectedDate.year;
                    final hasMaintenance = _hasMaintenanceOnDay(date);
                    return InkWell(
                      onTap: () {
                        setState(() {
                          _selectedDate = date;
                        });
                      },
                      borderRadius: BorderRadius.circular(8.0),
                      child: Container(
                        decoration: BoxDecoration(
                          color: isSelected
                              ? const Color(0xffe56d4b)
                              : hasMaintenance
                                  ? const Color(0xffe56d4b)
                                      .withValues(alpha: 0.2)
                                  : Colors.transparent,
                          borderRadius: BorderRadius.circular(8.0),
                        ),
                        child: Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                '$dayNumber',
                                style: TextStyle(
                                  color: isSelected
                                      ? Colors.white
                                      : Theme.of(context).colorScheme.onSurface,
                                  fontWeight: isSelected || hasMaintenance
                                      ? FontWeight.bold
                                      : FontWeight.normal,
                                ),
                              ),
                              if (hasMaintenance)
                                Container(
                                  margin: const EdgeInsets.only(top: 2.0),
                                  width: 4.0,
                                  height: 4.0,
                                  decoration: BoxDecoration(
                                    color: isSelected
                                        ? Colors.white
                                        : const Color(0xffe56d4b),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              children: [
                Icon(
                  Icons.event_note,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(width: 8.0),
                Text(
                  'Entretiens du ${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16.0),
          Expanded(
            child: selectedMaintenances.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.event_available,
                          size: 64.0,
                          color: Theme.of(context).colorScheme.outlineVariant,
                        ),
                        const SizedBox(height: 16.0),
                        Text(
                          'Aucun entretien prévu',
                          style:
                              Theme.of(context).textTheme.titleMedium?.copyWith(
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.onSurfaceVariant,
                                  ),
                        ),
                        Text(
                          'Amul entretien bu planifie',
                          style:
                              Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    color: Theme.of(context)
                                        .colorScheme
                                        .onSurfaceVariant
                                        .withValues(alpha: 0.7),
                                    fontStyle: FontStyle.italic,
                                  ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16.0, 0.0, 16.0, 32.0),
                    itemCount: selectedMaintenances.length,
                    itemBuilder: (context, index) {
                      final maintenance = selectedMaintenances[index];
                      final priorityColor = _getPriorityColor(
                        maintenance.priority,
                      );
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12.0),
                        elevation: 0.0,
                        color: priorityColor.withValues(alpha: 0.1),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16.0),
                          side: BorderSide(
                            color: priorityColor.withValues(alpha: 0.3),
                            width: 1.0,
                          ),
                        ),
                        child: InkWell(
                          onTap: () => _showMaintenanceDetails(maintenance),
                          borderRadius: BorderRadius.circular(16.0),
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Row(
                              children: [
                                Container(
                                  width: 4.0,
                                  height: 60.0,
                                  decoration: BoxDecoration(
                                    color: priorityColor,
                                    borderRadius: BorderRadius.circular(2.0),
                                  ),
                                ),
                                const SizedBox(width: 16.0),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        maintenance.title,
                                        style: Theme.of(context)
                                            .textTheme
                                            .titleMedium
                                            ?.copyWith(
                                              fontWeight: FontWeight.bold,
                                            ),
                                      ),
                                      const SizedBox(height: 4.0),
                                      Text(
                                        maintenance.tractorName,
                                        style: Theme.of(context)
                                            .textTheme
                                            .bodyMedium
                                            ?.copyWith(
                                              color: Theme.of(
                                                context,
                                              ).colorScheme.onSurfaceVariant,
                                            ),
                                      ),
                                      const SizedBox(height: 8.0),
                                      Row(
                                        children: [
                                          Icon(
                                            Icons.build_circle,
                                            size: 16.0,
                                            color: priorityColor,
                                          ),
                                          const SizedBox(width: 4.0),
                                          Text(
                                            maintenance.type,
                                            style: TextStyle(
                                              fontSize: 12.0,
                                              color: priorityColor,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                                Icon(Icons.chevron_right, color: priorityColor),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  String _getMonthName(int month) {
    const months = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];
    return months[month - 1];
  }

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    final date1 = DateTime(now.year, now.month, 5);
    final date2 = DateTime(now.year, now.month, 15);
    final date3 = DateTime(now.year, now.month, 25);
    _scheduledMaintenances = {
      _dateToKey(date1): [
        MaintenanceAlert(
          id: '1',
          tractorId: 'T1',
          tractorName: 'John Deere 6155R',
          type: 'Vidange',
          title: 'Vidange moteur',
          description: 'Changement huile moteur + filtre',
          dueDate: date1,
          targetEngineHours: 500,
          priority: 'haute',
        ),
      ],
      _dateToKey(date2): [
        MaintenanceAlert(
          id: '2',
          tractorId: 'T2',
          tractorName: 'Massey Ferguson 7726',
          type: 'Révision',
          title: 'Révision complète',
          description: 'Contrôle général du tracteur',
          dueDate: date2,
          targetEngineHours: 1000,
          priority: 'moyenne',
        ),
      ],
      _dateToKey(date3): [
        MaintenanceAlert(
          id: '3',
          tractorId: 'T3',
          tractorName: 'Fendt 724',
          type: 'Réparation',
          title: 'Réparation hydraulique',
          description: 'Problème circuit hydraulique',
          dueDate: date3,
          targetEngineHours: 750,
          priority: 'critique',
        ),
      ],
    };
  }

  String _dateToKey(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }

  List<MaintenanceAlert> _getMaintenancesForDay(DateTime day) {
    final key = _dateToKey(day);
    return _scheduledMaintenances[key] ?? [];
  }

  bool _hasMaintenanceOnDay(DateTime day) {
    return _getMaintenancesForDay(day).isNotEmpty;
  }
}
