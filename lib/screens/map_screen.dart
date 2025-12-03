import 'package:flutter/material.dart';
import 'package:agro_boost/core/constants/app_colors.dart';
import 'package:agro_boost/core/constants/app_styles.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({Key? key}) : super(key: key);

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  String _selectedFilter = 'all';
  bool _showList = false;
  double _zoom = 10.0;

  // Services sur la carte
  final List<MapService> mapServices = [
    MapService(
      id: '1',
      title: 'Tracteur MASSEY FERGUSON',
      latitude: 14.1456,
      longitude: -14.6928,
      category: 'tractor',
      distance: '2.3 km',
      rating: 4.8,
    ),
    MapService(
      id: '2',
      title: 'Semoir mécanique JOHN DEERE',
      latitude: 13.7720,
      longitude: -14.1948,
      category: 'seeder',
      distance: '5.1 km',
      rating: 4.5,
    ),
    MapService(
      id: '3',
      title: 'Opérateur agricole',
      latitude: 14.6756,
      longitude: -17.2398,
      category: 'operator',
      distance: '8.7 km',
      rating: 4.9,
    ),
    MapService(
      id: '4',
      title: 'Pulvérisateur STIHL',
      latitude: 14.7167,
      longitude: -17.4674,
      category: 'equipment',
      distance: '1.5 km',
      rating: 4.6,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.veryLightGrey,
      // ⚠️ PAS d'appBar - laisser la place pour la carte
      body: Stack(
        children: [
          // =========================================
          // 1️⃣ CARTE (PLACEHOLDER) - OCCUPE TOUT L'ÉCRAN
          // =========================================
          Positioned.fill(
            child: _buildMapPlaceholder(),
          ),

          // =========================================
          // 2️⃣ BARRE SUPÉRIEURE (RECHERCHE + FILTRES)
          // =========================================
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: _buildTopBar(),
          ),

          // =========================================
          // 3️⃣ BOUTON ZOOM
          // =========================================
          Positioned(
            bottom: 280,
            right: 16,
            child: _buildZoomButtons(),
          ),

          // =========================================
          // 4️⃣ BOUTON LOCALISATION
          // =========================================
          Positioned(
            bottom: 280,
            left: 16,
            child: _buildLocationButton(),
          ),

          // =========================================
          // 5️⃣ PANNEAU INFÉRIEUR (SERVICES)
          // =========================================
          if (!_showList)
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: _buildBottomSheet(),
            ),

          // =========================================
          // 6️⃣ VUE LISTE (OPTIONNEL)
          // =========================================
          if (_showList)
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: _buildListView(),
            ),
        ],
      ),
    );
  }

  // =========================================
  // 🔷 CARTE (PLACEHOLDER)
  // =========================================
  Widget _buildMapPlaceholder() {
    return Container(
      color: Colors.blue.shade100,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.map,
            size: 80,
            color: Colors.blue.shade300,
          ),
          const SizedBox(height: AppStyles.spacing16),
          Text(
            'Google Maps Placeholder',
            style: AppStyles.headingSmall.copyWith(
              color: Colors.blue.shade700,
            ),
          ),
          const SizedBox(height: AppStyles.spacing8),
          Text(
            'Remplacer par Google Maps API',
            style: AppStyles.bodyMedium.copyWith(
              color: Colors.blue.shade600,
            ),
          ),
          const SizedBox(height: AppStyles.spacing32),
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppStyles.spacing16,
              vertical: AppStyles.spacing12,
            ),
            decoration: BoxDecoration(
              color: Colors.blue.shade50,
              borderRadius: BorderRadius.circular(AppStyles.radiusMedium),
              border: Border.all(color: Colors.blue.shade200),
            ),
            child: Column(
              children: [
                Text(
                  '📍 ${mapServices.length} Services détectés',
                  style: AppStyles.bodyMedium.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Colors.blue.shade700,
                  ),
                ),
                const SizedBox(height: AppStyles.spacing8),
                Text(
                  'Voir ci-dessous',
                  style: AppStyles.caption.copyWith(
                    color: Colors.blue.shade600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // =========================================
  // 🔷 BARRE SUPÉRIEURE
  // =========================================
  Widget _buildTopBar() {
    return SafeArea(
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(AppStyles.spacing12),
          child: Column(
            children: [
              // Barre recherche
              TextField(
                decoration: InputDecoration(
                  hintText: 'Chercher un service...',
                  hintStyle: AppStyles.caption,
                  prefixIcon: const Icon(
                    Icons.search,
                    color: AppColors.grey,
                  ),
                  filled: true,
                  fillColor: AppColors.lightGrey,
                  border: OutlineInputBorder(
                    borderRadius:
                    BorderRadius.circular(AppStyles.radiusMedium),
                    borderSide: BorderSide.none,
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: AppStyles.spacing12,
                    vertical: AppStyles.spacing8,
                  ),
                ),
              ),
              const SizedBox(height: AppStyles.spacing12),
              // Filtres
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _buildFilterChip('Tous', 'all', Icons.apps),
                    _buildFilterChip(
                        'Tracteurs', 'tractor', Icons.agriculture),
                    _buildFilterChip('Opérateurs', 'operator', Icons.people),
                    _buildFilterChip(
                        'Équipement', 'equipment', Icons.build),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFilterChip(String label, String value, IconData icon) {
    bool isSelected = _selectedFilter == value;
    return Padding(
      padding: const EdgeInsets.only(right: AppStyles.spacing8),
      child: FilterChip(
        label: Row(
          children: [
            Icon(
              icon,
              size: 14,
              color: isSelected ? Colors.white : AppColors.primaryGreen,
            ),
            const SizedBox(width: 4),
            Text(label),
          ],
        ),
        selected: isSelected,
        onSelected: (selected) {
          setState(() => _selectedFilter = value);
        },
        backgroundColor: Colors.white,
        selectedColor: AppColors.primaryGreen,
        side: BorderSide(
          color: isSelected ? AppColors.primaryGreen : AppColors.border,
        ),
        labelStyle: TextStyle(
          color: isSelected ? Colors.white : AppColors.primaryGreen,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          fontSize: 12,
        ),
      ),
    );
  }

  // =========================================
  // 🔷 BOUTONS DE ZOOM
  // =========================================
  Widget _buildZoomButtons() {
    return Column(
      children: [
        // Zoom +
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 4,
              ),
            ],
          ),
          child: IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              setState(() => _zoom++);
            },
          ),
        ),
        const SizedBox(height: 8),
        // Zoom -
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 4,
              ),
            ],
          ),
          child: IconButton(
            icon: const Icon(Icons.remove),
            onPressed: () {
              setState(() => _zoom--);
            },
          ),
        ),
      ],
    );
  }

  // =========================================
  // 🔷 BOUTON LOCALISATION
  // =========================================
  Widget _buildLocationButton() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
          ),
        ],
      ),
      child: IconButton(
        icon: const Icon(
          Icons.my_location,
          color: AppColors.primaryGreen,
        ),
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Localisation actuelle'),
              duration: Duration(seconds: 1),
            ),
          );
        },
      ),
    );
  }

  // =========================================
  // 🔷 PANNEAU INFÉRIEUR
  // =========================================
  Widget _buildBottomSheet() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Barre drag
          Padding(
            padding: const EdgeInsets.symmetric(vertical: AppStyles.spacing12),
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.grey,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          // Titre + Bouton liste
          Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppStyles.spacing16,
              vertical: AppStyles.spacing8,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Services à proximité',
                  style: AppStyles.headingSmall.copyWith(fontSize: 16),
                ),
                IconButton(
                  icon: const Icon(Icons.list_alt),
                  onPressed: () {
                    setState(() => _showList = true);
                  },
                ),
              ],
            ),
          ),
          // Services horizontaux
          SizedBox(
            height: 200,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(
                horizontal: AppStyles.spacing12,
              ),
              itemCount: mapServices.length,
              itemBuilder: (context, index) {
                return _buildServiceCard(mapServices[index]);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildServiceCard(MapService service) {
    return Container(
      width: 260,
      margin: const EdgeInsets.only(right: AppStyles.spacing12),
      decoration: BoxDecoration(
        color: AppColors.lightGrey,
        borderRadius: BorderRadius.circular(AppStyles.radiusMedium),
        border: Border.all(color: AppColors.border),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppStyles.spacing12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Titre
            Text(
              service.title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: AppStyles.bodyLarge.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: AppStyles.spacing4),
            // Distance
            Row(
              children: [
                const Icon(
                  Icons.location_on_outlined,
                  size: 14,
                  color: AppColors.grey,
                ),
                const SizedBox(width: 4),
                Text(
                  service.distance,
                  style: AppStyles.caption,
                ),
              ],
            ),
            const SizedBox(height: AppStyles.spacing8),
            // Rating
            Row(
              children: [
                const Icon(
                  Icons.star,
                  size: 14,
                  color: Colors.amber,
                ),
                const SizedBox(width: 4),
                Text(
                  '${service.rating}',
                  style: AppStyles.caption,
                ),
              ],
            ),
            const Spacer(),
            // Bouton
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  backgroundColor: AppColors.primaryGreen,
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('${service.title} sélectionné'),
                      duration: const Duration(seconds: 1),
                    ),
                  );
                },
                child: Text(
                  'Voir détails',
                  style: AppStyles.caption.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // =========================================
  // 🔷 VUE LISTE
  // =========================================
  Widget _buildListView() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
          ),
        ],
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(AppStyles.spacing16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Services (${mapServices.length})',
                  style: AppStyles.headingSmall.copyWith(fontSize: 16),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () {
                    setState(() => _showList = false);
                  },
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: mapServices.length,
              itemBuilder: (context, index) {
                final service = mapServices[index];
                return ListTile(
                  leading: CircleAvatar(
                    backgroundColor:
                    AppColors.primaryGreen.withOpacity(0.1),
                    child: Icon(
                      Icons.agriculture,
                      color: AppColors.primaryGreen,
                    ),
                  ),
                  title: Text(
                    service.title,
                    style: AppStyles.bodyMedium.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  subtitle: Row(
                    children: [
                      const Icon(Icons.location_on_outlined,
                          size: 12, color: AppColors.grey),
                      const SizedBox(width: 4),
                      Text(
                        service.distance,
                        style: AppStyles.caption,
                      ),
                    ],
                  ),
                  trailing: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.star,
                          size: 14, color: Colors.amber),
                      Text(
                        '${service.rating}',
                        style: AppStyles.caption,
                      ),
                    ],
                  ),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(service.title),
                        duration: const Duration(seconds: 1),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

// =========================================
// 🔷 MODÈLE SERVICE CARTE
// =========================================
class MapService {
  final String id;
  final String title;
  final double latitude;
  final double longitude;
  final String category;
  final String distance;
  final double rating;

  MapService({
    required this.id,
    required this.title,
    required this.latitude,
    required this.longitude,
    required this.category,
    required this.distance,
    required this.rating,
  });
}