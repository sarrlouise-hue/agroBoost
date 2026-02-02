import 'dart:math';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:hallo/models/service_model.dart';
import 'package:hallo/models/user_model.dart';
import 'package:hallo/tractor_data.dart';
import 'package:hallo/globals/auth_provider.dart';
import 'package:hallo/globals/app_state.dart';
import 'package:hallo/pages/login_screen.dart';
import 'package:hallo/components/interactive_map_screen.dart';
import 'package:hallo/components/tractor_card.dart';
import 'package:hallo/pages/tractor_detail_screen.dart';
import 'package:hallo/services_collection.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({required this.language, super.key});

  final String language;

  @override
  State<HomeScreen> createState() {
    return _HomeScreenState();
  }
}

class _HomeScreenState extends State<HomeScreen> {
  bool get hasActiveFilters {
    return _selectedFilter != 'all' ||
        _maxDistance != 10.0 ||
        _availabilityFilter != 'all' ||
        _minRating > 0.0;
  }

  int get activeFiltersCount {
    int count = 0;
    if (_selectedFilter != 'all') {
      count++;
    }
    if (_maxDistance != 10.0) {
      count++;
    }
    if (_availabilityFilter != 'all') {
      count++;
    }
    if (_minRating > 0.0) {
      count++;
    }
    return count;
  }

  bool _isBalanceHidden = false;

  bool _isMapView = false;

  String _selectedFilter = 'all';

  double _maxDistance = 10.0;

  String _availabilityFilter = 'all';

  double _minRating = 0.0;

  bool _isLoading = true;

  List<ServiceModel> _services = [];

  UserModel? _currentUser;

  bool _isLoadingUser = true;

  List<TractorData> get _tractors {
    return _services.map((service) => _serviceToTractor(service)).toList();
  }

  Widget _buildViewToggle(bool isWolof) {
    final filteredTractors = _getFilteredTractors();
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${filteredTractors.length} ${isWolof ? 'traktëër' : 'tracteurs'} ${isWolof ? 'yuy jëkk' : 'disponibles'}',
                      style: Theme.of(context).textTheme.titleSmall,
                    ),
                    if (hasActiveFilters) ...[
                      const SizedBox(height: 4.0),
                      Text(
                        _getActiveFiltersText(isWolof),
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Theme.of(context).colorScheme.primary,
                              fontWeight: FontWeight.w600,
                            ),
                      ),
                    ],
                  ],
                ),
              ),
              Container(
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(8.0),
                ),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.map),
                      onPressed: () {
                        setState(() {
                          _isMapView = true;
                        });
                      },
                      color: _isMapView
                          ? Theme.of(context).colorScheme.primary
                          : Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                    IconButton(
                      icon: const Icon(Icons.list),
                      onPressed: () {
                        setState(() {
                          _isMapView = false;
                        });
                      },
                      color: !_isMapView
                          ? Theme.of(context).colorScheme.primary
                          : Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _getActiveFiltersText(bool isWolof) {
    List<String> filters = [];
    if (_selectedFilter != 'all') {
      filters.add(
        _selectedFilter.substring(0, 1).toUpperCase() +
            _selectedFilter.substring(1),
      );
    }
    if (_maxDistance != 10.0) {
      filters.add('< ${_maxDistance.toInt()} km');
    }
    if (_minRating > 0.0) {
      filters.add('⭐ ${_minRating.toStringAsFixed(1)}+');
    }
    if (_availabilityFilter != 'all') {
      filters.add(_availabilityFilter);
    }
    if (filters.isEmpty) {
      return '';
    }
    return (isWolof ? 'Filtre: ' : 'Filtres: ') + filters.join(' • ');
  }

  Widget _buildHelpItem(IconData icon, String title, String description) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 16.0, color: Theme.of(context).colorScheme.primary),
        const SizedBox(width: 8.0),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: Theme.of(
                  context,
                ).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w600),
              ),
              Text(
                description,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                      fontSize: 11.0,
                    ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildReservationStatusItem(
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

  @override
  Widget build(BuildContext context) {
    final bool isWolof = widget.language == 'wo';
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(isWolof),
            _buildFilters(isWolof),
            _buildViewToggle(isWolof),
            Expanded(child: _isMapView ? _buildMapView() : _buildListView()),
          ],
        ),
      ),
      floatingActionButton: Stack(
        children: [
          FloatingActionButton.extended(
            onPressed: () {
              _showFilterBottomSheet(isWolof);
            },
            backgroundColor: Theme.of(context).colorScheme.primary,
            icon: const Icon(Icons.tune, color: Colors.white),
            label: Text(
              isWolof ? 'Filtre' : 'Filtrer',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          if (hasActiveFilters)
            Positioned(
              right: 0.0,
              top: 0.0,
              child: Container(
                padding: const EdgeInsets.all(6.0),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primaryContainer,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Theme.of(
                        context,
                      ).colorScheme.primaryContainer.withValues(alpha: 0.5),
                      blurRadius: 8.0,
                      offset: const Offset(0.0, 2.0),
                    ),
                  ],
                ),
                child: Text(
                  activeFiltersCount.toString(),
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onPrimaryContainer,
                    fontSize: 12.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildFilterHelp(bool isWolof) {
    return Container(
      margin: const EdgeInsets.only(top: 16.0),
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Theme.of(
              context,
            ).colorScheme.primaryContainer.withValues(alpha: 0.3),
            Theme.of(
              context,
            ).colorScheme.secondaryContainer.withValues(alpha: 0.2),
          ],
        ),
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(
          color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.3),
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
                      Theme.of(context).colorScheme.primary,
                      Theme.of(context).colorScheme.secondary,
                    ],
                  ),
                  borderRadius: BorderRadius.circular(8.0),
                ),
                child: const Icon(
                  Icons.lightbulb,
                  color: Colors.white,
                  size: 20.0,
                ),
              ),
              const SizedBox(width: 12.0),
              Text(
                isWolof ? 'Ndimbal' : 'Aide aux filtres',
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.primary,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 12.0),
          _buildHelpItem(
            Icons.access_time,
            isWolof ? '24h/48h' : 'Disponibilité Immédiate',
            isWolof
                ? 'Gis prestataire yu jëkk ci 24-48h'
                : 'Trouvez un prestataire libre sous 24-48h',
          ),
          const SizedBox(height: 8.0),
          _buildHelpItem(
            Icons.star,
            isWolof ? 'Note minimale' : 'Note de Fiabilité',
            isWolof
                ? 'Tann prestataire yu am note bu gëna'
                : 'Sélectionnez les prestataires les mieux notés',
          ),
          const SizedBox(height: 8.0),
          _buildHelpItem(
            Icons.location_on,
            isWolof ? 'Distance' : 'Distance Max',
            isWolof
                ? 'Tann prestataire yu jëkk ci sa yaay'
                : 'Limitez la distance de recherche',
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip({
    required String label,
    required String value,
    required IconData icon,
  }) {
    final bool isSelected = _selectedFilter == value;
    return Padding(
      padding: const EdgeInsets.only(right: 8.0),
      child: FilterChip(
        selected: isSelected,
        label: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 18.0,
              color: isSelected
                  ? Colors.white
                  : Theme.of(context).colorScheme.onSurfaceVariant,
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
        backgroundColor: Theme.of(context).colorScheme.surface,
        selectedColor: Theme.of(context).colorScheme.primary,
        labelStyle: TextStyle(
          color: isSelected
              ? Colors.white
              : Theme.of(context).colorScheme.onSurfaceVariant,
          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
        ),
      ),
    );
  }

  Widget _buildFilterChipOption(
    String label,
    String value,
    bool isWolof,
    void Function(void Function()) updateModal,
  ) {
    final isSelected = _selectedFilter == value;
    return FilterChip(
      selected: isSelected,
      label: Text(label),
      onSelected: (selected) {
        updateModal(() {
          _selectedFilter = value;
        });
      },
      selectedColor: Theme.of(context).colorScheme.primary,
      labelStyle: TextStyle(
        color:
            isSelected ? Colors.white : Theme.of(context).colorScheme.onSurface,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
      ),
    );
  }

  Widget _buildAvailabilityChip(
    String label,
    String value,
    IconData icon,
    void Function(void Function()) updateModal,
  ) {
    final bool isSelected = _availabilityFilter == value;
    return FilterChip(
      selected: isSelected,
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 16.0,
            color: isSelected
                ? Colors.white
                : Theme.of(context).colorScheme.onSurfaceVariant,
          ),
          const SizedBox(width: 6.0),
          Text(label),
        ],
      ),
      onSelected: (selected) {
        updateModal(() {
          _availabilityFilter = value;
        });
      },
      backgroundColor: Theme.of(context).colorScheme.surface,
      selectedColor: Theme.of(context).colorScheme.primary,
      labelStyle: TextStyle(
        color:
            isSelected ? Colors.white : Theme.of(context).colorScheme.onSurface,
        fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    _loadServices();
    _loadCurrentUser();
  }

  Future<void> _loadCurrentUser() async {
    try {
      final authProvider = AuthProvider.of(context, listen: false);
      await authProvider.loadCurrentUser();
      if (mounted) {
        setState(() {
          _currentUser = authProvider.currentUser;
          _isLoadingUser = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoadingUser = false;
        });
      }
    }
  }

  void _showProfileQuickView(bool isWolof) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
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
            24.0 + MediaQuery.of(context).padding.bottom,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40.0,
                height: 4.0,
                margin: const EdgeInsets.only(bottom: 20.0),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.outlineVariant,
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
                          Theme.of(context).colorScheme.primary,
                          Theme.of(context).colorScheme.secondary,
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
                        _isLoadingUser
                            ? const SizedBox(
                                width: 150.0,
                                child: LinearProgressIndicator(),
                              )
                            : Text(
                                _currentUser != null
                                    ? '${_currentUser?.firstName} ${_currentUser?.lastName}'
                                    : 'Utilisateur',
                                style: Theme.of(context)
                                    .textTheme
                                    .titleLarge
                                    ?.copyWith(fontWeight: FontWeight.bold),
                              ),
                        const SizedBox(height: 4.0),
                        _isLoadingUser
                            ? const SizedBox(
                                width: 100.0,
                                child: LinearProgressIndicator(),
                              )
                            : Text(
                                _currentUser?.phoneNumber ??
                                    '+221 00 000 00 00',
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyMedium
                                    ?.copyWith(
                                      color: Theme.of(
                                        context,
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
                      Theme.of(context).colorScheme.primary,
                      Theme.of(context).colorScheme.secondary,
                    ],
                  ),
                  borderRadius: BorderRadius.circular(16.0),
                  boxShadow: [
                    BoxShadow(
                      color: Theme.of(
                        context,
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
                              _isBalanceHidden = !_isBalanceHidden;
                            });
                          },
                          borderRadius: BorderRadius.circular(20.0),
                          child: Container(
                            padding: const EdgeInsets.all(6.0),
                            child: Icon(
                              _isBalanceHidden
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
                        if (_isBalanceHidden)
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
                            '125,000',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 36.0,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        const SizedBox(width: 8.0),
                        if (!_isBalanceHidden)
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
                        context,
                      ).colorScheme.primaryContainer.withValues(alpha: 0.3),
                      Theme.of(
                        context,
                      ).colorScheme.secondaryContainer.withValues(alpha: 0.2),
                    ],
                  ),
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
                        Container(
                          padding: const EdgeInsets.all(8.0),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Theme.of(context).colorScheme.primary,
                                Theme.of(context).colorScheme.secondary,
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
                          style: Theme.of(context)
                              .textTheme
                              .titleMedium
                              ?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16.0),
                    _buildReservationStatusItem(
                      Icons.pending_actions,
                      isWolof ? 'Ci attente' : 'En attente',
                      '2',
                      Theme.of(context).colorScheme.primaryContainer,
                    ),
                    const SizedBox(height: 12.0),
                    _buildReservationStatusItem(
                      Icons.check_circle,
                      isWolof ? 'Accepté' : 'Acceptées',
                      '1',
                      Theme.of(context).colorScheme.secondaryContainer,
                    ),
                    const SizedBox(height: 12.0),
                    _buildReservationStatusItem(
                      Icons.agriculture,
                      isWolof ? 'Ci liggéey' : 'En cours',
                      '1',
                      Theme.of(context).colorScheme.secondary,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20.0),
              InkWell(
                onTap: () async {
                  final shouldLogout = await showDialog<bool>(
                    context: context,
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
                          onPressed: () => Navigator.pop(dialogContext, false),
                          child: Text(isWolof ? 'Deedeet' : 'Annuler'),
                        ),
                        Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Theme.of(context).colorScheme.error,
                                Theme.of(
                                  context,
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
                  if (shouldLogout == true && mounted) {
                    Navigator.pop(context);
                    final appState = AppState.of(context, listen: false);
                    await appState.logout();
                    if (mounted) {
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const LoginScreen(),
                        ),
                        (route) => false,
                      );
                    }
                  }
                },
                borderRadius: BorderRadius.circular(12.0),
                child: Container(
                  padding: const EdgeInsets.all(16.0),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Theme.of(
                          context,
                        ).colorScheme.error.withValues(alpha: 0.1),
                        Theme.of(
                          context,
                        ).colorScheme.error.withValues(alpha: 0.05),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12.0),
                    border: Border.all(
                      color: Theme.of(
                        context,
                      ).colorScheme.error.withValues(alpha: 0.3),
                      width: 1.5,
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.logout_outlined,
                        color: Theme.of(context).colorScheme.error,
                        size: 22.0,
                      ),
                      const SizedBox(width: 12.0),
                      Text(
                        isWolof ? 'Génn' : 'Se déconnecter',
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.error,
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

  Widget _buildMapView() {
    final filteredTractors = _getFilteredTractors();
    return InteractiveMapScreen(
      tractors: filteredTractors,
      language: widget.language,
    );
  }

  Widget _buildListView() {
    final filteredTractors = _getFilteredTractors();
    if (filteredTractors.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(32.0),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Theme.of(
                        context,
                      ).colorScheme.primary.withValues(alpha: 0.1),
                      Theme.of(
                        context,
                      ).colorScheme.secondary.withValues(alpha: 0.05),
                    ],
                  ),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.search_off,
                  size: 64.0,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
              const SizedBox(height: 24.0),
              Text(
                widget.language == 'wo'
                    ? 'Amul traktëër'
                    : 'Aucun tracteur trouvé',
                style: Theme.of(
                  context,
                ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12.0),
              Text(
                _services.isEmpty
                    ? (widget.language == 'wo'
                        ? 'Amul service ci database'
                        : 'Aucun service dans la base de données')
                    : (widget.language == 'wo'
                        ? 'Soppi sa filtre yi'
                        : 'Essayez de modifier vos filtres'),
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
              ),
              const SizedBox(height: 24.0),
              if (_services.isEmpty) ...[
                ElevatedButton.icon(
                  onPressed: _createTestServices,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context).colorScheme.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24.0,
                      vertical: 16.0,
                    ),
                  ),
                  icon: const Icon(Icons.add_circle),
                  label: Text(
                    widget.language == 'wo'
                        ? 'Sos services de test'
                        : 'Créer des services de test',
                  ),
                ),
                const SizedBox(height: 12.0),
                Text(
                  'ou',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                ),
                const SizedBox(height: 12.0),
              ] else ...[
                ElevatedButton.icon(
                  onPressed: () {
                    setState(() {
                      _selectedFilter = 'all';
                      _maxDistance = 10.0;
                      _availabilityFilter = 'all';
                      _minRating = 0.0;
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context).colorScheme.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24.0,
                      vertical: 16.0,
                    ),
                  ),
                  icon: const Icon(Icons.refresh),
                  label: Text(
                    widget.language == 'wo' ? 'Fattali' : 'Réinitialiser',
                  ),
                ),
                const SizedBox(height: 12.0),
              ],
              OutlinedButton.icon(
                onPressed: _loadServices,
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24.0,
                    vertical: 16.0,
                  ),
                  side: BorderSide(
                    color: Theme.of(context).colorScheme.primary,
                  ),
                ),
                icon: const Icon(Icons.refresh),
                label: Text(
                  widget.language == 'wo'
                      ? 'Rafraîchir'
                      : 'Rafraîchir la liste',
                ),
              ),
            ],
          ),
        ),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: filteredTractors.length,
      itemBuilder: (context, index) => TractorCard(
        tractor: filteredTractors[index],
        language: widget.language,
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => TractorDetailScreen(
                tractor: filteredTractors[index],
                language: widget.language,
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildServicePreviewItem(IconData icon, String name, String price) {
    return Container(
      padding: const EdgeInsets.all(12.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(8.0),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8.0),
            decoration: BoxDecoration(
              color: Theme.of(
                context,
              ).colorScheme.primary.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(8.0),
            ),
            child: Icon(
              icon,
              color: Theme.of(context).colorScheme.primary,
              size: 20.0,
            ),
          ),
          const SizedBox(width: 12.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: Theme.of(
                    context,
                  ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600),
                ),
                Text(
                  price,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context).colorScheme.primary,
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  double _degreesToRadians(double degrees) {
    return degrees * 3.14159265359 / 180.0;
  }

  Future<void> _loadServices() async {
    setState(() {
      _isLoading = true;
    });
    try {
      print('🔄 Chargement des services depuis le backend...');
      final response = await ServicesCollection.instance.getAllServices(
        page: 1,
        limit: 50,
      );
      if (response.success) {
        print('✅ Services récupérés du backend: ${response.data.length}');
        setState(() {
          _services = response.data;
          _isLoading = false;
        });
        for (var service in _services) {
          print('📦 Service Backend:');
          print('   ID: ${service.id}');
          print('   Nom: ${service.name}');
          print('   Type: ${service.serviceType}');
          print('   Images: ${service.images}');
          print('   Prix/jour: ${service.pricePerDay} F');
          print('   Disponible: ${service.availability}');
          print('   ---');
        }
        print('🚜 Total tracteurs après conversion: ${_tractors.length}');
      } else {
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      print('❌ Erreur lors du chargement des services: ${e}');
      setState(() {
        _isLoading = false;
      });
    }
  }

  Widget _buildHeader(bool isWolof) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10.0,
            offset: const Offset(0.0, 2.0),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Consumer<AuthProvider>(
                      builder: (context, authProvider, _) {
                        final user = authProvider.currentUser;
                        final name = user?.firstName ?? '';
                        return Text(
                          isWolof
                              ? (name.isEmpty
                                  ? 'Asalaam alekum!'
                                  : 'Asalaam alekum $name!')
                              : (name.isEmpty
                                  ? 'Bonjour !'
                                  : 'Bonjour $name !'),
                          style:
                              Theme.of(context).textTheme.titleLarge?.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                        );
                      },
                    ),
                    Text(
                      isWolof ? 'Gis sa traktëër' : 'Trouvez votre tracteur',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color:
                                Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                    ),
                  ],
                ),
              ),
              InkWell(
                onTap: () {
                  _showProfileQuickView(isWolof);
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
            ],
          ),
          const SizedBox(height: 16.0),
          TextField(
            decoration: InputDecoration(
              hintText:
                  isWolof ? 'Seet traktëër...' : 'Rechercher un tracteur...',
              prefixIcon: const Icon(Icons.search),
            ),
          ),
        ],
      ),
    );
  }

  List<TractorData> _getFilteredTractors() {
    print('🔍 FILTRAGE EN COURS...');
    print('   Filter sélectionné: ${_selectedFilter}');
    print('   Distance max: ${_maxDistance} km');
    print('   Note minimale: ${_minRating}');
    print('   Disponibilité: ${_availabilityFilter}');
    print('   Total services chargés: ${_services.length}');
    print('   Total tractors avant filtrage: ${_tractors.length}');
    final filtered = _tractors.where((tractor) {
      print('   🚜 Vérification ${tractor.name}:');
      print('      - Type: "${tractor.type}"');
      print('      - Distance: ${tractor.distance.toStringAsFixed(1)} km');
      print('      - Rating: ${tractor.rating}');
      print('      - Available: ${tractor.available}');
      if (_selectedFilter != 'all') {
        final tractorType = tractor.type.toLowerCase().trim();
        final filterType = _selectedFilter.toLowerCase().trim();
        print(
          '      - Comparaison type: "${tractorType}" == "${filterType}" ?',
        );
        if (tractorType != filterType) {
          print('      ❌ Rejeté: type ne correspond pas');
          return false;
        }
      }
      if (tractor.distance > _maxDistance) {
        print(
          '      ❌ Rejeté: distance trop grande (${tractor.distance.toStringAsFixed(1)} > ${_maxDistance})',
        );
        return false;
      }
      if (_minRating > 0.0 && tractor.rating < _minRating) {
        print(
          '      ❌ Rejeté: note insuffisante (${tractor.rating} < ${_minRating})',
        );
        return false;
      }
      if (_availabilityFilter == '24h' && !tractor.available) {
        print('      ❌ Rejeté: non disponible (24h requis)');
        return false;
      }
      if (_availabilityFilter == '48h' && !tractor.available) {
        print('      ❌ Rejeté: non disponible (48h requis)');
        return false;
      }
      print('      ✅ Accepté!');
      return true;
    }).toList();
    print('✅ FILTRAGE TERMINÉ: ${filtered.length} tracteurs');
    return filtered;
  }

  Widget _buildFilters(bool isWolof) {
    return Container(
      height: 60.0,
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        children: [
          _buildFilterChip(
            label: isWolof ? 'Lépp' : 'Tous',
            value: 'all',
            icon: Icons.grid_view,
          ),
          _buildFilterChip(
            label: isWolof ? 'Tracteur' : 'Tracteur',
            value: 'tractor',
            icon: Icons.agriculture,
          ),
          _buildFilterChip(
            label: isWolof ? 'Semoir' : 'Semoir',
            value: 'semoir',
            icon: Icons.eco,
          ),
          _buildFilterChip(
            label: isWolof ? 'Labour' : 'Labour',
            value: 'labour',
            icon: Icons.agriculture,
          ),
          _buildFilterChip(
            label: 'Offset',
            value: 'offset',
            icon: Icons.crop_rotate,
          ),
          _buildFilterChip(
            label: isWolof ? 'Semis' : 'Semis',
            value: 'semis',
            icon: Icons.eco,
          ),
          _buildFilterChip(
            label: isWolof ? 'Récolte' : 'Récolte',
            value: 'recolte',
            icon: Icons.grass,
          ),
        ],
      ),
    );
  }

  void _showFilterBottomSheet(bool isWolof) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          height: MediaQuery.of(context).size.height * 0.75,
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(24.0),
            ),
          ),
          padding: EdgeInsets.fromLTRB(
            24.0,
            24.0,
            24.0,
            24.0 + MediaQuery.of(context).padding.bottom,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
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
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10.0),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Theme.of(context).colorScheme.primary,
                          Theme.of(context).colorScheme.secondary,
                        ],
                      ),
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    child: const Icon(
                      Icons.tune,
                      color: Colors.white,
                      size: 24.0,
                    ),
                  ),
                  const SizedBox(width: 12.0),
                  Text(
                    isWolof ? 'Filtre yi' : 'Filtres avancés',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                ],
              ),
              const SizedBox(height: 24.0),
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        isWolof ? 'Xeetu liggéey' : 'Type de service',
                        style: Theme.of(context)
                            .textTheme
                            .titleMedium
                            ?.copyWith(fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 12.0),
                      Wrap(
                        spacing: 8.0,
                        runSpacing: 8.0,
                        children: [
                          _buildFilterChipOption(
                            'Tracteur',
                            'tractor',
                            isWolof,
                            setModalState,
                          ),
                          _buildFilterChipOption(
                            'Semoir',
                            'semoir',
                            isWolof,
                            setModalState,
                          ),
                          _buildFilterChipOption(
                            'Labour',
                            'labour',
                            isWolof,
                            setModalState,
                          ),
                          _buildFilterChipOption(
                            'Offset',
                            'offset',
                            isWolof,
                            setModalState,
                          ),
                          _buildFilterChipOption(
                            'Semis',
                            'semis',
                            isWolof,
                            setModalState,
                          ),
                          _buildFilterChipOption(
                            'Récolte',
                            'recolte',
                            isWolof,
                            setModalState,
                          ),
                          _buildFilterChipOption(
                            isWolof ? 'Lépp' : 'Tous',
                            'all',
                            isWolof,
                            setModalState,
                          ),
                        ],
                      ),
                      const SizedBox(height: 28.0),
                      Row(
                        children: [
                          Icon(
                            Icons.access_time,
                            color: Theme.of(context).colorScheme.primary,
                            size: 20.0,
                          ),
                          const SizedBox(width: 8.0),
                          Text(
                            isWolof
                                ? 'Disponibilité'
                                : 'Disponibilité Immédiate',
                            style: Theme.of(context)
                                .textTheme
                                .titleMedium
                                ?.copyWith(fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12.0),
                      Wrap(
                        spacing: 8.0,
                        runSpacing: 8.0,
                        children: [
                          _buildAvailabilityChip(
                            isWolof ? 'Lépp' : 'Tous',
                            'all',
                            Icons.all_inclusive,
                            setModalState,
                          ),
                          _buildAvailabilityChip(
                            '24h',
                            '24h',
                            Icons.schedule,
                            setModalState,
                          ),
                          _buildAvailabilityChip(
                            '48h',
                            '48h',
                            Icons.today,
                            setModalState,
                          ),
                        ],
                      ),
                      const SizedBox(height: 28.0),
                      Row(
                        children: [
                          const Icon(
                            Icons.star,
                            color: Colors.amber,
                            size: 20.0,
                          ),
                          const SizedBox(width: 8.0),
                          Text(
                            isWolof ? 'Note minimale' : 'Note de Fiabilité',
                            style: Theme.of(context)
                                .textTheme
                                .titleMedium
                                ?.copyWith(fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12.0),
                      Container(
                        padding: const EdgeInsets.all(16.0),
                        decoration: BoxDecoration(
                          color: Theme.of(
                            context,
                          ).colorScheme.primaryContainer.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(16.0),
                          border: Border.all(
                            color: Theme.of(
                              context,
                            ).colorScheme.primary.withValues(alpha: 0.3),
                          ),
                        ),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  isWolof ? 'Note minimale:' : 'Note minimale:',
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyMedium
                                      ?.copyWith(fontWeight: FontWeight.w600),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12.0,
                                    vertical: 6.0,
                                  ),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [
                                        Theme.of(context).colorScheme.primary,
                                        Theme.of(context).colorScheme.secondary,
                                      ],
                                    ),
                                    borderRadius: BorderRadius.circular(20.0),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Icon(
                                        Icons.star,
                                        color: Colors.white,
                                        size: 16.0,
                                      ),
                                      const SizedBox(width: 4.0),
                                      Text(
                                        _minRating == 0.0
                                            ? (isWolof ? 'Lépp' : 'Toutes')
                                            : _minRating.toStringAsFixed(1),
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12.0),
                            Slider(
                              value: _minRating,
                              min: 0.0,
                              max: 5.0,
                              divisions: 10,
                              activeColor: Theme.of(
                                context,
                              ).colorScheme.primary,
                              label: _minRating == 0.0
                                  ? (isWolof ? 'Lépp' : 'Toutes')
                                  : '${_minRating.toStringAsFixed(1)} ⭐',
                              onChanged: (value) {
                                setModalState(() {
                                  _minRating = value;
                                });
                              },
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 28.0),
                      Row(
                        children: [
                          Icon(
                            Icons.location_on,
                            color: Theme.of(context).colorScheme.primary,
                            size: 20.0,
                          ),
                          const SizedBox(width: 8.0),
                          Text(
                            isWolof ? 'Distance' : 'Distance maximale',
                            style: Theme.of(context)
                                .textTheme
                                .titleMedium
                                ?.copyWith(fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12.0),
                      Container(
                        padding: const EdgeInsets.all(16.0),
                        decoration: BoxDecoration(
                          color: Theme.of(
                            context,
                          ).colorScheme.primaryContainer.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(16.0),
                          border: Border.all(
                            color: Theme.of(
                              context,
                            ).colorScheme.primary.withValues(alpha: 0.3),
                          ),
                        ),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  isWolof ? 'Distance max:' : 'Distance max:',
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyMedium
                                      ?.copyWith(fontWeight: FontWeight.w600),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12.0,
                                    vertical: 6.0,
                                  ),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [
                                        Theme.of(context).colorScheme.primary,
                                        Theme.of(context).colorScheme.secondary,
                                      ],
                                    ),
                                    borderRadius: BorderRadius.circular(20.0),
                                  ),
                                  child: Text(
                                    '< ${_maxDistance.toInt()} km',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12.0),
                            Slider(
                              value: _maxDistance,
                              min: 1.0,
                              max: 50.0,
                              divisions: 49,
                              activeColor: Theme.of(
                                context,
                              ).colorScheme.primary,
                              label: '${_maxDistance.toInt()} km',
                              onChanged: (value) {
                                setModalState(() {
                                  _maxDistance = value;
                                });
                              },
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20.0),
                      _buildFilterHelp(isWolof),
                      const SizedBox(height: 24.0),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20.0),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        setModalState(() {
                          _selectedFilter = 'all';
                          _maxDistance = 10.0;
                          _availabilityFilter = 'all';
                          _minRating = 0.0;
                        });
                        setState(() {
                          _selectedFilter = 'all';
                          _maxDistance = 10.0;
                          _availabilityFilter = 'all';
                          _minRating = 0.0;
                        });
                      },
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16.0),
                        side: BorderSide(
                          color: Theme.of(context).colorScheme.primary,
                        ),
                      ),
                      child: Text(
                        isWolof ? 'Fattali' : 'Réinitialiser',
                        style: TextStyle(
                          fontSize: 16.0,
                          fontWeight: FontWeight.bold,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12.0),
                  Expanded(
                    flex: 2,
                    child: ElevatedButton(
                      onPressed: () {
                        setState(() {});
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              isWolof
                                  ? 'Filtre yi defar na'
                                  : 'Filtres appliqués',
                            ),
                            backgroundColor: Theme.of(
                              context,
                            ).colorScheme.secondaryContainer,
                            behavior: SnackBarBehavior.floating,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12.0),
                            ),
                            duration: const Duration(seconds: 2),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16.0),
                      ),
                      child: Text(
                        isWolof ? 'Jëfandikoo' : 'Appliquer',
                        style: const TextStyle(
                          fontSize: 16.0,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  TractorData _serviceToTractor(ServiceModel service) {
    final img = service.images.isNotEmpty ? service.images[0] : 'NONE';
    if (service.images.isEmpty) {
      print('🔍 SERVICE DATA DETECTED WITH EMPTY IMAGES: ${service.name}');
    }
    print(
        '🏠 Mapping Service to Tractor: ${service.name} - Img: ${img.length > 50 ? "${img.substring(0, 50)}..." : img}');
    String serviceTypeFr = service.serviceType;
    String serviceTypeWo = service.serviceType;
    String type = service.serviceType.toLowerCase();
    if (type.contains('labour') || type.contains('plowing')) {
      serviceTypeFr = 'Labour';
      serviceTypeWo = 'Dooleel';
      type = 'labour';
    } else if (type.contains('offset') || type.contains('harrowing')) {
      serviceTypeFr = 'Offset';
      serviceTypeWo = 'Offset';
      type = 'offset';
    } else if (type.contains('semis') ||
        type.contains('seeding') ||
        type.contains('planting')) {
      serviceTypeFr = 'Semis';
      serviceTypeWo = 'Semis';
      type = 'semis';
    } else if (type.contains('recolte') ||
        type.contains('harvest') ||
        type.contains('récolte')) {
      serviceTypeFr = 'Récolte';
      serviceTypeWo = 'Récolte';
      type = 'recolte';
    }
    const double userLat = 14.7167;
    const double userLng = -17.4677;
    final serviceLat = service.latitude ?? userLat;
    final serviceLng = service.longitude ?? userLng;
    double calculateDistance(
      double lat1,
      double lon1,
      double lat2,
      double lon2,
    ) {
      const double earthRadius = 6371;
      final dLat = _degreesToRadians(lat2 - lat1);
      final dLon = _degreesToRadians(lon2 - lon1);
      final a = sin(dLat / 2) * sin(dLat / 2) +
          cos(lat1) * cos(lat2) * sin(dLon / 2) * sin(dLon / 2);
      final c = 2 * atan2(sqrt(a), sqrt(1 - a));
      return earthRadius * c;
    }

    final distance = calculateDistance(
      userLat,
      userLng,
      serviceLat,
      serviceLng,
    );
    final imageUrl = service.images.isNotEmpty ? service.images[0] : '';
    print('🔄 Conversion Service → TractorData:');
    print('   Service ID: ${service.id}');
    print('   Service Name: ${service.name}');
    print('   Service Images: ${service.images}');
    print('   → Tractor imageUrl: $imageUrl');
    print('   Service Type: ${service.serviceType} → $type');
    print('   Distance calculée: ${distance.toStringAsFixed(1)} km');
    print('   ---');
    return TractorData(
      id: service.id,
      name: service.name,
      owner: service.provider?.fullName ?? 'Prestataire',
      pricePerHectare: service.pricePerDay / 8,
      distance: distance,
      rating: 4.5,
      reviewsCount: 0,
      imageUrl: imageUrl,
      lat: serviceLat,
      lng: serviceLng,
      type: type,
      available: service.availability,
      serviceType: serviceTypeFr,
      serviceTypeWolof: serviceTypeWo,
      providerName: service.provider?.fullName ?? 'Prestataire',
      providerPhone: service.provider?.phoneNumber,
      model: service.model ?? 'Unknown',
      brand: service.brand ?? 'Unknown',
      year: service.year ?? 0,
      technicalSpecifications: (() {
        Map<String, dynamic> specs =
            Map<String, dynamic>.from(service.technicalSpecifications ?? {});
        // Try to parse engine hours from description if not present in specs
        // Format: "Tracteur Model - Year - Heures: 120"
        if (!specs.containsKey('engineHours') &&
            service.description.contains('Heures:')) {
          final RegExp regex = RegExp(r'Heures:\s*(\d+)');
          final match = regex.firstMatch(service.description);
          if (match != null) {
            specs['engineHours'] = match.group(1);
          }
        }
        return specs;
      })(),
    );
  }

  Future<void> _createTestServices() async {
    final bool isWolof = widget.language == 'wo';
    final shouldCreate = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(
              Icons.add_circle,
              color: Theme.of(context).colorScheme.primary,
            ),
            const SizedBox(width: 8.0),
            const Flexible(
              child: Text(
                'Créer des services de test',
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Cette action va créer 3 services de test dans votre base de données :',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 16.0),
              _buildServicePreviewItem(
                Icons.agriculture,
                'Labour',
                '40,000 F/jour',
              ),
              const SizedBox(height: 8.0),
              _buildServicePreviewItem(
                Icons.crop_rotate,
                'Offset',
                '35,000 F/jour',
              ),
              const SizedBox(height: 8.0),
              _buildServicePreviewItem(Icons.eco, 'Semis', '30,000 F/jour'),
              const SizedBox(height: 16.0),
              Container(
                padding: const EdgeInsets.all(12.0),
                decoration: BoxDecoration(
                  color: Theme.of(
                    context,
                  ).colorScheme.errorContainer.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(8.0),
                  border: Border.all(
                    color: Theme.of(
                      context,
                    ).colorScheme.error.withValues(alpha: 0.5),
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      Icons.warning_amber_rounded,
                      size: 20.0,
                      color: Theme.of(context).colorScheme.error,
                    ),
                    const SizedBox(width: 8.0),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Attention',
                            style: Theme.of(context)
                                .textTheme
                                .bodySmall
                                ?.copyWith(
                                  color: Theme.of(context).colorScheme.error,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                          const SizedBox(height: 4.0),
                          Text(
                            'Votre compte doit avoir le rôle "provider" ou "admin" pour créer des services.',
                            style:
                                Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: Theme.of(
                                        context,
                                      ).colorScheme.onErrorContainer,
                                    ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.primary,
              foregroundColor: Colors.white,
            ),
            child: const Text('Créer'),
          ),
        ],
      ),
    );
    if (shouldCreate != true) {
      return;
    }
    if (!mounted) {
      return;
    }
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Center(
        child: Container(
          padding: const EdgeInsets.all(24.0),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(16.0),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(
                color: Theme.of(context).colorScheme.primary,
              ),
              const SizedBox(height: 16.0),
              Text(
                'Création des services...',
                style: Theme.of(context).textTheme.titleMedium,
              ),
            ],
          ),
        ),
      ),
    );
    try {
      final services = [
        {
          'serviceType': 'labour',
          'name': 'John Deere 5065E - Labour',
          'description':
              'Tracteur performant pour labour des terres agricoles. Équipé de charrue moderne.',
          'pricePerHour': 5000.0,
          'pricePerDay': 40000.0,
          'images': [],
          'latitude': 14.7167,
          'longitude': -17.4677,
        },
        {
          'serviceType': 'offset',
          'name': 'Massey Ferguson 385 - Offset',
          'description':
              'Tracteur idéal pour offset et hersage. Très maniable et économique.',
          'pricePerHour': 4375.0,
          'pricePerDay': 35000.0,
          'images': [],
          'latitude': 14.6928,
          'longitude': -17.4467,
        },
        {
          'serviceType': 'semis',
          'name': 'New Holland TD5 - Semis',
          'description':
              'Tracteur spécialisé pour semis de précision. Rendement optimal garanti.',
          'pricePerHour': 3750.0,
          'pricePerDay': 30000.0,
          'images': [],
          'latitude': 14.75,
          'longitude': -17.42,
        },
      ];
      int successCount = 0;
      String? firstError;
      for (final serviceData in services) {
        try {
          final result = await ServicesCollection.instance.createService(
            serviceType: serviceData['serviceType'] as String,
            name: serviceData['name'] as String,
            description: serviceData['description'] as String,
            pricePerHour: serviceData['pricePerHour'] as double,
            pricePerDay: serviceData['pricePerDay'] as double,
            images: [],
            latitude: serviceData['latitude'] as double,
            longitude: serviceData['longitude'] as double,
          );
          if (result.success) {
            successCount++;
            print('✅ Service créé: ${serviceData['name']}');
          }
        } catch (e) {
          print('❌ Erreur création service: ${e}');
          if (firstError == null) {
            if (e.toString().contains('403') ||
                e.toString().contains('Accès interdit')) {
              firstError =
                  'Votre compte n\'a pas les permissions nécessaires. Vous devez avoir le rôle "provider" pour créer des services.';
            } else {
              firstError = e.toString();
            }
          }
        }
      }
      if (mounted) {
        Navigator.pop(context);
      }
      await _loadServices();
      if (mounted) {
        if (successCount == 0 && firstError != null) {
          showDialog(
            context: context,
            builder: (context) => AlertDialog(
              title: Row(
                children: [
                  Icon(
                    Icons.error_outline,
                    color: Theme.of(context).colorScheme.error,
                  ),
                  const SizedBox(width: 8.0),
                  const Text('Erreur'),
                ],
              ),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'La création des services a échoué :',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 8.0),
                  Text(
                    firstError!,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(height: 16.0),
                  Container(
                    padding: const EdgeInsets.all(12.0),
                    decoration: BoxDecoration(
                      color: Theme.of(
                        context,
                      ).colorScheme.primaryContainer.withValues(alpha: 0.3),
                      borderRadius: BorderRadius.circular(8.0),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.lightbulb_outline,
                              size: 16.0,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                            const SizedBox(width: 8.0),
                            Text(
                              'Solution :',
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(
                                    fontWeight: FontWeight.bold,
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.primary,
                                  ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8.0),
                        Text(
                          'Contactez un administrateur pour obtenir le rôle "provider" ou créez un nouveau compte avec ce rôle.',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              actions: [
                ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context).colorScheme.primary,
                    foregroundColor: Colors.white,
                  ),
                  child: const Text('OK'),
                ),
              ],
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                successCount == services.length
                    ? '✅ ${successCount} services créés avec succès !'
                    : '⚠️ ${successCount}/${services.length} services créés',
              ),
              backgroundColor: successCount == services.length
                  ? const Color(0xff2d5016)
                  : Colors.orange,
              behavior: SnackBarBehavior.floating,
              duration: const Duration(seconds: 3),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        Navigator.pop(context);
      }
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('❌ Erreur: ${e.toString()}'),
            backgroundColor: Theme.of(context).colorScheme.error,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }
}
