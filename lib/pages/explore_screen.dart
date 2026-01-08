import 'dart:math';

import 'package:flutter/material.dart';
import 'package:hallo/models/service_model.dart';
import 'package:hallo/tractor_data.dart';
import 'package:hallo/pages/login_screen.dart';
import 'package:hallo/pages/welcome_screen.dart';
import 'package:hallo/services_collection.dart';
import 'package:hallo/components/tractor_card.dart';
import 'package:hallo/components/interactive_map_screen.dart';

class ExploreScreen extends StatefulWidget {
    const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() {
    return _ExploreScreenState();
  }
}

class _ExploreScreenState extends State<ExploreScreen> {
  bool _showBanner = true;

  int _currentIndex = 0;

  bool _isMapView = true;

  String _selectedFilter = 'all';

  double _maxDistance = 10.0;

  String _availabilityFilter = 'all';

  double _minRating = 0.0;

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

  bool _isLoading = true;

  List<ServiceModel> _services = [];

  List<TractorData> get _tractors {
    return _services.map((service) => _serviceToTractor(service)).toList();
  }

  Widget _buildStatCard({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: color.withValues(alpha: 0.3), width: 1.0),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 28.0),
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
              color: color.withValues(alpha: 0.8),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildServiceChip(String label, IconData icon, String wolofLabel) {
    return InkWell(
      onTap: () {
        _showLoginPrompt();
      },
      borderRadius: BorderRadius.circular(20.0),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Theme.of(context).colorScheme.primaryContainer,
              Theme.of(context).colorScheme.secondaryContainer,
            ],
          ),
          borderRadius: BorderRadius.circular(20.0),
          border: Border.all(
            color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.3),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 20.0,
              color: Theme.of(context).colorScheme.primary,
            ),
            const SizedBox(width: 8.0),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13.0,
                    color: Theme.of(context).colorScheme.onPrimaryContainer,
                  ),
                ),
                Text(
                  wolofLabel,
                  style: TextStyle(
                    fontSize: 10.0,
                    color: Theme.of(
                      context,
                    ).colorScheme.onPrimaryContainer.withValues(alpha: 0.7),
                  ),
                ),
              ],
            ),
          ],
        ),
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

  String _getActiveFiltersText() {
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
    return 'Filtres: ${filters.join(' • ')}';
  }

  Widget _buildViewToggle() {
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
                      '${filteredTractors.length} tracteurs disponibles',
                      style: Theme.of(context).textTheme.titleSmall,
                    ),
                    if (hasActiveFilters) ...[
                      const SizedBox(height: 4.0),
                      Text(
                        _getActiveFiltersText(),
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

  Widget _buildFeatureCard({
    required IconData icon,
    required String title,
    required String description,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12.0),
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(12.0),
            ),
            child: Icon(icon, color: Colors.white, size: 24.0),
          ),
          const SizedBox(width: 16.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: color,
                      ),
                ),
                const SizedBox(height: 4.0),
                Text(
                  description,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
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
                      'AlloTracteur',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                    ),
                    Text(
                      'Trouvez votre tracteur',
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
                  _showLoginPrompt();
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
              hintText: 'Rechercher un tracteur...',
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
                          const Text('Votre position'),
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
                            'Dakar, Sénégal',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: 8.0),
                          Text(
                            'Latitude: 14.7167\nLongitude: -17.4677',
                            textAlign: TextAlign.center,
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text('Fermer'),
                        ),
                        ElevatedButton.icon(
                          onPressed: () {
                            Navigator.pop(context);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Localisation en cours...'),
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
                          label: const Text('Actualiser'),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            onTap: () {
              _showLoginPrompt();
            },
            readOnly: true,
          ),
        ],
      ),
    );
  }

  Widget _buildGuestBanner() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Theme.of(context).colorScheme.primary,
            Theme.of(context).colorScheme.secondary,
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.2),
            blurRadius: 8.0,
            offset: const Offset(0.0, 2.0),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6.0),
            decoration: const BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.explore,
              color: Theme.of(context).colorScheme.primary,
              size: 18.0,
            ),
          ),
          const SizedBox(width: 10.0),
          Expanded(
            child: Text(
              'Mode Exploration - Connectez-vous pour réserver',
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.95),
                fontSize: 13.0,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const LoginScreen()),
              );
            },
            style: TextButton.styleFrom(
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(
                horizontal: 12.0,
                vertical: 6.0,
              ),
            ),
            child: const Text(
              'Connexion',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.0),
            ),
          ),
          IconButton(
            onPressed: () {
              setState(() {
                _showBanner = false;
              });
            },
            icon: const Icon(Icons.close, color: Colors.white, size: 18.0),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
          ),
        ],
      ),
    );
  }

  Widget _buildProfilePlaceholder() {
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
                Icons.person_off,
                size: 64.0,
                color: Theme.of(context).colorScheme.primary,
              ),
            ),
            const SizedBox(height: 24.0),
            Text(
              'Connectez-vous pour accéder',
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12.0),
            Text(
              'Créez un compte ou connectez-vous pour accéder à votre profil et vos réservations',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
            const SizedBox(height: 24.0),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginScreen()),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 32.0,
                  vertical: 16.0,
                ),
              ),
              child: const Text(
                'Se connecter',
                style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showLoginPrompt() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24.0)),
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
            Container(
              padding: const EdgeInsets.all(20.0),
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
                Icons.lock_open,
                color: Colors.white,
                size: 40.0,
              ),
            ),
            const SizedBox(height: 24.0),
            Text(
              'Connexion requise',
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12.0),
            Text(
              'Pour réserver des tracteurs et accéder à toutes les fonctionnalités, vous devez créer un compte ou vous connecter',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
            const SizedBox(height: 32.0),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const WelcomeScreen(
                        name: '',
                        userType: 'signup',
                        language: 'fr',
                      ),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                ),
                child: const Text(
                  'S\'inscrire',
                  style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            const SizedBox(height: 12.0),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const LoginScreen(),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.tertiary,
                  foregroundColor: Theme.of(context).colorScheme.onTertiary,
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                  elevation: 0.0,
                ),
                child: Text(
                  'Se connecter',
                  style: TextStyle(
                    fontSize: 16.0,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.onTertiary,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12.0),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: Text(
                'Continuer l\'exploration',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
            ),
          ],
        ),
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

  Widget _buildFilterChipOption(
    String label,
    String value,
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeInOut,
              height: _showBanner ? null : 0.0,
              child:
                  _showBanner ? _buildGuestBanner() : const SizedBox.shrink(),
            ),
            if (_currentIndex == 0) ...[
              _buildHeader(),
              _buildFilters(),
              _buildViewToggle(),
              Expanded(child: _isMapView ? _buildMapView() : _buildListView()),
            ] else
              Expanded(child: _buildProfilePlaceholder()),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 10.0,
              offset: const Offset(0.0, -5),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) {
            if (index != 0) {
              _showLoginPrompt();
            } else {
              setState(() {
                _currentIndex = index;
              });
            }
          },
          type: BottomNavigationBarType.fixed,
          selectedItemColor: Theme.of(context).colorScheme.primary,
          unselectedItemColor: Theme.of(context).colorScheme.onSurfaceVariant,
          selectedFontSize: 12.0,
          unselectedFontSize: 11.0,
          elevation: 0.0,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.explore),
              label: 'Explorer',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.book_online),
              label: 'Réservations',
            ),
            BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profil'),
          ],
        ),
      ),
      floatingActionButton: _currentIndex == 0
          ? Stack(
              children: [
                FloatingActionButton.extended(
                  onPressed: () {
                    _showFilterBottomSheet();
                  },
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  icon: const Icon(Icons.tune, color: Colors.white),
                  label: const Text(
                    'Filtrer',
                    style: TextStyle(
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
                        color: Theme.of(context).colorScheme.secondary,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Theme.of(
                              context,
                            ).colorScheme.secondary.withValues(alpha: 0.4),
                            blurRadius: 8.0,
                            offset: const Offset(0.0, 2.0),
                          ),
                        ],
                      ),
                      child: Text(
                        activeFiltersCount.toString(),
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.onSecondary,
                          fontSize: 12.0,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            )
          : null,
    );
  }

  Widget _buildFilterHelp() {
    return Container(
      margin: const EdgeInsets.only(top: 16.0),
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Theme.of(
          context,
        ).colorScheme.primaryContainer.withValues(alpha: 0.4),
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
                  color: Theme.of(context).colorScheme.primary,
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
                'Aide aux filtres',
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
            'Disponibilité Immédiate',
            'Trouvez un prestataire libre sous 24-48h',
          ),
          const SizedBox(height: 8.0),
          _buildHelpItem(
            Icons.star,
            'Note de Fiabilité',
            'Sélectionnez les prestataires les mieux notés',
          ),
          const SizedBox(height: 8.0),
          _buildHelpItem(
            Icons.location_on,
            'Distance Max',
            'Limitez la distance de recherche',
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
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: Theme.of(context).colorScheme.onPrimaryContainer,
                    ),
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

  @override
  void initState() {
    super.initState();
    _loadServices();
  }

  double _degreesToRadians(double degrees) {
    return degrees * 3.14159265359 / 180.0;
  }

  TractorData _serviceToTractor(ServiceModel service) {
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
    return TractorData(
      id: service.id,
      name: service.name,
      owner: 'Prestataire',
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
    );
  }

  Future<void> _loadServices() async {
    setState(() {
      _isLoading = true;
    });
    try {
      print('🔄 [ExploreScreen] Chargement des services depuis le backend...');
      final response = await ServicesCollection.instance.getAllServices(
        page: 1,
        limit: 50,
      );
      if (response.success) {
        print(
          '✅ [ExploreScreen] Services récupérés du backend: ${response.data.length}',
        );
        setState(() {
          _services = response.data;
          _isLoading = false;
        });
        print(
          '🚜 [ExploreScreen] Total tracteurs après conversion: ${_tractors.length}',
        );
      } else {
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      print('❌ [ExploreScreen] Erreur lors du chargement des services: ${e}');
      setState(() {
        _isLoading = false;
      });
    }
  }

  Widget _buildFilters() {
    return Container(
      height: 60.0,
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        children: [
          _buildFilterChip(label: 'Tous', value: 'all', icon: Icons.grid_view),
          _buildFilterChip(
            label: 'Tracteur',
            value: 'tractor',
            icon: Icons.agriculture,
          ),
          _buildFilterChip(label: 'Semoir', value: 'semoir', icon: Icons.eco),
          _buildFilterChip(
            label: 'Labour',
            value: 'labour',
            icon: Icons.agriculture,
          ),
          _buildFilterChip(
            label: 'Offset',
            value: 'offset',
            icon: Icons.crop_rotate,
          ),
          _buildFilterChip(label: 'Semis', value: 'semis', icon: Icons.eco),
          _buildFilterChip(
            label: 'Récolte',
            value: 'recolte',
            icon: Icons.grass,
          ),
        ],
      ),
    );
  }

  void _showFilterBottomSheet() {
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
                    'Filtres avancés',
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
                        'Type de service',
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
                            setModalState,
                          ),
                          _buildFilterChipOption(
                            'Semoir',
                            'semoir',
                            setModalState,
                          ),
                          _buildFilterChipOption(
                            'Labour',
                            'labour',
                            setModalState,
                          ),
                          _buildFilterChipOption(
                            'Offset',
                            'offset',
                            setModalState,
                          ),
                          _buildFilterChipOption(
                            'Semis',
                            'semis',
                            setModalState,
                          ),
                          _buildFilterChipOption(
                            'Récolte',
                            'recolte',
                            setModalState,
                          ),
                          _buildFilterChipOption('Tous', 'all', setModalState),
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
                            'Disponibilité Immédiate',
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
                            'Tous',
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
                            'Note de Fiabilité',
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
                                  'Note minimale:',
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
                                            ? 'Toutes'
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
                                  ? 'Toutes'
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
                            'Distance maximale',
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
                                  'Distance max:',
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
                      _buildFilterHelp(),
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
                          color: Theme.of(context).colorScheme.tertiary,
                          width: 1.5,
                        ),
                      ),
                      child: Text(
                        'Réinitialiser',
                        style: TextStyle(
                          fontSize: 16.0,
                          fontWeight: FontWeight.bold,
                          color: Theme.of(context).colorScheme.tertiary,
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
                            content: const Text('Filtres appliqués'),
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
                      child: const Text(
                        'Appliquer',
                        style: TextStyle(
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

  Widget _buildListView() {
    final filteredTractors = _getFilteredTractors();
    if (_isLoading) {
      return Center(
        child: CircularProgressIndicator(
          color: Theme.of(context).colorScheme.primary,
        ),
      );
    }
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
                  color: Theme.of(
                    context,
                  ).colorScheme.primaryContainer.withValues(alpha: 0.3),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: Theme.of(
                      context,
                    ).colorScheme.primary.withValues(alpha: 0.2),
                    width: 2.0,
                  ),
                ),
                child: Icon(
                  Icons.search_off,
                  size: 64.0,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
              const SizedBox(height: 24.0),
              Text(
                _services.isEmpty
                    ? 'Chargement des tracteurs...'
                    : 'Aucun tracteur trouvé',
                style: Theme.of(
                  context,
                ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12.0),
              Text(
                _services.isEmpty
                    ? 'Veuillez patienter'
                    : 'Essayez de modifier vos filtres',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
              ),
              const SizedBox(height: 24.0),
              if (_services.isNotEmpty)
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
                    foregroundColor: Theme.of(context).colorScheme.onPrimary,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24.0,
                      vertical: 16.0,
                    ),
                  ),
                  icon: const Icon(Icons.refresh),
                  label: const Text('Réinitialiser'),
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
        language: 'fr',
        onTap: () {
          _showLoginPrompt();
        },
      ),
    );
  }

  Widget _buildMapView() {
    final filteredTractors = _getFilteredTractors();
    if (_isLoading) {
      return Center(
        child: CircularProgressIndicator(
          color: Theme.of(context).colorScheme.primary,
        ),
      );
    }
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
                  color: Theme.of(
                    context,
                  ).colorScheme.primaryContainer.withValues(alpha: 0.3),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.map_outlined,
                  size: 64.0,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
              const SizedBox(height: 24.0),
              Text(
                _services.isEmpty
                    ? 'Chargement des tracteurs...'
                    : 'Aucun tracteur trouvé',
                style: Theme.of(
                  context,
                ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8.0),
              Text(
                _services.isEmpty
                    ? 'Veuillez patienter'
                    : 'Modifiez vos filtres pour afficher des tracteurs',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
              ),
            ],
          ),
        ),
      );
    }
    return InteractiveMapScreen(
      tractors: filteredTractors,
      language: 'fr',
      onReserveTap: (tractor) {
        _showLoginPrompt();
      },
    );
  }
}
