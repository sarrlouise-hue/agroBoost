import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class ThemeModeProvider extends ChangeNotifier {
  ThemeModeProvider();

  factory ThemeModeProvider.of(BuildContext context, {bool listen = false}) {
    return Provider.of<ThemeModeProvider>(context, listen: listen);
  }

  bool _isDarkMode = false;

  bool get isDarkMode {
    return _isDarkMode;
  }

  void toggleTheme() {
    _isDarkMode = !_isDarkMode;
    notifyListeners();
  }

  void setDarkMode(bool value) {
    _isDarkMode = value;
    notifyListeners();
  }
}
