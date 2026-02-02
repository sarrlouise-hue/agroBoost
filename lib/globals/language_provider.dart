import 'package:flutter/material.dart';
import 'package:allotracteur/main.dart';
import 'package:provider/provider.dart';

class LanguageProvider extends ChangeNotifier {
  LanguageProvider() {
    _loadLanguageFromStorage();
  }

  factory LanguageProvider.of(BuildContext context, {bool listen = false}) {
    return Provider.of<LanguageProvider>(context, listen: listen);
  }

  String _currentLanguage = 'fr';

  String get currentLanguage {
    return _currentLanguage;
  }

  bool get isWolof {
    return _currentLanguage == 'wo';
  }

  bool get isFrench {
    return _currentLanguage == 'fr';
  }

  Future<void> _loadLanguageFromStorage() async {
    try {
      final savedLanguage = sharedPrefs.getString('app_language');
      if (savedLanguage != null &&
          (savedLanguage == 'fr' || savedLanguage == 'wo')) {
        _currentLanguage = savedLanguage;
        notifyListeners();
      }
    } catch (e) {
      print('Erreur lors du chargement de la langue: ${e}');
    }
  }

  Future<void> toggleLanguage() async {
    _currentLanguage = _currentLanguage == 'fr' ? 'wo' : 'fr';
    await _saveLanguageToStorage();
    notifyListeners();
  }

  Future<void> setLanguage(String language) async {
    if (language == 'fr' || language == 'wo') {
      _currentLanguage = language;
      await _saveLanguageToStorage();
      notifyListeners();
    }
  }

  Future<void> _saveLanguageToStorage() async {
    try {
      await sharedPrefs.setString('app_language', _currentLanguage);
      print('✅ Langue sauvegardée: ${_currentLanguage}');
    } catch (e) {
      print('❌ Erreur lors de la sauvegarde de la langue: ${e}');
    }
  }
}
