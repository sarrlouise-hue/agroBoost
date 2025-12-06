import 'package:flutter/material.dart';
import 'package:agro_boost/core/constants/app_colors.dart';
import 'package:agro_boost/core/constants/app_styles.dart';
import 'package:agro_boost/screens/map_screen.dart';
import 'package:agro_boost/screens/my_services_screen.dart';
import 'package:agro_boost/screens/profile_screen.dart';
import 'package:agro_boost/screens/service_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  int _currentIndex = 0;
  late PageController _pageController;
  late PageController _carouselController;
  late AnimationController _fadeController;
  int _currentCarouselIndex = 0;

  final List<ServiceItem> services = [
    ServiceItem(
      id: '1',
      title: 'Tracteur',
      category: 'Tracteur',
      location: 'Kaolack',
      rating: 4.8,
      reviews: 24,
      price: '15000',
      image: 'assets/images/tractor1.jpg',
      isAvailable: true,
      distance: '2.3',
      icon: '🚜',
    ),
    ServiceItem(
      id: '2',
      title: 'Semoir',
      category: 'Semoir',
      location: 'Tambacounda',
      rating: 4.5,
      reviews: 18,
      price: '8000',
      image: 'assets/images/seeder.jpg',
      isAvailable: true,
      distance: '5.1',
      icon: '🌾',
    ),
    ServiceItem(
      id: '3',
      title: 'Opérateur',
      category: 'Opérateur',
      location: 'Thiès',
      rating: 4.9,
      reviews: 35,
      price: '5000',
      image: 'assets/images/operator.jpg',
      isAvailable: false,
      distance: '8.7',
      icon: '👨‍🌾',
    ),
    ServiceItem(
      id: '4',
      title: 'Pulvérisateur',
      category: 'Équipement',
      location: 'Dakar',
      rating: 4.6,
      reviews: 12,
      price: '3500',
      image: 'assets/images/sprayer.jpg',
      isAvailable: true,
      distance: '1.5',
      icon: '💨',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _carouselController = PageController();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    )..forward();

    Future.delayed(const Duration(seconds: 2), _autoScrollCarousel);
  }

  void _autoScrollCarousel() {
    if (mounted) {
      _carouselController.nextPage(
        duration: const Duration(milliseconds: 800),
        curve: Curves.easeInOut,
      );
      Future.delayed(const Duration(seconds: 4), _autoScrollCarousel);
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    _carouselController.dispose();
    _fadeController.dispose();
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
          HomeScreenContent(
            services: services,
            carouselController: _carouselController,
            pageController: _pageController,   // AJOUTÉ
          ),
          const MapScreen(),
          const MyServicesScreen(),
          const ProfileScreen(),
        ],
      ),
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  Widget _buildBottomNavigationBar() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.15),
            blurRadius: 12,
            offset: const Offset(0, -4),
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
        iconSize: 28,
        selectedFontSize: 12,
        unselectedFontSize: 11,
        items: [
          BottomNavigationBarItem(
            icon: _buildNavIcon(Icons.home_outlined, 0),
            activeIcon: _buildNavIcon(Icons.home, 0),
            label: 'Accueil',
          ),
          BottomNavigationBarItem(
            icon: _buildNavIcon(Icons.map_outlined, 1),
            activeIcon: _buildNavIcon(Icons.map, 1),
            label: 'Carte',
          ),
          BottomNavigationBarItem(
            icon: _buildNavIcon(Icons.bookmark_border_outlined, 2),
            activeIcon: _buildNavIcon(Icons.bookmark, 2),
            label: 'Services',
          ),
          BottomNavigationBarItem(
            icon: _buildNavIcon(Icons.person_outline, 3),
            activeIcon: _buildNavIcon(Icons.person, 3),
            label: 'Profil',
          ),
        ],
        onTap: (index) {
          _pageController.animateToPage(
            index,
            duration: const Duration(milliseconds: 400),
            curve: Curves.easeInOutCubic,
          );
        },
      ),
    );
  }

  Widget _buildNavIcon(IconData icon, int index) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: _currentIndex == index
            ? AppColors.primaryGreen.withOpacity(0.1)
            : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Icon(icon),
    );
  }
}

class HomeScreenContent extends StatefulWidget {
  final List<ServiceItem> services;
  final PageController carouselController;
  final PageController pageController;

  const HomeScreenContent({
    Key? key,
    required this.services,
    required this.carouselController,
    required this.pageController,
  }) : super(key: key);

  @override
  State<HomeScreenContent> createState() => _HomeScreenContentState();
}

class _HomeScreenContentState extends State<HomeScreenContent>
    with TickerProviderStateMixin {
  String _selectedFilter = 'all';
  late AnimationController _slideController;
  late List<ServiceItem> _filteredServices;
  int _currentCarouselIndex = 0;

  @override
  void initState() {
    super.initState();
    _filteredServices = widget.services;
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    )..forward();

    widget.carouselController.addListener(() {
      setState(() {
        _currentCarouselIndex = (widget.carouselController.page?.round() ?? 0) % widget.services.length;
      });
    });
  }

  @override
  void dispose() {
    _slideController.dispose();
    super.dispose();
  }

  void _filterServices() {
    setState(() {
      if (_selectedFilter == 'all') {
        _filteredServices = widget.services;
      } else {
        _filteredServices = widget.services
            .where((s) => s.category.toLowerCase().contains(_selectedFilter))
            .toList();
      }
      _slideController.reset();
      _slideController.forward();
    });
  }

  void _showMenu() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.grey,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),

              Text(
                'Menu',
                style: AppStyles.headingSmall.copyWith(fontSize: 20),
              ),
              const SizedBox(height: 20),

              _buildMenuOption(
                Icons.home_outlined,
                'Accueil',
                    () {
                  Navigator.pop(context);
                  widget.pageController.jumpToPage(0);
                },
              ),

              _buildMenuOption(
                Icons.map_outlined,
                'Carte',
                    () {
                  Navigator.pop(context);
                  widget.pageController.jumpToPage(1);
                },
              ),

              _buildMenuOption(
                Icons.miscellaneous_services_outlined,
                'Mes services',
                    () {
                  Navigator.pop(context);
                  widget.pageController.jumpToPage(2);
                },
              ),

              _buildMenuOption(
                Icons.person_outline,
                'Profil',
                    () {
                  Navigator.pop(context);
                  widget.pageController.jumpToPage(3);
                },
              ),

              _buildMenuOption(
                Icons.settings_outlined,
                'Paramètres',
                    () {
                  Navigator.pop(context);
                  // Si tu veux je crée la page SettingsScreen
                },
              ),

              _buildMenuOption(
                Icons.close,
                'Fermer',
                    () {
                  Navigator.pop(context);
                },
              ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMenuOption(IconData icon, String title, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        margin: const EdgeInsets.only(bottom: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          children: [
            Icon(icon, size: 22, color: AppColors.primaryGreen),
            const SizedBox(width: 12),
            Text(
              title,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }


  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [
          _buildHeader(),
          _buildSearchBar(),
          _buildCarousel(),
          _buildCarouselIndicator(),
          _buildCategoryFilter(),
          _buildGridServices(),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryGreen.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: 20,
            vertical: 24,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.3),
                            width: 2,
                          ),
                        ),
                        child: const Text(
                          '🚜',
                          style: TextStyle(fontSize: 28),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'AGRO BOOST',
                            style: AppStyles.headingSmall.copyWith(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            'Services agricoles',
                            style: AppStyles.caption.copyWith(
                              color: Colors.white70,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  GestureDetector(
                    onTap: _showMenu,
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(
                        Icons.menu,
                        color: Colors.white,
                        size: 26,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Text(
                'Bonjour 👋',
                style: AppStyles.headingSmall.copyWith(
                  color: Colors.white,
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Choisissez un service\npour votre champ',
                style: AppStyles.bodyMedium.copyWith(
                  color: Colors.white70,
                  fontSize: 15,
                  height: 1.4,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: TextField(
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
          decoration: InputDecoration(
            hintText: 'Chercher...',
            hintStyle: AppStyles.caption.copyWith(fontSize: 14),
            prefixIcon: const Icon(
              Icons.search,
              color: AppColors.primaryGreen,
              size: 26,
            ),
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 14,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCarousel() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: SizedBox(
        height: 200,
        child: PageView.builder(
          controller: widget.carouselController,
          onPageChanged: (index) {
            setState(() {
              _currentCarouselIndex = index % widget.services.length;
            });
          },
          itemBuilder: (context, index) {
            final service = widget.services[index % widget.services.length];
            return _buildCarouselCard(service);
          },
        ),
      ),
    );
  }

  Widget _buildCarouselCard(ServiceItem service) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ServiceDetailScreen(service: service),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.12),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Stack(
          children: [
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.primaryGreen.withOpacity(0.1),
                    AppColors.secondaryGreen.withOpacity(0.05),
                  ],
                ),
                borderRadius: BorderRadius.circular(18),
              ),
              child: Center(
                child: Text(
                  service.icon,
                  style: const TextStyle(fontSize: 80),
                ),
              ),
            ),
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withOpacity(0.3),
                    ],
                  ),
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(18),
                    bottomRight: Radius.circular(18),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      service.title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(
                              Icons.star,
                              color: Colors.amber,
                              size: 14,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '${service.rating}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 3,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.primaryGreen,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            '${service.price}F',
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 10,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            Positioned(
              top: 8,
              left: 8,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 8,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: service.isAvailable
                      ? AppColors.success
                      : AppColors.error,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  service.isAvailable ? '✓' : '✗',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCarouselIndicator() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: List.generate(
          widget.services.length,
              (index) => Container(
            width: _currentCarouselIndex == index ? 24 : 6,
            height: 6,
            margin: const EdgeInsets.symmetric(horizontal: 3),
            decoration: BoxDecoration(
              color: _currentCarouselIndex == index
                  ? AppColors.primaryGreen
                  : AppColors.border,
              borderRadius: BorderRadius.circular(3),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryFilter() {
    final categories = [
      {'label': '📱 Tous', 'value': 'all'},
      {'label': '🚜 Tracteurs', 'value': 'tracteur'},
      {'label': '👨 Opérateurs', 'value': 'operateur'},
      {'label': '⚙️ Équip', 'value': 'equipement'},
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: categories.map((cat) {
            bool isSelected = _selectedFilter == cat['value'];
            return GestureDetector(
              onTap: () {
                setState(() => _selectedFilter = cat['value']!);
                _filterServices();
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                margin: const EdgeInsets.only(right: 10),
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: isSelected
                      ? AppColors.primaryGreen
                      : Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: AppColors.primaryGreen,
                    width: isSelected ? 0 : 2,
                  ),
                  boxShadow: isSelected
                      ? [
                    BoxShadow(
                      color: AppColors.primaryGreen.withOpacity(0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ]
                      : [],
                ),
                child: Text(
                  cat['label']!,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: isSelected ? Colors.white : AppColors.primaryGreen,
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildGridServices() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 12),
            child: Text(
              'Plus de services',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 0.8,
            ),
            itemCount: _filteredServices.length,
            itemBuilder: (context, index) {
              return _buildGridServiceCard(_filteredServices[index]);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildGridServiceCard(ServiceItem service) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ServiceDetailScreen(service: service),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            Expanded(
              flex: 3,
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppColors.primaryGreen.withOpacity(0.1),
                      AppColors.secondaryGreen.withOpacity(0.05),
                    ],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(14),
                    topRight: Radius.circular(14),
                  ),
                ),
                child: Center(
                  child: Text(
                    service.icon,
                    style: const TextStyle(fontSize: 45),
                  ),
                ),
              ),
            ),
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          service.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Row(
                          children: [
                            const Icon(
                              Icons.star,
                              size: 10,
                              color: Colors.amber,
                            ),
                            const SizedBox(width: 2),
                            Text(
                              '${service.rating}',
                              style: const TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    SizedBox(
                      width: double.infinity,
                      height: 28,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primaryGreen,
                          padding: EdgeInsets.zero,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  ServiceDetailScreen(service: service),
                            ),
                          );
                        },
                        child: const Text(
                          'Réserver',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

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
  final String icon;

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
    required this.icon,
  });
}