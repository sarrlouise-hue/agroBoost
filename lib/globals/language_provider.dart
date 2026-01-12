import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class LanguageProvider extends ChangeNotifier {
  LanguageProvider();

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

  void toggleLanguage() {
    _currentLanguage = _currentLanguage == 'fr' ? 'wo' : 'fr';
    notifyListeners();
  }

  void setLanguage(String language) {
    _currentLanguage = language;
    notifyListeners();
  }
}
