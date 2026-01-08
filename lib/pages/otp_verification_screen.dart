import 'package:flutter/material.dart';
import 'package:hallo/globals/auth_provider.dart';
import 'package:hallo/pages/profile_selection_screen_for_signup.dart';
import 'package:hallo/auth_collection.dart';

class OtpVerificationScreen extends StatefulWidget {
    const OtpVerificationScreen({
    required this.email,
    required this.name,
    required this.language,
    super.key,
  });

  final String email;

  final String name;

  final String language;

  @override
  State<OtpVerificationScreen> createState() {
    return _OtpVerificationScreenState();
  }
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  final TextEditingController _otpController = TextEditingController();

  bool _isLoading = false;

  bool _isResending = false;

  @override
  void dispose() {
    _otpController.dispose();
    super.dispose();
  }

  void _showSnackBar(String message, {Color? backgroundColor}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: backgroundColor,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12.0),
        ),
      ),
    );
  }

  Future<void> _verifyOtp() async {
    final bool isWolof = widget.language == 'wo';
    if (_otpController.text.length != 6) {
      _showSnackBar(
        isWolof
            ? 'Teral code 6 chiffres'
            : 'Veuillez entrer le code à 6 chiffres',
        backgroundColor: Colors.red,
      );
      return;
    }
    setState(() {
      _isLoading = true;
    });
    try {
      final authProvider = AuthProvider.of(context, listen: false);
      final success = await authProvider.verifyOtp(
        email: widget.email,
        code: _otpController.text,
      );
      if (!mounted) {
        return;
      }
      setState(() {
        _isLoading = false;
      });
      if (success) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => ProfileSelectionScreenForSignup(
              email: widget.email,
              name: widget.name,
              language: widget.language,
            ),
          ),
        );
      } else {
        _showSnackBar(
          isWolof ? 'Code bi baaxul' : 'Code incorrect',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      if (!mounted) {
        return;
      }
      setState(() {
        _isLoading = false;
      });
      final errorMessage = e
          .toString()
          .replaceAll('Exception: ', '')
          .replaceAll('ApiException: ', '');
      _showSnackBar(
        isWolof ? 'Xët bi: $errorMessage' : 'Erreur: $errorMessage',
        backgroundColor: Colors.red,
      );
    }
  }

  Future<void> _resendOtp() async {
    final bool isWolof = widget.language == 'wo';
    setState(() {
      _isResending = true;
    });
    try {
      await AuthCollection.instance.resendOtp(email: widget.email);
      if (!mounted) {
        return;
      }
      setState(() {
        _isResending = false;
      });
      _showSnackBar(
        isWolof ? 'Code bu bees yónne na' : 'Code renvoyé avec succès',
        backgroundColor: Colors.green,
      );
    } catch (e) {
      if (!mounted) {
        return;
      }
      setState(() {
        _isResending = false;
      });
      _showSnackBar(
        isWolof ? 'Yónne code xët na' : 'Erreur lors du renvoi du code',
        backgroundColor: Colors.red,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool isWolof = widget.language == 'wo';
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
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Align(
                  alignment: Alignment.topLeft,
                  child: IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.arrow_back),
                    style: IconButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.surface,
                    ),
                  ),
                ),
                const SizedBox(height: 20.0),
                Center(
                  child: Container(
                    width: 80.0,
                    height: 80.0,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Theme.of(context).colorScheme.primary,
                          const Color(0xfff19066),
                        ],
                      ),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.mail_outline,
                      size: 40.0,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(height: 24.0),
                Text(
                  isWolof ? 'Confirme sa code' : 'Vérification du code',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 8.0),
                Text(
                  isWolof
                      ? 'Nu yónnee code ci ${widget.email}'
                      : 'Nous avons envoyé un code à ${widget.email}',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                ),
                const SizedBox(height: 48.0),
                Text(
                  isWolof ? 'Code bi' : 'Code de vérification',
                  style: Theme.of(
                    context,
                  ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 8.0),
                TextField(
                  controller: _otpController,
                  keyboardType: TextInputType.number,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 24.0,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 8.0,
                  ),
                  maxLength: 6,
                  decoration: InputDecoration(
                    hintText: '000000',
                    counterText: '',
                    filled: true,
                    fillColor: Theme.of(context)
                        .colorScheme
                        .surfaceContainerHighest
                        .withValues(alpha: 0.3),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12.0),
                      borderSide: BorderSide.none,
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
                SizedBox(
                  height: 56.0,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _verifyOtp,
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
                        : Text(
                            isWolof ? 'Confirme' : 'Vérifier',
                            style: const TextStyle(
                              fontSize: 16.0,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                  ),
                ),
                const SizedBox(height: 16.0),
                TextButton(
                  onPressed: _isResending ? null : _resendOtp,
                  child: _isResending
                      ? const SizedBox(
                          width: 20.0,
                          height: 20.0,
                          child: CircularProgressIndicator(strokeWidth: 2.0),
                        )
                      : Text(
                          isWolof ? 'Yónne code' : 'Renvoyer le code',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
