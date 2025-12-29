// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:allotracteur/tractor_data.dart';
import 'package:allotracteur/components/tractor_card.dart';
import 'package:allotracteur/pages/tractor_detail_screen.dart';
import 'package:allotracteur/globals/app_state.dart';
import 'package:allotracteur/pages/login_screen.dart';

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

  bool _isMapView = true;

  String _selectedFilter = 'all';

  double _maxDistance = 10.0;

  String _availabilityFilter = 'all';

  double _minRating = 0.0;

  final List<TractorData> _tractors = [
    TractorData(
      id: '1',
      name: 'John Deere 5065E',
      owner: 'Mamadou Diop',
      pricePerHectare: 40000.0,
      distance: 2.5,
      rating: 4.8,
      reviewsCount: 24,
      imageUrl:
          'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      lat: 14.7167,
      lng: -17.4677,
      type: 'labour',
      available: true,
      serviceType: 'Labour',
      serviceTypeWolof: 'Dooleel',
    ),
    TractorData(
      id: '2',
      name: 'Massey Ferguson 385',
      owner: 'Fatou Sall',
      pricePerHectare: 35000.0,
      distance: 4.2,
      rating: 4.6,
      reviewsCount: 18,
      imageUrl:
          'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=400',
      lat: 14.7197,
      lng: -17.4607,
      type: 'offset',
      available: true,
      serviceType: 'Offset',
      serviceTypeWolof: 'Offset',
    ),
    TractorData(
      id: '3',
      name: 'New Holland TD5',
      owner: 'Ibrahima Ndiaye',
      pricePerHectare: 30000.0,
      distance: 6.8,
      rating: 4.9,
      reviewsCount: 32,
      imageUrl:
          'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
      lat: 14.7127,
      lng: -17.4707,
      type: 'reprofilage',
      available: false,
      serviceType: 'Reprofilage',
      serviceTypeWolof: 'Reprofilaj',
    ),
  ];

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
      selectedColor: const Color(0xffe56d4b),
      labelStyle: TextStyle(
        color:
            isSelected ? Colors.white : Theme.of(context).colorScheme.onSurface,
        fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
      ),
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
                  gradient: const LinearGradient(
                    colors: [Color(0xffffda79), Color(0xfff19066)],
                  ),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xffe56d4b).withValues(alpha: 0.5),
                      blurRadius: 8.0,
                      offset: const Offset(0.0, 2.0),
                    ),
                  ],
                ),
                child: Text(
                  activeFiltersCount.toString(),
                  style: const TextStyle(
                    color: Colors.white,
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

  List<TractorData> _getFilteredTractors() {
    return _tractors.where((tractor) {
      if (_selectedFilter != 'all' && tractor.type != _selectedFilter) {
        return false;
      }
      if (tractor.distance > _maxDistance) {
        return false;
      }
      if (_minRating > 0.0 && tractor.rating < _minRating) {
        return false;
      }
      if (_availabilityFilter == '24h' && !tractor.available) {
        return false;
      }
      if (_availabilityFilter == '48h' && !tractor.available) {
        return false;
      }
      return true;
    }).toList();
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
                widget.language == 'wo'
                    ? 'Soppi sa filtre yi'
                    : 'Essayez de modifier vos filtres',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
              ),
              const SizedBox(height: 24.0),
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

  Widget _buildMapView() {
    final filteredTractors = _getFilteredTractors();
    return Container(
      color: Theme.of(context).colorScheme.surfaceContainerHighest,
      child: Stack(
        children: [
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(24.0),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xffe56d4b).withValues(alpha: 0.3),
                        blurRadius: 20.0,
                        offset: const Offset(0.0, 10.0),
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.location_on,
                    size: 64.0,
                    color: Color(0xffe56d4b),
                  ),
                ),
                const SizedBox(height: 24.0),
                Text(
                  'Vue Carte Interactive',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                ),
                const SizedBox(height: 8.0),
                Text(
                  'Bientôt disponible avec Google Maps',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                ),
                const SizedBox(height: 24.0),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20.0,
                    vertical: 12.0,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xffe56d4b).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(20.0),
                    border: Border.all(
                      color: const Color(0xffe56d4b).withValues(alpha: 0.3),
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.info_outline,
                        size: 20.0,
                        color: Color(0xffe56d4b),
                      ),
                      const SizedBox(width: 8.0),
                      Text(
                        '${filteredTractors.length} tracteurs disponibles',
                        style: const TextStyle(
                          color: Color(0xffe56d4b),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Positioned(
            top: 16.0,
            right: 16.0,
            child: Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 16.0,
                vertical: 8.0,
              ),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xffe56d4b), Color(0xfff19066)],
                ),
                borderRadius: BorderRadius.circular(20.0),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xffe56d4b).withValues(alpha: 0.3),
                    blurRadius: 8.0,
                    offset: const Offset(0.0, 4.0),
                  ),
                ],
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.construction, color: Colors.white, size: 16.0),
                  SizedBox(width: 6.0),
                  Text(
                    'En développement',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 12.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
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
            const Color(0xffffda79).withValues(alpha: 0.2),
            const Color(0xfff19066).withValues(alpha: 0.1),
          ],
        ),
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(
          color: const Color(0xffe56d4b).withValues(alpha: 0.2),
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
                  gradient: const LinearGradient(
                    colors: [Color(0xffe56d4b), Color(0xfff19066)],
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
      selectedColor: const Color(0xffe56d4b),
      labelStyle: TextStyle(
        color:
            isSelected ? Colors.white : Theme.of(context).colorScheme.onSurface,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
      ),
    );
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
                    Text(
                      isWolof ? 'Asalaam alekum!' : 'Bonjour !',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
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
              suffixIcon: IconButton(
                icon: const Icon(Icons.my_location),
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: Row(
                        children: [
                          Icon(
                            Icons.location_on,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                          const SizedBox(width: 8.0),
                          Text(isWolof ? 'Sa bes' : 'Votre position'),
                        ],
                      ),
                      content: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.gps_fixed,
                            size: 48.0,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                          const SizedBox(height: 16.0),
                          Text(
                            isWolof ? 'Dakar, Sénégal' : 'Dakar, Sénégal',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: 8.0),
                          Text(
                            isWolof
                                ? 'Latitude: 14.7167\nLongitude: -17.4677'
                                : 'Latitude: 14.7167\nLongitude: -17.4677',
                            textAlign: TextAlign.center,
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: Text(isWolof ? 'Tëj' : 'Fermer'),
                        ),
                        ElevatedButton.icon(
                          onPressed: () {
                            Navigator.pop(context);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  isWolof
                                      ? 'Daldi jappale sa bes...'
                                      : 'Localisation en cours...',
                                ),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Theme.of(
                              context,
                            ).colorScheme.primary,
                            foregroundColor: Colors.white,
                          ),
                          icon: const Icon(Icons.refresh),
                          label: Text(isWolof ? 'Yéesal' : 'Actualiser'),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
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
                      gradient: const LinearGradient(
                        colors: [Color(0xffe56d4b), Color(0xfff19066)],
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
                                    gradient: const LinearGradient(
                                      colors: [
                                        Color(0xffe56d4b),
                                        Color(0xfff19066),
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
                                    gradient: const LinearGradient(
                                      colors: [
                                        Color(0xffe56d4b),
                                        Color(0xfff19066),
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
                            backgroundColor: const Color(0xff4caf50),
                            behavior: SnackBarBehavior.floating,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12.0),
                            ),
                            duration: const Duration(seconds: 2),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xffe56d4b),
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
                        Text(
                          'Mamadou Diop',
                          style: Theme.of(context)
                              .textTheme
                              .titleLarge
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        Text(
                          isWolof ? 'Jëfandikukat' : 'Utilisateur',
                          style:
                              Theme.of(context).textTheme.bodyMedium?.copyWith(
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
                    colors: [const Color(0xffe56d4b), const Color(0xfff19066)],
                  ),
                  borderRadius: BorderRadius.circular(16.0),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xffe56d4b).withValues(alpha: 0.3),
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
                      const Color(0xffffda79).withValues(alpha: 0.2),
                      const Color(0xfff19066).withValues(alpha: 0.1),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(16.0),
                  border: Border.all(
                    color: const Color(0xffe56d4b).withValues(alpha: 0.3),
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
                            gradient: const LinearGradient(
                              colors: [
                                Color(0xffe56d4b),
                                Color(0xfff19066),
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
                      const Color(0xffffda79),
                    ),
                    const SizedBox(height: 12.0),
                    _buildReservationStatusItem(
                      Icons.check_circle,
                      isWolof ? 'Accepté' : 'Acceptées',
                      '1',
                      const Color(0xff4caf50),
                    ),
                    const SizedBox(height: 12.0),
                    _buildReservationStatusItem(
                      Icons.agriculture,
                      isWolof ? 'Ci liggéey' : 'En cours',
                      '1',
                      const Color(0xff2d5016),
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
                      title: Text(isWolof ? 'Génn?' : 'Déconnexion?'),
                      content: Text(
                        isWolof
                            ? 'Bëgg nga génn?'
                            : 'Voulez-vous vraiment vous déconnexer ?',
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(dialogContext, false),
                          child: Text(isWolof ? 'Deedeet' : 'Annuler'),
                        ),
                        ElevatedButton(
                          onPressed: () {
                            Navigator.pop(dialogContext, true);
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                            foregroundColor: Colors.white,
                          ),
                          child: Text(isWolof ? 'Génn' : 'Déconnexion'),
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
                    color: Colors.red.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12.0),
                    border: Border.all(
                      color: Colors.red.withValues(alpha: 0.3),
                      width: 1.5,
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.logout, color: Colors.red, size: 22.0),
                      const SizedBox(width: 12.0),
                      Text(
                        isWolof ? 'Génn' : 'Se déconnecter',
                        style: const TextStyle(
                          color: Colors.red,
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
}
