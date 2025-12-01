// lib/screens/login_screen.dart
import 'package:agro_boost/models/service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../constants/app_colors.dart';
import '../constants/app_styles.dart';
import '../view_models/auth_view_model.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  late TextEditingController _emailController;
  late TextEditingController _passwordController;
  bool _obscurePassword = true;

  @override
  void initState() {
    super.initState();
    _emailController = TextEditingController();
    _passwordController = TextEditingController();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() async {
    final authVM = ref.read(authViewModelProvider.notifier);
    final success = await authVM.login(
      email: _emailController.text,
      password: _passwordController.text,
    );

    if (success && mounted) {
      Navigator.pushReplacementNamed(context, '/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authViewModelProvider);

    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(AppStyles.paddingLarge),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(height: MediaQuery.of(context).size.height * 0.1),
              Image.asset(
                'assets/logos/agro_boost_logo.png',
                width: 120,
                height: 120,
              ),
              const SizedBox(height: AppStyles.paddingLarge),
               Text(
                'Bienvenue sur AGRO BOOST',
                style: AppStyles.headingLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppStyles.paddingSmall),
               Text(
                'Connectez-vous pour accéder à nos services',
                style: AppStyles.bodyMedium,
                textAlign: TextAlign.center,
              ),
               SizedBox(height: AppStyles.paddingLarge),
              // Email TextField
              TextField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  labelText: 'Email',
                  prefixIcon: const Icon(Icons.email_outlined),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppStyles.radiusLarge),
                  ),
                ),
              ),
              const SizedBox(height: AppStyles.paddingMedium),
              // Password TextField
              TextField(
                controller: _passwordController,
                obscureText: _obscurePassword,
                decoration: InputDecoration(
                  labelText: 'Mot de passe',
                  prefixIcon: const Icon(Icons.lock_outlined),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword
                          ? Icons.visibility_off
                          : Icons.visibility,
                    ),
                    onPressed: () {
                      setState(
                              () => _obscurePassword = !_obscurePassword);
                    },
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppStyles.radiusLarge),
                  ),
                ),
              ),
              const SizedBox(height: AppStyles.paddingMedium),
              // Error Message
              if (authState.error != null)
                Container(
                  padding: const EdgeInsets.all(AppStyles.paddingMedium),
                  decoration: BoxDecoration(
                    color: AppColors.error.withOpacity(0.1),
                    borderRadius:
                    BorderRadius.circular(AppStyles.radiusLarge),
                  ),
                  child: Text(
                    authState.error!,
                    style: const TextStyle(color: AppColors.error),
                  ),
                ),
              const SizedBox(height: AppStyles.paddingLarge),
              // Login Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed:
                  authState.isLoading ? null : _handleLogin,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(
                      borderRadius:
                      BorderRadius.circular(AppStyles.radiusLarge),
                    ),
                  ),
                  child: authState.isLoading
                      ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        AppColors.white,
                      ),
                    ),
                  )
                      : const Text(
                    'Se connecter',
                    style: TextStyle(
                      fontSize: AppStyles.fontSize16,
                      color: AppColors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: AppStyles.paddingMedium),
              // Sign Up Link
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Pas encore de compte ? '),
                  GestureDetector(
                    onTap: () => Navigator.pushNamed(context, '/register'),
                    child: const Text(
                      'S\'inscrire',
                      style: TextStyle(
                        color: AppColors.primary,
                        fontWeight: FontWeight.bold,
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
}

// lib/screens/home_screen.dart
class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(serviceViewModelProvider.notifier).getAllServices();
    });
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authViewModelProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('AGRO BOOST'),
        backgroundColor: AppColors.primary,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.account_circle),
            onPressed: () => Navigator.pushNamed(context, '/profile'),
          ),
        ],
      ),
      body: SafeArea(
        child: _buildBody(),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        backgroundColor: AppColors.white,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.grey,
        onTap: (index) {
          setState(() => _selectedIndex = index);
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Accueil',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            label: 'Recherche',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_today),
            label: 'Réservations',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Paramètres',
          ),
        ],
      ),
    );
  }

  Widget _buildBody() {
    switch (_selectedIndex) {
      case 0:
        return const _HomeTab();
      case 1:
        return const _SearchTab();
      case 2:
        return const _BookingsTab();
      case 3:
        return const _SettingsTab();
      default:
        return const _HomeTab();
    }
  }
}

class _HomeTab extends ConsumerWidget {
  const _HomeTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final serviceState = ref.watch(serviceViewModelProvider);

    if (serviceState.isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppStyles.paddingMedium),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
           Text(
            'Services Disponibles',
            style: AppStyles.headingMedium,
          ),
          const SizedBox(height: AppStyles.paddingMedium),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: serviceState.services.length,
            itemBuilder: (context, index) {
              final service = serviceState.services[index];
              return ServiceCard(
                service: service,
                onTap: () {
                  ref
                      .read(serviceViewModelProvider.notifier)
                      .selectService(service);
                  Navigator.pushNamed(
                    context,
                    '/service_detail',
                    arguments: service,
                  );
                },
              );
            },
          ),
        ],
      ),
    );
  }
}

class _SearchTab extends StatelessWidget {
  const _SearchTab();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.search, size: 60, color: AppColors.primary),
          const SizedBox(height: AppStyles.paddingMedium),
          const Text('Recherche de services'),
        ],
      ),
    );
  }
}

class _BookingsTab extends ConsumerWidget {
  const _BookingsTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bookingState = ref.watch(bookingViewModelProvider);

    if (bookingState.isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (bookingState.bookings.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.calendar_today, size: 60, color: AppColors.grey),
            const SizedBox(height: AppStyles.paddingMedium),
            const Text('Aucune réservation'),
          ],
        ),
      );
    }

    return ListView.builder(
      itemCount: bookingState.bookings.length,
      itemBuilder: (context, index) {
        final booking = bookingState.bookings[index];
        return BookingCard(booking: booking);
      },
    );
  }
}

class _SettingsTab extends StatelessWidget {
  const _SettingsTab();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.settings, size: 60, color: AppColors.primary),
          const SizedBox(height: AppStyles.paddingMedium),
          const Text('Paramètres'),
        ],
      ),
    );
  }
}

// lib/screens/service_detail_screen.dart
class ServiceDetailScreen extends ConsumerWidget {
  final AgriculturalService service;

  const ServiceDetailScreen({Key? key, required this.service})
      : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Détails du Service'),
        backgroundColor: AppColors.primary,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            Container(
              width: double.infinity,
              height: 250,
              color: AppColors.lightGrey,
              child: service.image != null
                  ? Image.network(
                service.image!,
                fit: BoxFit.cover,
              )
                  : const Icon(Icons.image, size: 60),
            ),
            Padding(
              padding: const EdgeInsets.all(AppStyles.paddingMedium),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    service.name,
                    style: AppStyles.headingLarge,
                  ),
                  const SizedBox(height: AppStyles.paddingSmall),
                  Row(
                    children: [
                      const Icon(Icons.star, color: Colors.amber, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        '${service.rating} (${service.reviewCount} avis)',
                      ),
                    ],
                  ),
                  const SizedBox(height: AppStyles.paddingMedium),
                  Text(
                    service.description,
                    style: AppStyles.bodyMedium,
                  ),
                  const SizedBox(height: AppStyles.paddingMedium),
                  Text(
                    'Prix: ${service.pricePerHour} XOF/heure',
                    style: const TextStyle(
                      fontSize: AppStyles.fontSize16,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(height: AppStyles.paddingLarge),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () => Navigator.pushNamed(
                        context,
                        '/booking',
                        arguments: service,
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                      ),
                      child: const Text(
                        'Réserver',
                        style: TextStyle(
                          color: AppColors.white,
                          fontSize: AppStyles.fontSize16,
                          fontWeight: FontWeight.bold,
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