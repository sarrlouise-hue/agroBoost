import 'package:flutter/material.dart';
import 'package:agro_boost/core/constants/app_colors.dart';
import 'package:agro_boost/core/constants/app_styles.dart';
import 'package:agro_boost/screens/service_detail_screen.dart';
import 'package:agro_boost/screens/home_screen.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({Key? key}) : super(key: key);

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> with TickerProviderStateMixin {
  bool _showList = false;
  late AnimationController _slideController;

  final List<MapService> mapServices = [
    MapService(
      id: '1',
      title: 'Tracteur',
      latitude: 14.1456,
      longitude: -14.6928,
      category: 'Tracteur',
      distance: '2.3',
      rating: 4.8,
      price: '15000',
      icon: '🚜',
    ),
    MapService(
      id: '2',
      title: 'Semoir',
      latitude: 13.7720,
      longitude: -14.1948,
      category: 'Semoir',
      distance: '5.1',
      rating: 4.5,
      price: '8000',
      icon: '🌾',
    ),
    MapService(
      id: '3',
      title: 'Opérateur',
      latitude: 14.6756,
      longitude: -17.2398,
      category: 'Opérateur',
      distance: '8.7',
      rating: 4.9,
      price: '5000',
      icon: '👨‍🌾',
    ),
    MapService(
      id: '4',
      title: 'Pulvérisateur',
      latitude: 14.7167,
      longitude: -17.4674,
      category: 'Équipement',
      distance: '1.5',
      rating: 4.6,
      price: '3500',
      icon: '💨',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _slideController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue.shade100,
      body: Stack(
        children: [
          // Carte
          Container(
            color: Colors.blue.shade100,
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.map,
                    size: 80,
                    color: Colors.blue.shade300,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    '📍 Carte',
                    style: AppStyles.headingSmall.copyWith(
                      color: Colors.blue.shade700,
                      fontSize: 24,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${mapServices.length} services détectés',
                    style: AppStyles.bodyMedium.copyWith(
                      color: Colors.blue.shade600,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Services en bas
          if (!_showList)
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: SlideTransition(
                position: Tween<Offset>(
                  begin: const Offset(0, 1),
                  end: Offset.zero,
                ).animate(CurvedAnimation(
                  parent: _slideController,
                  curve: Curves.easeOut,
                )),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(24),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.15),
                        blurRadius: 15,
                        offset: const Offset(0, -5),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        child: Container(
                          width: 40,
                          height: 4,
                          decoration: BoxDecoration(
                            color: AppColors.grey,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '🎯 Services',
                              style: AppStyles.headingSmall.copyWith(
                                fontSize: 18,
                              ),
                            ),
                            GestureDetector(
                              onTap: () {
                                setState(() => _showList = true);
                                _slideController.forward();
                              },
                              child: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppColors.primaryGreen
                                      .withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(
                                  Icons.list,
                                  color: AppColors.primaryGreen,
                                  size: 20,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      SizedBox(
                        height: 160,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                          itemCount: mapServices.length,
                          itemBuilder: (context, index) {
                            return _buildServiceCard(mapServices[index]);
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

          // Liste vue
          if (_showList)
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: SlideTransition(
                position: Tween<Offset>(
                  begin: const Offset(0, 1),
                  end: Offset.zero,
                ).animate(CurvedAnimation(
                  parent: _slideController,
                  curve: Curves.easeOut,
                )),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(24),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.15),
                        blurRadius: 15,
                        offset: const Offset(0, -5),
                      ),
                    ],
                  ),
                  constraints: BoxConstraints(
                    maxHeight: MediaQuery.of(context).size.height * 0.7,
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min, // 🔥 Évite l’overflow
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(20),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '📋 Liste',
                              style: AppStyles.headingSmall.copyWith(fontSize: 18),
                            ),
                            GestureDetector(
                              onTap: () {
                                setState(() => _showList = false);
                                _slideController.reverse();
                              },
                              child: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppColors.error.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(
                                  Icons.close,
                                  color: AppColors.error,
                                  size: 20,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // 🔥 Le fix important
                      Flexible(
                        child: ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          itemCount: mapServices.length,
                          itemBuilder: (context, index) {
                            return _buildListItem(mapServices[index]);
                          },
                        ),
                      ),
                    ],
                  ),

                ),
              ),
            ),

          // Boutons flottants
          Positioned(
            top: 20,
            right: 16,
            child: SafeArea(
              child: Column(
                children: [
                  FloatingActionButton.small(
                    heroTag: 'zoom_in',
                    backgroundColor: Colors.white,
                    onPressed: () {},
                    child: const Icon(
                      Icons.add,
                      color: AppColors.primaryGreen,
                    ),
                  ),
                  const SizedBox(height: 8),
                  FloatingActionButton.small(
                    heroTag: 'zoom_out',
                    backgroundColor: Colors.white,
                    onPressed: () {},
                    child: const Icon(
                      Icons.remove,
                      color: AppColors.primaryGreen,
                    ),
                  ),
                  const SizedBox(height: 8),
                  FloatingActionButton.small(
                    heroTag: 'location',
                    backgroundColor: Colors.white,
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('📍 Localisation actuelle'),
                          duration: Duration(seconds: 1),
                        ),
                      );
                    },
                    child: const Icon(
                      Icons.my_location,
                      color: AppColors.primaryGreen,
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

  Widget _buildServiceCard(MapService service) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ServiceDetailScreen(
              service: ServiceItem(
                id: service.id,
                title: service.title,
                category: service.category,
                location: 'Localisation',
                rating: service.rating,
                reviews: 24,
                price: service.price,
                image: 'assets/images/tractor.jpg',
                isAvailable: true,
                distance: service.distance,
                icon: service.icon,
              ),
            ),
          ),
        );
      },
      child: Container(
        width: 140,
        margin: const EdgeInsets.only(right: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: AppColors.primaryGreen.withOpacity(0.2),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                service.icon,
                style: const TextStyle(fontSize: 32),
              ),
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
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(
                        Icons.location_on,
                        size: 12,
                        color: AppColors.grey,
                      ),
                      const SizedBox(width: 2),
                      Text(
                        '${service.distance}km',
                        style: const TextStyle(
                          fontSize: 10,
                          color: AppColors.grey,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(
                            Icons.star,
                            size: 12,
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
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.primaryGreen.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          '${service.price}F',
                          style: const TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primaryGreen,
                          ),
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
                        builder: (context) => ServiceDetailScreen(
                          service: ServiceItem(
                            id: service.id,
                            title: service.title,
                            category: service.category,
                            location: 'Localisation',
                            rating: service.rating,
                            reviews: 24,
                            price: service.price,
                            image: 'assets/images/tractor.jpg',
                            isAvailable: true,
                            distance: service.distance,
                            icon: service.icon,
                          ),
                        ),
                      ),
                    );
                  },
                  child: const Text(
                    'Voir',
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
    );
  }

  Widget _buildListItem(MapService service) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ServiceDetailScreen(
              service: ServiceItem(
                id: service.id,
                title: service.title,
                category: service.category,
                location: 'Localisation',
                rating: service.rating,
                reviews: 24,
                price: service.price,
                image: 'assets/images/tractor.jpg',
                isAvailable: true,
                distance: service.distance,
                icon: service.icon,
              ),
            ),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: AppColors.primaryGreen.withOpacity(0.2),
            width: 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: AppColors.primaryGreen.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Center(
                child: Text(
                  service.icon,
                  style: const TextStyle(fontSize: 28),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    service.title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(
                        Icons.location_on,
                        size: 12,
                        color: AppColors.grey,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${service.distance}km',
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.grey,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.star,
                      size: 12,
                      color: Colors.amber,
                    ),
                    const SizedBox(width: 2),
                    Text(
                      '${service.rating}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  '${service.price}F',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                    color: AppColors.primaryGreen,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class MapService {
  final String id;
  final String title;
  final double latitude;
  final double longitude;
  final String category;
  final String distance;
  final double rating;
  final String price;
  final String icon;

  MapService({
    required this.id,
    required this.title,
    required this.latitude,
    required this.longitude,
    required this.category,
    required this.distance,
    required this.rating,
    required this.price,
    required this.icon,
  });
}