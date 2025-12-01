class AuthService {
  Future<bool> login(String email, String password) async {
    // Simule une connexion (à remplacer plus tard)
    await Future.delayed(const Duration(seconds: 1));
    return email.isNotEmpty && password.isNotEmpty;
  }
}
