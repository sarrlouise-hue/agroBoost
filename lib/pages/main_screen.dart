import 'package:flutter/material.dart';
import 'package:hallo/pages/home_screen.dart';
import 'package:hallo/pages/reservations_screen.dart';
import 'package:hallo/pages/profile_screen.dart';
import 'package:hallo/pages/admin_dashboard_screen.dart';
import 'package:hallo/pages/users_management_screen.dart';
import 'package:hallo/pages/tractors_management_screen.dart';
import 'package:hallo/pages/stats_screen.dart';
import 'package:hallo/pages/dashboard_screen.dart';
import 'package:hallo/pages/maintenance_dashboard_screen.dart';
import 'package:hallo/pages/received_reservations_screen.dart';
import 'package:hallo/globals/app_state.dart';

class MainScreen extends StatefulWidget {
    const MainScreen({required this.language, required this.userType, super.key});

  final String language;

  final String userType;

  @override
  State<MainScreen> createState() {
    return _MainScreenState();
  }
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final bool isWolof = widget.language == 'wo';
    return Scaffold(
      body: _getBody(),
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
            setState(() {
              _currentIndex = index;
            });
          },
          type: BottomNavigationBarType.fixed,
          selectedItemColor: Theme.of(context).colorScheme.primary,
          unselectedItemColor: Theme.of(context).colorScheme.onSurfaceVariant,
          selectedFontSize: 12.0,
          unselectedFontSize: 11.0,
          elevation: 0.0,
          items: _getNavigationItems(isWolof),
        ),
      ),
    );
  }

  Widget _getBody() {
    if (widget.userType == 'producteur') {
      return _getProducteurScreen();
    } else {
      if (widget.userType == 'prestataire') {
        return _getPrestataireScreen();
      } else {
        return _getAdminScreen();
      }
    }
  }

  Widget _getProducteurScreen() {
    switch (_currentIndex) {
      case 0:
        return HomeScreen(language: widget.language);
      case 1:
        return ReservationsScreen(
          language: widget.language,
          userType: widget.userType,
        );
      case 2:
        return ProfileScreen(
          language: widget.language,
          userType: widget.userType,
        );
      default:
        return HomeScreen(language: widget.language);
    }
  }

  Widget _getAdminScreen() {
    switch (_currentIndex) {
      case 0:
        return AdminDashboardScreen(language: widget.language);
      case 1:
        return UsersManagementScreen(language: widget.language);
      case 2:
        return TractorsManagementScreen(language: widget.language);
      case 3:
        return StatsScreen(language: widget.language);
      default:
        return AdminDashboardScreen(language: widget.language);
    }
  }

  List<BottomNavigationBarItem> _getNavigationItems(bool isWolof) {
    if (widget.userType == 'producteur') {
      return [
        BottomNavigationBarItem(
          icon: const Icon(Icons.map),
          label: isWolof ? 'Karte' : 'Carte',
        ),
        BottomNavigationBarItem(
          icon: const Icon(Icons.book_online),
          label: isWolof ? 'Réserwasioŋ' : 'Réservations',
        ),
        BottomNavigationBarItem(
          icon: const Icon(Icons.person),
          label: isWolof ? 'Profil' : 'Profil',
        ),
      ];
    } else {
      if (widget.userType == 'prestataire') {
        return [
          BottomNavigationBarItem(
            icon: const Icon(Icons.dashboard),
            label: isWolof ? 'Akëy' : 'Accueil',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.agriculture),
            label: isWolof ? 'Sama Traktëër' : 'Mes Tracteurs',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.assignment),
            label: isWolof ? 'Dëmande' : 'Demandes',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.person),
            label: isWolof ? 'Profil' : 'Profil',
          ),
        ];
      } else {
        return [
          BottomNavigationBarItem(
            icon: const Icon(Icons.dashboard),
            label: isWolof ? 'Dashboard' : 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.people),
            label: isWolof ? 'Jëfandikukat' : 'Utilisateurs',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.agriculture),
            label: isWolof ? 'Traktëër' : 'Tracteurs',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.bar_chart),
            label: isWolof ? 'Statistik' : 'Stats',
          ),
        ];
      }
    }
  }

  Widget _getPrestataireScreen() {
    switch (_currentIndex) {
      case 0:
        return DashboardScreen(language: widget.language);
      case 1:
        return MaintenanceDashboardScreen(language: widget.language);
      case 2:
        return ReceivedReservationsScreen(language: widget.language);
      case 3:
        return ProfileScreen(
          language: widget.language,
          userType: widget.userType,
        );
      default:
        return DashboardScreen(language: widget.language);
    }
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        final appState = AppState.of(context, listen: false);
        appState.setCurrentUserType(widget.userType);
      }
    });
  }
}
