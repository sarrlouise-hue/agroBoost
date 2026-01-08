// ignore_for_file: unused_element, unused_field

import 'package:flutter/material.dart';
import 'package:hallo/api_exception.dart';
import 'package:hallo/auth_collection.dart';
import 'package:hallo/globals/auth_provider.dart';
import 'package:hallo/globals/app_state.dart';
import 'package:hallo/pages/main_screen.dart';
import 'package:flutter/services.dart';
import 'package:hallo/pages/welcome_screen.dart';
import 'package:hallo/pages/explore_screen.dart';

class LoginScreen extends StatefulWidget {
    const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() {
    return _LoginScreenState();
  }
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();

  final TextEditingController _otpController = TextEditingController();

  bool _isOtpSent = false;

  final TextEditingController _phoneController = TextEditingController();

  final TextEditingController _passwordController = TextEditingController();

  bool _isLoading = false;

  bool _obscurePassword = true;

  bool _isValidEmail(String email) {
    return RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}\$').hasMatch(email);
  }

  String _getUserTypeFromEmail(String email) {
    if (email.contains('prestataire') || email.contains('provider')) {
      return 'prestataire';
    } else {
      if (email.contains('admin')) {
        return 'admin';
      } else {
        return 'producteur';
      }
    }
  }

  Future<void> _sendOtp() async {
    if (!_isValidEmail(_emailController.text)) {
      _showSnackBar('Veuillez entrer un email valide');
      return;
    }
    setState(() {
      _isLoading = true;
    });
    try {
      final response = await AuthCollection.instance.resendOtp(
        email: _emailController.text,
      );
      if (response.success) {
        setState(() {
          _isLoading = false;
          _isOtpSent = true;
        });
        _showSnackBar('Code OTP envoyé par email !');
      } else {
        setState(() {
          _isLoading = false;
        });
        _showSnackBar(response.message);
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      _showSnackBar('Erreur: ${e.toString()}');
    }
  }

  Future<void> _verifyOtp() async {
    if (_otpController.text.length != 6) {
      _showSnackBar('Le code doit contenir 6 chiffres');
      return;
    }
    setState(() {
      _isLoading = true;
    });
    try {
      final authProvider = AuthProvider.of(context);
      final success = await authProvider.verifyOtp(
        email: _emailController.text,
        code: _otpController.text,
      );
      if (success && authProvider.currentUser != null) {
        setState(() {
          _isLoading = false;
        });
        final userRole = authProvider.currentUser?.role ?? 'user';
        String userType = 'producteur';
        if (userRole == 'provider' || userRole == 'mechanic') {
          userType = 'prestataire';
        } else {
          if (userRole == 'admin') {
            userType = 'admin';
          }
        }
        if (mounted) {
          final appState = AppState.of(context, listen: false);
          await appState.setCurrentUserType(userType);
        }
        if (mounted) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) =>
                  MainScreen(language: 'fr', userType: userType),
            ),
          );
        }
      } else {
        setState(() {
          _isLoading = false;
        });
        _showSnackBar('Code OTP invalide ou expiré');
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      _showSnackBar('Erreur: ${e.toString()}');
    }
  }

  @override
  void dispose() {
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  bool _isValidPhone(String phone) {
    return phone.length == 9 && RegExp('^\\d{9}\$').hasMatch(phone);
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12.0),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Theme.of(
                context,
              ).colorScheme.primaryContainer.withValues(alpha: 0.2),
              Theme.of(context).colorScheme.surface,
            ],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 40.0),
                  Center(
                    child: Container(
                      width: 100.0,
                      height: 100.0,
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
                      ),
                      child: const Icon(
                        Icons.agriculture,
                        size: 50.0,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(height: 32.0),
                  Text(
                    'Bienvenue !',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 8.0),
                  Text(
                    'Connectez-vous pour continuer',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                  ),
                  const SizedBox(height: 48.0),
                  Text(
                    'Numéro de téléphone',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                  ),
                  const SizedBox(height: 12.0),
                  TextField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(9),
                    ],
                    decoration: InputDecoration(
                      hintText: '77 123 45 67',
                      prefixIcon: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Text(
                              '🇸🇳',
                              style: TextStyle(fontSize: 20.0),
                            ),
                            const SizedBox(width: 8.0),
                            Text(
                              '+221',
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                            const SizedBox(width: 8.0),
                          ],
                        ),
                      ),
                      filled: true,
                      fillColor: Theme.of(context)
                          .colorScheme
                          .surfaceContainerHighest
                          .withValues(alpha: 0.3),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12.0),
                        borderSide: BorderSide.none,
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12.0),
                        borderSide: BorderSide(
                          color: Theme.of(
                            context,
                          ).colorScheme.outline.withValues(alpha: 0.2),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12.0),
                        borderSide: BorderSide(
                          color: Theme.of(context).colorScheme.primary,
                          width: 2.0,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24.0),
                  Text(
                    'Mot de passe (min. 6 caractères)',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                  ),
                  const SizedBox(height: 12.0),
                  TextField(
                    controller: _passwordController,
                    obscureText: _obscurePassword,
                    keyboardType: TextInputType.text,
                    decoration: InputDecoration(
                      hintText: '• • • • • •',
                      prefixIcon: const Icon(Icons.lock_outline),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword
                              ? Icons.visibility_outlined
                              : Icons.visibility_off_outlined,
                        ),
                        onPressed: () {
                          setState(() {
                            _obscurePassword = !_obscurePassword;
                          });
                        },
                      ),
                      filled: true,
                      fillColor: Theme.of(context)
                          .colorScheme
                          .surfaceContainerHighest
                          .withValues(alpha: 0.3),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12.0),
                        borderSide: BorderSide.none,
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12.0),
                        borderSide: BorderSide(
                          color: Theme.of(
                            context,
                          ).colorScheme.outline.withValues(alpha: 0.2),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12.0),
                        borderSide: BorderSide(
                          color: Theme.of(context).colorScheme.primary,
                          width: 2.0,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32.0),
                  SizedBox(
                    height: 56.0,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _login,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        foregroundColor: Colors.white,
                      ),
                      child: _isLoading
                          ? const SizedBox(
                              width: 24.0,
                              height: 24.0,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2.0,
                              ),
                            )
                          : const Text(
                              'Se connecter',
                              style: TextStyle(
                                fontSize: 16.0,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                    ),
                  ),
                  const SizedBox(height: 32.0),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Pas de compte ?',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      const SizedBox(width: 4.0),
                      TextButton(
                        onPressed: () {
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
                        child: Text(
                          'S\'inscrire',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20.0),
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 12.0),
                    child: Row(
                      children: [
                        Expanded(
                          child: Divider(
                            color: Theme.of(context).colorScheme.outlineVariant,
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          child: Text(
                            'ou',
                            style: TextStyle(
                              color: Theme.of(
                                context,
                              ).colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ),
                        Expanded(
                          child: Divider(
                            color: Theme.of(context).colorScheme.outlineVariant,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12.0),
                  OutlinedButton.icon(
                    onPressed: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const ExploreScreen(),
                        ),
                      );
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16.0),
                      side: BorderSide(
                        color: Theme.of(
                          context,
                        ).colorScheme.primary.withValues(alpha: 0.5),
                      ),
                    ),
                    icon: Icon(
                      Icons.explore,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    label: Text(
                      'Continuer sans compte',
                      style: TextStyle(
                        fontSize: 15.0,
                        fontWeight: FontWeight.w600,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _login() async {
    if (!_isValidPhone(_phoneController.text)) {
      _showSnackBar('Veuillez entrer un numéro de téléphone valide');
      return;
    }
    if (_passwordController.text.length < 6) {
      _showSnackBar('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    setState(() {
      _isLoading = true;
    });
    try {
      final authProvider = AuthProvider.of(context, listen: false);
      final success = await authProvider.login(
        phoneNumber: '+221${_phoneController.text}',
        password: _passwordController.text,
      );
      if (!mounted) {
        return;
      }
      setState(() {
        _isLoading = false;
      });
      if (success && authProvider.currentUser != null) {
        final userRole = authProvider.currentUser?.role ?? 'user';
        String userType = 'producteur';
        if (userRole == 'provider' || userRole == 'mechanic') {
          userType = 'prestataire';
        } else {
          if (userRole == 'admin') {
            userType = 'admin';
          }
        }
        if (mounted) {
          final appState = AppState.of(context, listen: false);
          await appState.setCurrentUserType(userType);
        }
        if (mounted) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) =>
                  MainScreen(language: 'fr', userType: userType),
            ),
          );
        }
      } else {
        _showSnackBar('Numéro ou mot de passe incorrect');
      }
    } on ApiException catch (e) {
      if (!mounted) {
        return;
      }
      setState(() {
        _isLoading = false;
      });
      _showSnackBar('Erreur: ${e.message}');
    } catch (e) {
      if (!mounted) {
        return;
      }
      setState(() {
        _isLoading = false;
      });
      _showSnackBar('Erreur: ${e.toString()}');
    }
  }
}
