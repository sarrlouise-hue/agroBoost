import 'package:flutter/material.dart';
import 'package:agro_boost/core/constants/app_colors.dart';
import 'package:agro_boost/core/constants/app_styles.dart';
import 'package:agro_boost/screens/map_screen.dart';
import 'package:agro_boost/screens/my_services_screen.dart';
import 'package:agro_boost/screens/profile_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  late PageController _pageController;

  // Données exemple des services
  final List<ServiceItem> services = [
    ServiceItem(
      id: '1',
      title: 'Tracteur MASSEY FERGUSON',
      category: 'Tracteur',
      location: 'Kaolack, Sénégal',
      rating: 4.8,
      reviews: 24,
      price: '15 000',
      image: 'assets/images/tractor1.jpg',
      isAvailable: true,
      distance: '2.3 km',
    ),
    ServiceItem(
      id: '2',
      title: 'Semoir mécanique JOHN DEERE',
      category: 'Semoir',
      location: 'Tambacounda',
      rating: 4.5,
      reviews: 18,
      price: '8 000',
      image: 'assets/images/seeder.jpg',
      isAvailable: true,
      distance: '5.1 km',
    ),
    ServiceItem(
      id: '3',
      title: 'Opérateur agricole expérimenté',
      category: 'Opérateur',
      location: 'Thiès',
      rating: 4.9,
      reviews: 35,
      price: '5 000',
      image: 'assets/images/operator.jpg',
      isAvailable: false,
      distance: '8.7 km',
    ),
    ServiceItem(
      id: '4',
      title: 'Pulvérisateur agricole STIHL',
      category: 'Équipement',
      location: 'Dakar',
      rating: 4.6,
      reviews: 12,
      price: '3 500',
      image: 'assets/images/sprayer.jpg',
      isAvailable: true,
      distance: '1.5 km',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.greyBackground,
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(),
        onPageChanged: (index) {
          setState(() => _currentIndex = index);
        },
        children: [
          HomeScreenContent(services: services),
          const MapScreen(),
          const MyServicesScreen(),
          const ProfileScreen(),
        ],
      ),
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  // =========================================
  // 🔷 BARRE DE NAVIGATION INFÉRIEURE
  // =========================================
  Widget _buildBottomNavigationBar() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: BottomNavigationBar(
        currentIndex: _currentIndex,
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        selectedItemColor: AppColors.primaryGreen,
        unselectedItemColor: AppColors.grey,
        elevation: 0,
        items: [
          BottomNavigationBarItem(
            icon: Icon(
              _currentIndex == 0 ? Icons.home : Icons.home_outlined,
            ),
            label: 'Accueil',
          ),
          BottomNavigationBarItem(
            icon: Icon(
              _currentIndex == 1 ? Icons.map : Icons.map_outlined,
            ),
            label: 'Carte',
          ),
          BottomNavigationBarItem(
            icon: Icon(
              _currentIndex == 2
                  ? Icons.bookmark
                  : Icons.bookmark_border_outlined,
            ),
            label: 'Mes services',
          ),
          BottomNavigationBarItem(
            icon: Icon(
              _currentIndex == 3 ? Icons.person : Icons.person_outlined,
            ),
            label: 'Profil',
          ),
        ],
        onTap: (index) {
          _pageController.animateToPage(
            index,
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeInOut,
          );
        },
      ),
    );
  }
}

// =========================================
// 🔷 CONTENU DE L'ACCUEIL
// =========================================
class HomeScreenContent extends StatefulWidget {
  final List<ServiceItem> services;

  const HomeScreenContent({
    Key? key,
    required this.services,
  }) : super(key: key);

  @override
  State<HomeScreenContent> createState() => _HomeScreenContentState();
}

class _HomeScreenContentState extends State<HomeScreenContent> {
  String _selectedFilter = 'all';

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [
          // =========================================
          // 1️⃣ EN-TÊTE AVEC PROFIL
          // =========================================
          _buildHeader(),

          // =========================================
          // 2️⃣ BARRE DE RECHERCHE
          // =========================================
          _buildSearchBar(),

          // =========================================
          // 3️⃣ SECTION RECOMMANDÉES
          // =========================================
          _buildRecommendedSection(),

          // =========================================
          // 4️⃣ FILTRES
          // =========================================
          _buildFilterChips(),

          // =========================================
          // 5️⃣ LISTE DES SERVICES
          // =========================================
          _buildServicesList(),

          // Espace en bas
          const SizedBox(height: AppStyles.spacing40),
        ],
      ),
    );
  }

  // =========================================
  // 🔷 EN-TÊTE
  // =========================================
  Widget _buildHeader() {
    return Container(
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(20),
          bottomRight: Radius.circular(20),
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppStyles.spacing20,
            vertical: AppStyles.spacing20,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Ligne: Logo + Menu
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Logo et titre
                  Row(
                    children: [
                      Container(
                        width: 45,
                        height: 45,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          Icons.agriculture,
                          color: Colors.white,
                          size: 28,
                        ),
                      ),
                      const SizedBox(width: AppStyles.spacing12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'AGRO BOOST',
                            style: AppStyles.headingSmall.copyWith(
                              color: Colors.white,
                              fontSize: 18,
                            ),
                          ),
                          Text(
                            'Services agricoles',
                            style: AppStyles.caption.copyWith(
                              color: Colors.white70,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  // Menu
                  IconButton(
                    icon: const Icon(
                      Icons.menu,
                      color: Colors.white,
                      size: 28,
                    ),
                    onPressed: () {},
                  ),
                ],
              ),
              const SizedBox(height: AppStyles.spacing20),
              // Salutation
              Text(
                'Bonjour 👋',
                style: AppStyles.headingSmall.copyWith(
                  color: Colors.white,
                  fontSize: 22,
                ),
              ),
              const SizedBox(height: AppStyles.spacing4),
              Text(
                'Trouvez les meilleurs services agricoles près de vous',
                style: AppStyles.bodyMedium.copyWith(
                  color: Colors.white70,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // =========================================
  // 🔷 BARRE DE RECHERCHE
  // =========================================
  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppStyles.spacing20,
        vertical: AppStyles.spacing16,
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(AppStyles.radiusMedium),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.08),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: TextField(
                decoration: InputDecoration(
                  hintText: 'Chercher un service...',
                  hintStyle: AppStyles.caption,
                  prefixIcon: const Icon(
                    Icons.search,
                    color: AppColors.grey,
                    size: 22,
                  ),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: AppStyles.spacing16,
                    vertical: AppStyles.spacing12,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(width: AppStyles.spacing12),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppStyles.radiusMedium),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: IconButton(
              icon: const Icon(
                Icons.tune,
                color: AppColors.primaryGreen,
                size: 22,
              ),
              onPressed: () {},
            ),
          ),
        ],
      ),
    );
  }

  // =========================================
  // 🔷 SECTION RECOMMANDÉES
  // =========================================
  Widget _buildRecommendedSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppStyles.spacing20,
        vertical: AppStyles.spacing12,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '⭐ Recommandés pour vous',
                style: AppStyles.headingSmall.copyWith(
                  fontSize: 18,
                ),
              ),
              TextButton(
                onPressed: () {},
                child: Text(
                  'Voir plus',
                  style: AppStyles.caption.copyWith(
                    color: AppColors.primaryGreen,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppStyles.spacing12),
          SizedBox(
            height: 140,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: 3,
              itemBuilder: (context, index) {
                return Container(
                  width: 160,
                  margin: EdgeInsets.only(
                    right: index < 2 ? AppStyles.spacing12 : 0,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius:
                    BorderRadius.circular(AppStyles.radiusMedium),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.08),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Stack(
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          color: AppColors.secondaryGreen.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(
                            AppStyles.radiusMedium,
                          ),
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.image,
                            color: AppColors.secondaryGreen,
                            size: 50,
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(AppStyles.spacing12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: AppStyles.spacing8,
                                vertical: AppStyles.spacing4,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.primaryGreen
                                    .withOpacity(0.2),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                'Populaire',
                                style: AppStyles.labelSmall.copyWith(
                                  color: AppColors.primaryGreen,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Tracteur',
                                  style: AppStyles.bodyMedium.copyWith(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                                Row(
                                  children: [
                                    const Icon(
                                      Icons.star,
                                      color: Colors.amber,
                                      size: 14,
                                    ),
                                    const SizedBox(
                                      width: AppStyles.spacing4,
                                    ),
                                    Text(
                                      '4.8 (24)',
                                      style: AppStyles.caption.copyWith(
                                        fontSize: 10,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  // =========================================
  // 🔷 FILTRES
  // =========================================
  Widget _buildFilterChips() {
    final filters = [
      {'label': 'Tous', 'value': 'all', 'icon': Icons.apps},
      {'label': 'Tracteurs', 'value': 'tractor', 'icon': Icons.agriculture},
      {'label': 'Opérateurs', 'value': 'operator', 'icon': Icons.people},
      {'label': 'Équipement', 'value': 'equipment', 'icon': Icons.build},
    ];

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: AppStyles.spacing20,
          vertical: AppStyles.spacing12,
        ),
        child: Row(
          children: filters.map((filter) {
            bool isSelected = _selectedFilter == filter['value'];
            return Padding(
              padding: const EdgeInsets.only(right: AppStyles.spacing12),
              child: FilterChip(
                label: Row(
                  children: [
                    Icon(
                      filter['icon'] as IconData,
                      size: 16,
                      color: isSelected ? Colors.white : AppColors.primaryGreen,
                    ),
                    const SizedBox(width: AppStyles.spacing8),
                    Text(
                      filter['label'] as String,
                      style: AppStyles.labelSmall.copyWith(
                        color:
                        isSelected ? Colors.white : AppColors.primaryGreen,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                onSelected: (selected) {
                  setState(() {
                    _selectedFilter = filter['value'] as String;
                  });
                },
                backgroundColor: Colors.white,
                selectedColor: AppColors.primaryGreen,
                side: BorderSide(
                  color: isSelected
                      ? AppColors.primaryGreen
                      : AppColors.border,
                  width: 1.5,
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  // =========================================
  // 🔷 LISTE DES SERVICES
  // =========================================
  Widget _buildServicesList() {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppStyles.spacing20,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Services disponibles (${widget.services.length})',
            style: AppStyles.headingSmall.copyWith(
              fontSize: 18,
            ),
          ),
          const SizedBox(height: AppStyles.spacing16),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: widget.services.length,
            itemBuilder: (context, index) {
              return _buildServiceCard(widget.services[index]);
            },
          ),
        ],
      ),
    );
  }

  // =========================================
  // 🔷 CARTE SERVICE
  // =========================================
  Widget _buildServiceCard(ServiceItem service) {
    return GestureDetector(
      onTap: () {},
      child: Container(
        margin: const EdgeInsets.only(bottom: AppStyles.spacing16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppStyles.radiusMedium),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            // Image et badge
            Stack(
              children: [
                Container(
                  height: 160,
                  decoration: BoxDecoration(
                    color: AppColors.secondaryGreen.withOpacity(0.1),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(AppStyles.radiusMedium),
                      topRight: Radius.circular(AppStyles.radiusMedium),
                    ),
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.image_not_supported,
                      color: AppColors.grey,
                      size: 60,
                    ),
                  ),
                ),
                // Badge disponibilité
                Positioned(
                  top: AppStyles.spacing12,
                  left: AppStyles.spacing12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppStyles.spacing12,
                      vertical: AppStyles.spacing6,
                    ),
                    decoration: BoxDecoration(
                      color: service.isAvailable
                          ? AppColors.success.withOpacity(0.9)
                          : AppColors.error.withOpacity(0.9),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      service.isAvailable ? '✓ Disponible' : '✗ Indisponible',
                      style: AppStyles.labelSmall.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ),
                // Distance
                Positioned(
                  top: AppStyles.spacing12,
                  right: AppStyles.spacing12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppStyles.spacing8,
                      vertical: AppStyles.spacing4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.9),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.location_on,
                          color: AppColors.primaryGreen,
                          size: 14,
                        ),
                        const SizedBox(width: AppStyles.spacing4),
                        Text(
                          service.distance,
                          style: AppStyles.labelSmall.copyWith(
                            color: AppColors.primaryGreen,
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            // Contenu
            Padding(
              padding: const EdgeInsets.all(AppStyles.spacing16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Titre
                  Text(
                    service.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: AppStyles.bodyLarge.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: AppStyles.spacing8),
                  // Location
                  Row(
                    children: [
                      const Icon(
                        Icons.location_on_outlined,
                        color: AppColors.grey,
                        size: 16,
                      ),
                      const SizedBox(width: AppStyles.spacing6),
                      Expanded(
                        child: Text(
                          service.location,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppStyles.caption,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppStyles.spacing12),
                  // Rating et Prix
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(
                            Icons.star,
                            color: Colors.amber,
                            size: 16,
                          ),
                          const SizedBox(width: AppStyles.spacing4),
                          Text(
                            '${service.rating} (${service.reviews})',
                            style: AppStyles.caption,
                          ),
                        ],
                      ),
                      Text(
                        '${service.price} FCFA/j',
                        style: AppStyles.bodyMedium.copyWith(
                          color: AppColors.primaryGreen,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppStyles.spacing12),
                  // Bouton
                  SizedBox(
                    width: double.infinity,
                    height: 40,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryGreen,
                        shape: RoundedRectangleBorder(
                          borderRadius:
                          BorderRadius.circular(AppStyles.radiusMedium),
                        ),
                      ),
                      onPressed: () {},
                      child: Text(
                        'Réserver maintenant',
                        style: AppStyles.button.copyWith(
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// =========================================
// 🔷 MODÈLE SERVICE
// =========================================
class ServiceItem {
  final String id;
  final String title;
  final String category;
  final String location;
  final double rating;
  final int reviews;
  final String price;
  final String image;
  final bool isAvailable;
  final String distance;

  ServiceItem({
    required this.id,
    required this.title,
    required this.category,
    required this.location,
    required this.rating,
    required this.reviews,
    required this.price,
    required this.image,
    required this.isAvailable,
    required this.distance,
  });
}