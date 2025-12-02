import 'package:flutter/material.dart';

class AuthViewModel extends ChangeNotifier {
  bool isLoading = false;

  // Simule l'envoi d'un OTP
  Future<bool> sendOtp(String phone) async {
    isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(seconds: 2)); // simulate API call
    isLoading = false;
    notifyListeners();
    return true; // toujours succès pour test
  }

  // Simule la validation OTP
  Future<bool> verifyOtp(String phone, String otp) async {
    isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(seconds: 2));
    isLoading = false;
    notifyListeners();
    return otp == "123456"; // code de test
  }
}
