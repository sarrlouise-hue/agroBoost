class Validators {
  static String? validateRequired(String? value, String fieldName) {
    if (value == null || value.isEmpty) {
      return '$fieldName est requis';
    }
    return null;
  }

  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) return 'Email est requis';
    final regex = RegExp(r'^[^@]+@[^@]+\.[^@]+');
    if (!regex.hasMatch(value)) return 'Email invalide';
    return null;
  }

  static String? validatePhone(String? value) {
    if (value == null || value.isEmpty) return 'Numéro requis';
    if (value.length < 9) return 'Numéro invalide (min 9 chiffres)';
    return null;
  }
}
