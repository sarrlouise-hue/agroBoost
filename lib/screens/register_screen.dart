import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import 'otp_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();

  // 🔥 Variables séparées pour chaque champ
  bool _passwordVisible = false;
  bool _confirmPasswordVisible = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 50),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 50),
              const Text(
                "Créer un compte",
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: AppColors.darkText,
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                "Inscrivez-vous pour réserver vos services agricoles facilement",
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
                        keyboardType: TextInputType.phone
                    ),
                    const SizedBox(height: 20),

                    // 🔥 MOT DE PASSE AVEC ŒIL
                    _buildTextField(
                      "Mot de passe",
                      Icons.lock,
                      _passwordController,
                      obscureText: !_passwordVisible,
                      isPassword: true,
                      onToggle: () {
                        setState(() {
                          _passwordVisible = !_passwordVisible;
                        });
                      },
                    ),
                    const SizedBox(height: 20),

                    // 🔥 CONFIRMER MOT DE PASSE AVEC ŒIL
                    _buildTextField(
                      "Confirmer mot de passe",
                      Icons.lock,
                      _confirmPasswordController,
                      obscureText: !_confirmPasswordVisible,
                      isPassword: true,
                      onToggle: () {
                        setState(() {
                          _confirmPasswordVisible = !_confirmPasswordVisible;
                        });
                      },
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
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => OtpScreen(
                                  phoneNumber: _phoneController.text,
                                ),
                              ),
                            );
                          }
                        },
                        child: const Text(
                          "S'inscrire",
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
                          "Vous avez déjà un compte ?",
                          style: TextStyle(color: AppColors.darkText),
                        ),
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text(
                            "Se connecter",
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

  // 🔥 VERSION CORRIGÉE DU BUILDER
  Widget _buildTextField(
      String hint,
      IconData icon,
      TextEditingController controller,
      {
        bool obscureText = false,
        bool isPassword = false,
        VoidCallback? onToggle,
        TextInputType keyboardType = TextInputType.text,
      }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: obscureText,
      validator: (value) {
        if (value == null || value.isEmpty) return "Ce champ est requis";
        if (hint.contains("Confirmer") && value != _passwordController.text) {
          return "Les mots de passe ne correspondent pas";
        }
        return null;
      },
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: Icon(icon, color: AppColors.darkText.withOpacity(0.6)),
        filled: true,
        fillColor: AppColors.veryLightGrey,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(15),
          borderSide: BorderSide.none,
        ),

        // 🔥 L’icône œil seulement si isPassword = true
        suffixIcon: isPassword
            ? IconButton(
          icon: Icon(
            obscureText ? Icons.visibility_off : Icons.visibility,
            color: AppColors.darkText.withOpacity(0.6),
          ),
          onPressed: onToggle,
        )
            : null,
      ),
    );
  }
}
