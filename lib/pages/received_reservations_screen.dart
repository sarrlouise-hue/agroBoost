import 'package:flutter/material.dart';
class ReceivedReservationsScreen extends StatefulWidget {
    const ReceivedReservationsScreen({required this.language, super.key});

  final String language;

  @override
  State<ReceivedReservationsScreen> createState() {
    return _ReceivedReservationsScreenState();
  }
}

class _ReceivedReservationsScreenState
    extends State<ReceivedReservationsScreen> {
  String _selectedFilter = 'all';

  final List<Map<String, dynamic>> _receivedBookings = [
    {
      'id': '1',
      'clientName': 'Fatou Sall',
      'service': 'Labour',
      'hectares': 3.5,
      'date': DateTime.now().add(const Duration(days: 1)),
      'status': 'pending',
      'price': 140000.0,
      'location': 'Thiès',
    },
    {
      'id': '2',
      'clientName': 'Ibrahima Ndiaye',
      'service': 'Offset',
      'hectares': 2.0,
      'date': DateTime.now().add(const Duration(days: 3)),
      'status': 'confirmed',
      'price': 70000.0,
      'location': 'Dakar',
    },
    {
      'id': '3',
      'clientName': 'Moussa Diop',
      'service': 'Reprofilage',
      'hectares': 5.0,
      'date': DateTime.now().subtract(const Duration(days: 2)),
      'status': 'completed',
      'price': 150000.0,
      'location': 'Kaolack',
    },
    {
      'id': '4',
      'clientName': 'Aminata Gueye',
      'service': 'Semis',
      'hectares': 4.0,
      'date': DateTime.now().add(const Duration(days: 5)),
      'status': 'pending',
      'price': 120000.0,
      'location': 'Saint-Louis',
    },
    {
      'id': '5',
      'clientName': 'Cheikh Sy',
      'service': 'Labour',
      'hectares': 6.0,
      'date': DateTime.now().add(const Duration(days: 2)),
      'status': 'confirmed',
      'price': 180000.0,
      'location': 'Louga',
    },
    {
      'id': '6',
      'clientName': 'Mariama Ba',
      'service': 'Récolte',
      'hectares': 3.0,
      'date': DateTime.now().subtract(const Duration(days: 5)),
      'status': 'completed',
      'price': 100000.0,
      'location': 'Fatick',
    },
    {
      'id': '7',
      'clientName': 'Ousmane Fall',
      'service': 'Transport',
      'hectares': 2.5,
      'date': DateTime.now().add(const Duration(days: 7)),
      'status': 'pending',
      'price': 80000.0,
      'location': 'Mbour',
    },
    {
      'id': '8',
      'clientName': 'Awa Diallo',
      'service': 'Labour',
      'hectares': 4.5,
      'date': DateTime.now().add(const Duration(days: 4)),
      'status': 'confirmed',
      'price': 135000.0,
      'location': 'Ziguinchor',
    },
    {
      'id': '9',
      'clientName': 'Mamadou Kane',
      'service': 'Offset',
      'hectares': 3.0,
      'date': DateTime.now().subtract(const Duration(days: 1)),
      'status': 'completed',
      'price': 95000.0,
      'location': 'Kolda',
    },
    {
      'id': '10',
      'clientName': 'Khady Niang',
      'service': 'Semis',
      'hectares': 5.5,
      'date': DateTime.now().add(const Duration(days: 6)),
      'status': 'pending',
      'price': 165000.0,
      'location': 'Diourbel',
    },
  ];

  List<Map<String, dynamic>> get _filteredBookings {
    if (_selectedFilter == 'all') {
      return _receivedBookings;
    }
    return _receivedBookings
        .where((b) => b['status'] == _selectedFilter)
        .toList();
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
      selectedColor: const Color(0xffe56d4b),
      labelStyle: TextStyle(
        color: isSelected
            ? Colors.white
            : Theme.of(context).colorScheme.onSurface,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
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
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24.0),
          const SizedBox(height: 8.0),
          Text(
            value,
            style: TextStyle(
              fontSize: 20.0,
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

  Widget _buildBookingCard(Map<String, dynamic> booking, bool isWolof) {
    Color statusColor;
    String statusText;
    if (booking['status'] == 'pending') {
      statusColor = const Color(0xfff57c00);
      statusText = isWolof ? 'Dëmandé' : 'En attente';
    } else {
      if (booking['status'] == 'confirmed') {
        statusColor = const Color(0xff388e3c);
        statusText = isWolof ? 'Konfirme' : 'Confirmé';
      } else {
        statusColor = const Color(0xff1976d2);
        statusText = isWolof ? 'Jeexal' : 'Terminé';
      }
    }
    return Card(
      margin: const EdgeInsets.only(bottom: 16.0),
      child: InkWell(
        onTap: () => _showBookingActions(booking, isWolof),
        borderRadius: BorderRadius.circular(12.0),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 50.0,
                    height: 50.0,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Theme.of(context).colorScheme.primary,
                          Theme.of(context).colorScheme.secondary,
                        ],
                      ),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.person, color: Colors.white),
                  ),
                  const SizedBox(width: 16.0),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          booking['clientName'],
                          style: Theme.of(context).textTheme.titleMedium
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4.0),
                        Row(
                          children: [
                            Icon(
                              Icons.location_on,
                              size: 14.0,
                              color: Theme.of(
                                context,
                              ).colorScheme.onSurfaceVariant,
                            ),
                            const SizedBox(width: 4.0),
                            Text(
                              booking['location'],
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
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
                      color: statusColor.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    child: Text(
                      statusText,
                      style: TextStyle(
                        fontSize: 12.0,
                        fontWeight: FontWeight.bold,
                        color: statusColor,
                      ),
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
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            isWolof ? 'Liggéey' : 'Service',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                          Text(
                            booking['service'],
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            isWolof ? 'Surface' : 'Surface',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                          Text(
                            '${booking['hectares']} ha',
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          isWolof ? 'Prix' : 'Prix',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                        Text(
                          '${booking['price'].toStringAsFixed(0)} F',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                        ),
                      ],
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

  void _showBookingActions(Map<String, dynamic> booking, bool isWolof) {
    if (booking['status'] != 'pending') {
      return;
    }
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
            Text(
              isWolof ? 'Tànnal' : 'Actions',
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24.0),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        isWolof
                            ? 'Dëmande bi konfirme na'
                            : 'Demande confirmée',
                      ),
                      backgroundColor: const Color(0xff4caf50),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xff4caf50),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                ),
                icon: const Icon(Icons.check_circle),
                label: Text(isWolof ? 'Konfirme' : 'Accepter'),
              ),
            ),
            const SizedBox(height: 12.0),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        isWolof ? 'Dëmande bi bisantil' : 'Demande refusée',
                      ),
                      backgroundColor: const Color(0xffd32f2f),
                    ),
                  );
                },
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xffd32f2f),
                  side: const BorderSide(color: Color(0xffd32f2f)),
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                ),
                icon: const Icon(Icons.cancel),
                label: Text(isWolof ? 'Bisantil' : 'Refuser'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isWolof = widget.language == 'wo';
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.surface,
        title: Text(isWolof ? 'Dëmande yi' : 'Demandes reçues'),
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
                  'pending',
                  isWolof ? 'Dëmandé' : 'En attente',
                  Icons.pending_actions,
                ),
                const SizedBox(width: 8.0),
                _buildFilterChip(
                  'confirmed',
                  isWolof ? 'Konfirme' : 'Confirmées',
                  Icons.check_circle,
                ),
                const SizedBox(width: 8.0),
                _buildFilterChip(
                  'completed',
                  isWolof ? 'Jeexal' : 'Terminées',
                  Icons.task_alt,
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
                    icon: Icons.pending,
                    value: _receivedBookings
                        .where((b) => b['status'] == 'pending')
                        .length
                        .toString(),
                    label: isWolof ? 'En attente' : 'En attente',
                    color: const Color(0xfff57c00),
                  ),
                ),
                const SizedBox(width: 12.0),
                Expanded(
                  child: _buildStatCard(
                    icon: Icons.check_circle,
                    value: _receivedBookings
                        .where((b) => b['status'] == 'confirmed')
                        .length
                        .toString(),
                    label: isWolof ? 'Confirmées' : 'Confirmées',
                    color: const Color(0xff388e3c),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: _filteredBookings.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.inbox,
                          size: 80.0,
                          color: Theme.of(context).colorScheme.outlineVariant,
                        ),
                        const SizedBox(height: 16.0),
                        Text(
                          isWolof ? 'Amul dëmande' : 'Aucune demande',
                          style: Theme.of(context).textTheme.titleMedium
                              ?.copyWith(
                                color: Theme.of(
                                  context,
                                ).colorScheme.onSurfaceVariant,
                              ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16.0, 0.0, 16.0, 80.0),
                    itemCount: _filteredBookings.length,
                    itemBuilder: (context, index) =>
                        _buildBookingCard(_filteredBookings[index], isWolof),
                  ),
          ),
        ],
      ),
    );
  }
}
