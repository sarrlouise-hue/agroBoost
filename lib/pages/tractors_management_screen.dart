// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
class TractorsManagementScreen extends StatefulWidget {
    const TractorsManagementScreen({
    required this.language,
    this.showBackButton = false,
    super.key,
  });

  final String language;

  final bool showBackButton;

  @override
  State<TractorsManagementScreen> createState() {
    return _TractorsManagementScreenState();
  }
}

class _TractorsManagementScreenState extends State<TractorsManagementScreen> {
  String _selectedStatus = 'Tous';

  String _selectedType = 'Tous';

  final TextEditingController _searchController = TextEditingController();

  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> _getFilteredTractors(
    List<Map<String, dynamic>> tractors,
  ) {
    var filtered = tractors.where((tractor) {
      final statusMatch = _selectedStatus == 'Tous' ||
          (_selectedStatus == 'Approuvé' && tractor['status'] == 'approved') ||
          (_selectedStatus == 'En attente' && tractor['status'] == 'pending');
      final typeMatch =
          _selectedType == 'Tous' || tractor['type'] == _selectedType;
      bool searchMatch = true;
      if (_searchQuery.isNotEmpty) {
        final name = (tractor['name'] as String).toLowerCase();
        final owner = (tractor['owner'] as String).toLowerCase();
        final type = (tractor['type'] as String).toLowerCase();
        final query = _searchQuery.toLowerCase();
        searchMatch = name.contains(query) ||
            owner.contains(query) ||
            type.contains(query);
      }
      return statusMatch && typeMatch && searchMatch;
    }).toList();
    return filtered;
  }

  @override
  Widget build(BuildContext context) {
    final bool isWolof = widget.language == 'wo';
    final List<Map<String, dynamic>> allTractors = [
      {
        'name': 'John Deere 5065E',
        'owner': 'Moussa Diop',
        'price': 40000,
        'status': 'approved',
        'type': 'Labour',
      },
      {
        'name': 'Massey Ferguson 385',
        'owner': 'Fatou Sall',
        'price': 35000,
        'status': 'approved',
        'type': 'Offset',
      },
      {
        'name': 'New Holland TD5',
        'owner': 'Ibrahima Ndiaye',
        'price': 30000,
        'status': 'pending',
        'type': 'Reprofilage',
      },
      {
        'name': 'Case IH Farmall 75C',
        'owner': 'Aminata Ba',
        'price': 38000,
        'status': 'pending',
        'type': 'Labour',
      },
      {
        'name': 'Kubota M7060',
        'owner': 'Cheikh Sy',
        'price': 42000,
        'status': 'approved',
        'type': 'Transport',
      },
    ];
    final tractors = _getFilteredTractors(allTractors);
    final hasActiveFilters = _selectedStatus != 'Tous' ||
        _selectedType != 'Tous' ||
        _searchQuery.isNotEmpty;
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        automaticallyImplyLeading: widget.showBackButton,
        elevation: 0.0,
        backgroundColor: Theme.of(context).colorScheme.surface,
        leading: widget.showBackButton
            ? IconButton(
                icon: const Icon(Icons.arrow_back_rounded),
                onPressed: () => Navigator.pop(context),
              )
            : null,
        title: Text(
          isWolof ? 'Traktëëur yi' : 'Gestion Tracteurs',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16.0,
                      vertical: 4.0,
                    ),
                    decoration: BoxDecoration(
                      color: Theme.of(
                        context,
                      ).colorScheme.surfaceContainerHighest.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    child: TextField(
                      controller: _searchController,
                      onChanged: (value) {
                        setState(() {
                          _searchQuery = value;
                        });
                      },
                      decoration: InputDecoration(
                        hintText: isWolof ? 'Seet...' : 'Rechercher...',
                        border: InputBorder.none,
                        prefixIcon: const Icon(Icons.search_rounded),
                        suffixIcon: _searchQuery.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear_rounded),
                                onPressed: () {
                                  setState(() {
                                    _searchController.clear();
                                    _searchQuery = '';
                                  });
                                },
                              )
                            : null,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12.0),
                Stack(
                  children: [
                    IconButton(
                      onPressed: _showFilterBottomSheet,
                      icon: const Icon(Icons.filter_list_rounded),
                      style: IconButton.styleFrom(
                        backgroundColor: (_selectedStatus != 'Tous' ||
                                _selectedType != 'Tous')
                            ? Theme.of(context).colorScheme.primary
                            : Theme.of(context).colorScheme.primaryContainer,
                        foregroundColor: (_selectedStatus != 'Tous' ||
                                _selectedType != 'Tous')
                            ? Colors.white
                            : Theme.of(context).colorScheme.onPrimaryContainer,
                      ),
                    ),
                    if (_selectedStatus != 'Tous' || _selectedType != 'Tous')
                      Positioned(
                        right: 8.0,
                        top: 8.0,
                        child: Container(
                          width: 8.0,
                          height: 8.0,
                          decoration: BoxDecoration(
                            color: Theme.of(context).colorScheme.error,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: Theme.of(context).colorScheme.surface,
                              width: 1.5,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
          if (hasActiveFilters)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Row(
                children: [
                  Text(
                    '${tractors.length} ${isWolof ? 'résultat(s)' : 'résultat(s)'}',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                  ),
                  const SizedBox(width: 8.0),
                  if (_selectedStatus != 'Tous')
                    Chip(
                      label: Text(
                        _selectedStatus,
                        style: const TextStyle(fontSize: 11.0),
                      ),
                      onDeleted: () => setState(() => _selectedStatus = 'Tous'),
                      deleteIconColor: Theme.of(
                        context,
                      ).colorScheme.onPrimaryContainer,
                      backgroundColor: Theme.of(
                        context,
                      ).colorScheme.primaryContainer,
                      padding: EdgeInsets.zero,
                    ),
                  const SizedBox(width: 8.0),
                  if (_selectedType != 'Tous')
                    Chip(
                      label: Text(
                        _selectedType,
                        style: const TextStyle(fontSize: 11.0),
                      ),
                      onDeleted: () => setState(() => _selectedType = 'Tous'),
                      deleteIconColor: Theme.of(
                        context,
                      ).colorScheme.onPrimaryContainer,
                      backgroundColor: Theme.of(
                        context,
                      ).colorScheme.primaryContainer,
                      padding: EdgeInsets.zero,
                    ),
                ],
              ),
            ),
          const SizedBox(height: 8.0),
          Expanded(
            child: tractors.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          _searchQuery.isNotEmpty
                              ? Icons.search_off_rounded
                              : Icons.filter_list_off_rounded,
                          size: 64.0,
                          color: Theme.of(context).colorScheme.outline,
                        ),
                        const SizedBox(height: 16.0),
                        Text(
                          isWolof
                              ? 'Aucun tracteur trouvé'
                              : 'Aucun tracteur trouvé',
                          style:
                              Theme.of(context).textTheme.titleMedium?.copyWith(
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.onSurfaceVariant,
                                  ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16.0),
                    itemCount: tractors.length,
                    itemBuilder: (context, index) {
                      final Map<String, dynamic> tractor = tractors[index];
                      final bool isApproved = tractor['status'] == 'approved';
                      return AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        margin: const EdgeInsets.only(bottom: 16.0),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.surface,
                          borderRadius: BorderRadius.circular(16.0),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.04),
                              blurRadius: 8.0,
                              offset: const Offset(0.0, 2.0),
                            ),
                            BoxShadow(
                              color: Colors.black.withOpacity(0.02),
                              blurRadius: 2.0,
                              offset: const Offset(0.0, 1.0),
                            ),
                          ],
                        ),
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            borderRadius: BorderRadius.circular(16.0),
                            onTap: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    isWolof
                                        ? 'Voir les détails de ${tractor['name']}'
                                        : 'Voir les détails de ${tractor['name']}',
                                  ),
                                  duration: const Duration(seconds: 2),
                                  behavior: SnackBarBehavior.floating,
                                ),
                              );
                            },
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        width: 60.0,
                                        height: 60.0,
                                        decoration: BoxDecoration(
                                          color: Theme.of(context)
                                              .colorScheme
                                              .primaryContainer
                                              .withValues(alpha: 0.3),
                                          borderRadius: BorderRadius.circular(
                                            12.0,
                                          ),
                                        ),
                                        child: Icon(
                                          Icons.agriculture_rounded,
                                          size: 32.0,
                                          color: Theme.of(
                                            context,
                                          ).colorScheme.primary,
                                        ),
                                      ),
                                      const SizedBox(width: 16.0),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              tractor['name'] as String,
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 16.0,
                                              ),
                                            ),
                                            const SizedBox(height: 4.0),
                                            Text(
                                              tractor['owner'] as String,
                                              style: Theme.of(
                                                context,
                                              ).textTheme.bodySmall,
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
                                          color: isApproved
                                              ? Theme.of(context)
                                                  .colorScheme
                                                  .secondary
                                                  .withOpacity(0.1)
                                              : Theme.of(context)
                                                  .colorScheme
                                                  .primaryContainer
                                                  .withOpacity(0.2),
                                          borderRadius: BorderRadius.circular(
                                            12.0,
                                          ),
                                        ),
                                        child: Text(
                                          isApproved
                                              ? (isWolof
                                                  ? 'Approuvé'
                                                  : 'Approuvé')
                                              : (isWolof
                                                  ? 'En attente'
                                                  : 'En attente'),
                                          style: TextStyle(
                                            fontSize: 11.0,
                                            fontWeight: FontWeight.bold,
                                            color: isApproved
                                                ? Theme.of(
                                                    context,
                                                  ).colorScheme.secondary
                                                : Theme.of(context)
                                                    .colorScheme
                                                    .primaryContainer,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 12.0),
                                  Row(
                                    children: [
                                      Chip(
                                        label: Text(
                                          tractor['type'] as String,
                                          style: const TextStyle(
                                            fontSize: 12.0,
                                          ),
                                        ),
                                        backgroundColor: Theme.of(context)
                                            .colorScheme
                                            .primaryContainer
                                            .withOpacity(0.3),
                                      ),
                                      const SizedBox(width: 8.0),
                                      Text(
                                        '${tractor['price']} F/ha',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: Theme.of(
                                            context,
                                          ).colorScheme.primary,
                                        ),
                                      ),
                                      const Spacer(),
                                      if (!isApproved) ...[
                                        IconButton(
                                          onPressed: () {
                                            ScaffoldMessenger.of(
                                              context,
                                            ).showSnackBar(
                                              SnackBar(
                                                content: Text(
                                                  isWolof
                                                      ? '${tractor['name']} approuvé ✓'
                                                      : '${tractor['name']} approuvé ✓',
                                                ),
                                                duration: const Duration(
                                                  seconds: 2,
                                                ),
                                                backgroundColor: Theme.of(
                                                  context,
                                                ).colorScheme.secondary,
                                                behavior:
                                                    SnackBarBehavior.floating,
                                              ),
                                            );
                                          },
                                          icon: Icon(
                                            Icons.check_rounded,
                                            color: Theme.of(
                                              context,
                                            ).colorScheme.secondary,
                                          ),
                                          tooltip: isWolof
                                              ? 'Approuver'
                                              : 'Approuver',
                                        ),
                                        IconButton(
                                          onPressed: () {
                                            ScaffoldMessenger.of(
                                              context,
                                            ).showSnackBar(
                                              SnackBar(
                                                content: Text(
                                                  isWolof
                                                      ? '${tractor['name']} refusé'
                                                      : '${tractor['name']} refusé',
                                                ),
                                                duration: const Duration(
                                                  seconds: 2,
                                                ),
                                                backgroundColor: const Color(
                                                  0xfff44336,
                                                ),
                                                behavior:
                                                    SnackBarBehavior.floating,
                                              ),
                                            );
                                          },
                                          icon: const Icon(
                                            Icons.close_rounded,
                                            color: Color(0xfff44336),
                                          ),
                                          tooltip:
                                              isWolof ? 'Refuser' : 'Refuser',
                                        ),
                                      ],
                                    ],
                                  ),
                                ],
                              ),
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

  void _showFilterBottomSheet() {
    final bool isWolof = widget.language == 'wo';
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
          crossAxisAlignment: CrossAxisAlignment.start,
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
              isWolof ? 'Filtrer' : 'Filtrer',
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24.0),
            Text(
              isWolof ? 'Statut' : 'Statut',
              style: Theme.of(
                context,
              ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12.0),
            Wrap(
              spacing: 8.0,
              children: ['Tous', 'Approuvé', 'En attente'].map((status) {
                final isSelected = _selectedStatus == status;
                return FilterChip(
                  label: Text(status),
                  selected: isSelected,
                  onSelected: (selected) {
                    setState(() {
                      _selectedStatus = status;
                    });
                    Navigator.pop(context);
                  },
                  backgroundColor:
                      Theme.of(context).colorScheme.surfaceContainerHighest,
                  selectedColor: Theme.of(context).colorScheme.primary,
                  labelStyle: TextStyle(
                    color: isSelected
                        ? Theme.of(context).colorScheme.onPrimary
                        : Theme.of(context).colorScheme.onSurfaceVariant,
                    fontWeight:
                        isSelected ? FontWeight.bold : FontWeight.normal,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24.0),
            Text(
              isWolof ? 'Type de service' : 'Type de service',
              style: Theme.of(
                context,
              ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12.0),
            Wrap(
              spacing: 8.0,
              runSpacing: 8.0,
              children: [
                'Tous',
                'Labour',
                'Offset',
                'Reprofilage',
                'Transport',
                'Semis',
                'Récolte',
              ].map((type) {
                final isSelected = _selectedType == type;
                return FilterChip(
                  label: Text(type),
                  selected: isSelected,
                  onSelected: (selected) {
                    setState(() {
                      _selectedType = type;
                    });
                    Navigator.pop(context);
                  },
                  backgroundColor: Theme.of(
                    context,
                  ).colorScheme.surfaceContainerHighest,
                  selectedColor: Theme.of(context).colorScheme.primary,
                  labelStyle: TextStyle(
                    color: isSelected
                        ? Theme.of(context).colorScheme.onPrimary
                        : Theme.of(context).colorScheme.onSurfaceVariant,
                    fontWeight:
                        isSelected ? FontWeight.bold : FontWeight.normal,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24.0),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () {
                  setState(() {
                    _selectedStatus = 'Tous';
                    _selectedType = 'Tous';
                  });
                  Navigator.pop(context);
                },
                style: FilledButton.styleFrom(
                  backgroundColor:
                      Theme.of(context).colorScheme.surfaceContainerHighest,
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                ),
                child: Text(
                  isWolof ? 'Réinitialiser' : 'Réinitialiser',
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
