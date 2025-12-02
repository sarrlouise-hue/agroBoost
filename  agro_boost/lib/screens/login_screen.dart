import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _obscurePassword = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.greyBackground,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 50),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 50),
              const Text(
                "Se connecter",
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: AppColors.darkText,
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                "Connectez-vous pour accéder à vos services agricoles",
                style: TextStyle(
                  fontSize: 16,
                  color: AppColors.darkText,
                ),
              ),
              const SizedBox(height: 40),
              Form(
                key: _formKey,
                child: Column(
                  children: [
                    _buildTextField(
                      "Numéro de téléphone",
                      Icons.phone,
                      _phoneController,
                      keyboardType: TextInputType.phone,
                    ),
                    const SizedBox(height: 20),
                    _buildTextField(
                      "Mot de passe",
                      Icons.lock,
                      _passwordController,
                      obscureText: true,
                    ),
                    const SizedBox(height: 30),
                    SizedBox(
                      width: double.infinity,
                      height: 55,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primaryGreen,
                          foregroundColor: AppColors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(15),
                          ),
                        ),
                        onPressed: () {
                          if (_formKey.currentState!.validate()) {
                            // TODO: implémenter la connexion réelle
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Connexion réussie !'),
                              ),
                            );
                          }
                        },
                        child: const Text(
                          "Se connecter",
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          "Pas de compte ?",
                          style: TextStyle(color: AppColors.darkText),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (_) => const RegisterScreen()),
                            );
                          },
                          child: const Text(
                            "S'inscrire",
                            style: TextStyle(
                              color: AppColors.primaryGreen,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        )
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(
      String hint,
      IconData icon,
      TextEditingController controller, {
        bool obscureText = false,
        TextInputType keyboardType = TextInputType.text,
      }) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText ? _obscurePassword : false,
      keyboardType: keyboardType,
      validator: (value) {
        if (value == null || value.isEmpty) return "Ce champ est requis";
        if (hint == "Numéro de téléphone" &&
            !RegExp(r'^\+?\d{8,15}$').hasMatch(value)) {
          return "Numéro invalide";
        }
        if (hint == "Mot de passe" && value.length < 6) {
          return "Le mot de passe doit contenir au moins 6 caractères";
        }
        return null;
      },
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: Icon(icon, color: AppColors.darkText.withOpacity(0.6)),
        filled: true,
        fillColor: AppColors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(15),
          borderSide: BorderSide.none,
        ),
        suffixIcon: obscureText
            ? IconButton(
          icon: Icon(
            _obscurePassword ? Icons.visibility : Icons.visibility_off,
            color: AppColors.darkText.withOpacity(0.6),
          ),
          onPressed: () {
            setState(() {
              _obscurePassword = !_obscurePassword;
            });
          },
        )
            : null,
      ),
    );
  }
}
