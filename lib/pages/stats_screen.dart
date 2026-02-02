import 'package:flutter/material.dart';
class StatsScreen extends StatefulWidget {
    const StatsScreen({required this.language, super.key});

  final String language;

  @override
  State<StatsScreen> createState() {
    return _StatsScreenState();
  }
}

class _StatsScreenState extends State<StatsScreen> {
  String _selectedPeriod = 'Décembre 2024';

  int _selectedMonth = 12;

  int _selectedYear = 2024;

  bool _showGraph = false;

  final List<String> _months = [
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

  final Map<String, dynamic> _servicesData = {
    'Labour': {
      'count': 45,
      'color': const Color(0xffe56d4b),
      'icon': Icons.agriculture,
    },
    'Offset': {
      'count': 32,
      'color': const Color(0xffff9800),
      'icon': Icons.cached,
    },
    'Reprofilage': {
      'count': 18,
      'color': const Color(0xff2196f3),
      'icon': Icons.terrain,
    },
    'Transport': {
      'count': 28,
      'color': const Color(0xff9c27b0),
      'icon': Icons.local_shipping,
    },
    'Semis': {
      'count': 22,
      'color': const Color(0xff4caf50),
      'icon': Icons.grass,
    },
    'Récolte': {
      'count': 35,
      'color': const Color(0xffff5722),
      'icon': Icons.spa,
    },
  };

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) {
        setState(() {
          _showGraph = true;
        });
      }
    });
  }

  void _showPeriodPicker() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20.0)),
        ),
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              margin: const EdgeInsets.only(bottom: 16.0),
              width: 40.0,
              height: 4.0,
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.outline,
                borderRadius: BorderRadius.circular(2.0),
              ),
            ),
            Text(
              widget.language == 'wo'
                  ? 'Tànnal période'
                  : 'Sélectionner la période',
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24.0),
            SizedBox(
              height: 200.0,
              child: Row(
                children: [
                  Expanded(
                    child: ListWheelScrollView.useDelegate(
                      itemExtent: 50.0,
                      perspective: 0.005,
                      diameterRatio: 1.2,
                      physics: const FixedExtentScrollPhysics(),
                      onSelectedItemChanged: (index) {
                        _selectedMonth = index + 1;
                      },
                      childDelegate: ListWheelChildBuilderDelegate(
                        childCount: _months.length,
                        builder: (context, index) {
                          final isSelected = index + 1 == _selectedMonth;
                          return Center(
                            child: Text(
                              _months[index],
                              style: TextStyle(
                                fontSize: isSelected ? 20.0 : 16.0,
                                fontWeight: isSelected
                                    ? FontWeight.bold
                                    : FontWeight.normal,
                                color: isSelected
                                    ? Theme.of(context).colorScheme.primary
                                    : Theme.of(
                                        context,
                                      ).colorScheme.onSurfaceVariant,
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                  Expanded(
                    child: ListWheelScrollView.useDelegate(
                      itemExtent: 50.0,
                      perspective: 0.005,
                      diameterRatio: 1.2,
                      physics: const FixedExtentScrollPhysics(),
                      onSelectedItemChanged: (index) {
                        _selectedYear = 2020 + index;
                      },
                      childDelegate: ListWheelChildBuilderDelegate(
                        childCount: 10,
                        builder: (context, index) {
                          final year = 2020 + index;
                          final isSelected = year == _selectedYear;
                          return Center(
                            child: Text(
                              year.toString(),
                              style: TextStyle(
                                fontSize: isSelected ? 20.0 : 16.0,
                                fontWeight: isSelected
                                    ? FontWeight.bold
                                    : FontWeight.normal,
                                color: isSelected
                                    ? Theme.of(context).colorScheme.primary
                                    : Theme.of(
                                        context,
                                      ).colorScheme.onSurfaceVariant,
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24.0),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () {
                  setState(() {
                    _selectedPeriod =
                        '${_months[_selectedMonth - 1]} $_selectedYear';
                    _showGraph = false;
                  });
                  Navigator.pop(context);
                  Future.delayed(const Duration(milliseconds: 100), () {
                    if (mounted) {
                      setState(() {
                        _showGraph = true;
                      });
                    }
                  });
                },
                style: FilledButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                ),
                child: Text(
                  widget.language == 'wo' ? 'Dëgg' : 'Valider',
                  style: const TextStyle(color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<double> _getMonthlyData() {
    return [
      45.0,
      52.0,
      38.0,
      65.0,
      48.0,
      71.0,
      58.0,
      42.0,
      55.0,
      68.0,
      50.0,
      62.0,
    ];
  }

  @override
  Widget build(BuildContext context) {
    final bool isWolof = widget.language == 'wo';
    final monthlyData = _getMonthlyData();
    final maxValue = monthlyData.reduce((a, b) => a > b ? a : b);
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        elevation: 0.0,
        backgroundColor: Theme.of(context).colorScheme.surface,
        title: Text(
          isWolof ? 'Statistiques' : 'Statistiques',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(24.0, 8.0, 24.0, 80.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              padding: const EdgeInsets.all(20.0),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Theme.of(
                      context,
                    ).colorScheme.primaryContainer.withValues(alpha: 0.4),
                    Theme.of(
                      context,
                    ).colorScheme.secondaryContainer.withValues(alpha: 0.3),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16.0),
                border: Border.all(
                  color: Theme.of(
                    context,
                  ).colorScheme.primary.withValues(alpha: 0.3),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Theme.of(
                      context,
                    ).colorScheme.primary.withValues(alpha: 0.1),
                    blurRadius: 12.0,
                    offset: const Offset(0.0, 4.0),
                  ),
                ],
              ),
              child: InkWell(
                onTap: _showPeriodPicker,
                borderRadius: BorderRadius.circular(16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10.0),
                          decoration: BoxDecoration(
                            color: Theme.of(
                              context,
                            ).colorScheme.primary.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(10.0),
                          ),
                          child: Icon(
                            Icons.calendar_today_rounded,
                            color: Theme.of(context).colorScheme.primary,
                            size: 18.0,
                          ),
                        ),
                        const SizedBox(width: 12.0),
                        Text(
                          isWolof
                              ? 'Période: $_selectedPeriod'
                              : 'Période: $_selectedPeriod',
                          style: Theme.of(context)
                              .textTheme
                              .bodyLarge
                              ?.copyWith(fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                    Icon(
                      Icons.arrow_drop_down_rounded,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32.0),
            Text(
              isWolof ? 'Vue d\'ensemble' : 'Vue d\'ensemble',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    fontSize: 20.0,
                  ),
            ),
            const SizedBox(height: 20.0),
            _buildCleanStatRow(
              context,
              'Nouveaux utilisateurs',
              '23',
              Icons.person_add_rounded,
              const Color(0xff4caf50),
              '+15%',
            ),
            const SizedBox(height: 14.0),
            _buildCleanStatRow(
              context,
              'Tracteurs ajoutés',
              '8',
              Icons.agriculture_rounded,
              const Color(0xff2196f3),
              '+12%',
            ),
            const SizedBox(height: 14.0),
            _buildCleanStatRow(
              context,
              'Réservations',
              '45',
              Icons.event_available_rounded,
              const Color(0xffe56d4b),
              '+25%',
            ),
            const SizedBox(height: 14.0),
            _buildCleanStatRow(
              context,
              'Revenu total',
              '2.4M FCFA',
              Icons.payments_rounded,
              const Color(0xff2d5016),
              '+18%',
            ),
            const SizedBox(height: 36.0),
            Text(
              isWolof ? 'Évolution mensuelle' : 'Évolution mensuelle',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    fontSize: 20.0,
                  ),
            ),
            const SizedBox(height: 20.0),
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              height: 280.0,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Theme.of(context).colorScheme.surface,
                    Theme.of(context).colorScheme.surfaceContainerHighest,
                  ],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                borderRadius: BorderRadius.circular(16.0),
                border: Border.all(
                  color: Theme.of(context).colorScheme.outlineVariant,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Theme.of(
                      context,
                    ).colorScheme.primary.withValues(alpha: 0.05),
                    blurRadius: 12.0,
                    offset: const Offset(0.0, 4.0),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        isWolof ? 'Réservations' : 'Réservations',
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                              color: Theme.of(context)
                                  .colorScheme
                                  .onSurfaceVariant,
                              fontWeight: FontWeight.w600,
                            ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12.0,
                          vertical: 6.0,
                        ),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.primaryContainer,
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.trending_up,
                              size: 14.0,
                              color: Theme.of(
                                context,
                              ).colorScheme.onPrimaryContainer,
                            ),
                            const SizedBox(width: 4.0),
                            Text(
                              '+12%',
                              style: TextStyle(
                                fontSize: 12.0,
                                fontWeight: FontWeight.bold,
                                color: Theme.of(
                                  context,
                                ).colorScheme.onPrimaryContainer,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20.0),
                  Expanded(
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: List.generate(12, (index) {
                        final value = monthlyData[index];
                        final heightFactor = value / maxValue;
                        final isCurrentMonth = index + 1 == _selectedMonth;
                        return Expanded(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 3.0,
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                if (isCurrentMonth)
                                  AnimatedOpacity(
                                    duration: const Duration(milliseconds: 500),
                                    opacity: _showGraph ? 1.0 : 0.0,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 4.0,
                                        vertical: 2.0,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Theme.of(
                                          context,
                                        ).colorScheme.primary,
                                        borderRadius: BorderRadius.circular(
                                          4.0,
                                        ),
                                      ),
                                      child: Text(
                                        value.toInt().toString(),
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 9.0,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ),
                                if (isCurrentMonth) const SizedBox(height: 4.0),
                                Expanded(
                                  child: AnimatedContainer(
                                    duration: Duration(
                                      milliseconds: 600 + (index * 50),
                                    ),
                                    curve: Curves.easeOutCubic,
                                    height:
                                        _showGraph ? heightFactor * 150 : 0.0,
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: isCurrentMonth
                                            ? [
                                                Theme.of(
                                                  context,
                                                ).colorScheme.primary,
                                                Theme.of(
                                                  context,
                                                ).colorScheme.secondary,
                                              ]
                                            : [
                                                Theme.of(context)
                                                    .colorScheme
                                                    .primary
                                                    .withValues(alpha: 0.4),
                                                Theme.of(context)
                                                    .colorScheme
                                                    .primary
                                                    .withValues(alpha: 0.2),
                                              ],
                                        begin: Alignment.topCenter,
                                        end: Alignment.bottomCenter,
                                      ),
                                      borderRadius: const BorderRadius.vertical(
                                        top: Radius.circular(4.0),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 8.0),
                                Text(
                                  _months[index].substring(0, 1),
                                  style: TextStyle(
                                    fontSize: 10.0,
                                    fontWeight: isCurrentMonth
                                        ? FontWeight.bold
                                        : FontWeight.normal,
                                    color: isCurrentMonth
                                        ? Theme.of(context).colorScheme.primary
                                        : Theme.of(
                                            context,
                                          ).colorScheme.onSurfaceVariant,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 36.0),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  isWolof ? 'Services populaires' : 'Services populaires',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                        fontSize: 20.0,
                      ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12.0,
                    vertical: 6.0,
                  ),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.secondaryContainer,
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                  child: Text(
                    '${_servicesData.length}',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.onSecondaryContainer,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20.0),
            ..._servicesData.entries.map(
              (entry) => Padding(
                padding: const EdgeInsets.only(bottom: 14.0),
                child: _buildServiceRankCard(
                  entry.key,
                  entry.value['count'] as int,
                  entry.value['color'] as Color,
                  entry.value['icon'] as IconData,
                ),
              ),
            ),
            const SizedBox(height: 40.0),
          ],
        ),
      ),
    );
  }

  Widget _buildCleanStatRow(
    BuildContext context,
    String label,
    String value,
    IconData icon,
    Color color,
    String percentage,
  ) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      padding: const EdgeInsets.all(18.0),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            color.withValues(alpha: 0.08),
            color.withValues(alpha: 0.04),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: color.withValues(alpha: 0.2)),
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.1),
            blurRadius: 8.0,
            offset: const Offset(0.0, 2.0),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12.0),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(12.0),
            ),
            child: Icon(icon, color: color, size: 24.0),
          ),
          const SizedBox(width: 16.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                        fontSize: 13.0,
                      ),
                ),
                const SizedBox(height: 6.0),
                Text(
                  value,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 10.0,
              vertical: 6.0,
            ),
            decoration: BoxDecoration(
              color: const Color(0xff4caf50).withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(10.0),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.trending_up_rounded,
                  color: Color(0xff4caf50),
                  size: 14.0,
                ),
                const SizedBox(width: 4.0),
                Text(
                  percentage,
                  style: const TextStyle(
                    fontSize: 12.0,
                    fontWeight: FontWeight.bold,
                    color: Color(0xff4caf50),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildServiceRankCard(
    String service,
    int count,
    Color color,
    IconData icon,
  ) {
    final maxCount = _servicesData.values
        .map((v) => v['count'] as int)
        .reduce((a, b) => a > b ? a : b);
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      padding: const EdgeInsets.all(18.0),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            color.withValues(alpha: 0.08),
            color.withValues(alpha: 0.04),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(14.0),
        border: Border.all(color: color.withValues(alpha: 0.2)),
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.1),
            blurRadius: 8.0,
            offset: const Offset(0.0, 2.0),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10.0),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(10.0),
            ),
            child: Icon(icon, color: color, size: 20.0),
          ),
          const SizedBox(width: 12.0),
          Expanded(
            flex: 4,
            child: Text(
              service,
              style: Theme.of(
                context,
              ).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold),
              overflow: TextOverflow.visible,
            ),
          ),
          const SizedBox(width: 12.0),
          Expanded(
            flex: 2,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(10.0),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 600),
                height: 10.0,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(10.0),
                ),
                child: AnimatedFractionallySizedBox(
                  duration: const Duration(milliseconds: 800),
                  curve: Curves.easeOutCubic,
                  alignment: Alignment.centerLeft,
                  widthFactor: count / maxCount,
                  child: Container(
                    decoration: BoxDecoration(
                      color: color,
                      borderRadius: BorderRadius.circular(10.0),
                    ),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(width: 16.0),
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 12.0,
              vertical: 6.0,
            ),
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(10.0),
              boxShadow: [
                BoxShadow(
                  color: color.withValues(alpha: 0.3),
                  blurRadius: 4.0,
                  offset: const Offset(0.0, 2.0),
                ),
              ],
            ),
            child: Text(
              count.toString(),
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.white,
                fontSize: 13.0,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
