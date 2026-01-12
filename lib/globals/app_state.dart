import 'package:flutter/material.dart';
import 'package:hallo/globals/themes.dart';
import 'package:hallo/main.dart';
import 'package:provider/provider.dart';

class AppState extends ChangeNotifier {
  AppState() {
    _loadPreferences();
  }

  factory AppState.of(BuildContext context, {bool listen = true}) {
    return Provider.of<AppState>(context, listen: listen);
  }

  ThemeData _theme = lightTheme;

  bool _isDarkMode = false;

  String? _currentUserType;

  ThemeData get theme {
    return _theme;
  }

  bool get isDarkMode {
    return _isDarkMode;
  }

  String? get currentUserType {
    return _currentUserType;
  }

  void changeTheme(ThemeData theme) {
    _theme = theme;
    notifyListeners();
  }

  Future<void> _loadPreferences() async {
    _isDarkMode = sharedPrefs.getBool('isDarkMode') ?? false;
    _currentUserType = sharedPrefs.getString('userType');
    notifyListeners();
  }

  Future<void> setCurrentUserType(String userType) async {
    _currentUserType = userType;
    await sharedPrefs.setString('userType', userType);
    notifyListeners();
  }

  Future<void> toggleDarkMode() async {
    _isDarkMode = !_isDarkMode;
    await sharedPrefs.setBool('isDarkMode', _isDarkMode);
    notifyListeners();
  }

  Future<void> setDarkMode(bool value) async {
    if (_isDarkMode != value) {
      _isDarkMode = value;
      await sharedPrefs.setBool('isDarkMode', _isDarkMode);
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await sharedPrefs.remove('isLoggedIn');
    await sharedPrefs.remove('userType');
    await sharedPrefs.remove('userId');
    await sharedPrefs.remove('userName');
    await sharedPrefs.remove('userEmail');
    _currentUserType = null;
    notifyListeners();
  }
}
