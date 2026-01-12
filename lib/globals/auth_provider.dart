// ignore_for_file: avoid_print

import 'package:flutter/material.dart';
import 'package:hallo/models/auth_response.dart';
import 'package:hallo/models/user_model.dart';
import 'package:hallo/api_service.dart';
import 'package:hallo/users_collection.dart';
import 'package:hallo/auth_collection.dart';
import 'package:provider/provider.dart';

class AuthProvider extends ChangeNotifier {
  AuthProvider();

  factory AuthProvider.of(BuildContext context, {bool listen = false}) {
    return Provider.of<AuthProvider>(context, listen: false);
  }

  UserModel? _currentUser;

  bool _isAuthenticated = false;

  bool _isLoading = false;

  UserModel? get currentUser {
    return _currentUser;
  }

  bool get isAuthenticated {
    return _isAuthenticated;
  }

  bool get isLoading {
    return _isLoading;
  }

  Future<void> initialize() async {
    _isLoading = true;
    notifyListeners();
    try {
      if (ApiService.instance.isAuthenticated) {
        await loadCurrentUser();
      }
    } catch (e) {
      print('Error initializing auth: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadCurrentUser() async {
    try {
      final response = await UsersCollection.instance.getProfile();
      if (response.success) {
        _currentUser = (response as dynamic).data as UserModel?;
        _isAuthenticated = _currentUser != null;
        notifyListeners();
      }
    } catch (e) {
      print('Error loading user: $e');
      _isAuthenticated = false;
      _currentUser = null;
      notifyListeners();
    }
  }

  Future<bool> login({
    required String phoneNumber,
    required String password,
  }) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await AuthCollection.instance.login(
        phoneNumber: phoneNumber,
        password: password,
      );
      if (response.success) {
        _currentUser = ((response as dynamic).data as AuthResponse?)?.user;
        _isAuthenticated = _currentUser != null;
        _isLoading = false;
        notifyListeners();
        return true;
      }
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<bool> register({
    required String phoneNumber,
    required String password,
    required String firstName,
    required String lastName,
    String? email,
    String role = 'user',
  }) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await AuthCollection.instance.register(
        phoneNumber: phoneNumber,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role,
      );
      _isLoading = false;
      notifyListeners();
      return response.success;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<bool> verifyOtp({required String email, required String code}) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await AuthCollection.instance.verifyOtp(
        email: email,
        code: code,
      );
      if (response.success) {
        _currentUser = ((response as dynamic).data as AuthResponse?)?.user;
        _isAuthenticated = _currentUser != null;
        _isLoading = false;
        notifyListeners();
        return true;
      }
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> logout() async {
    try {
      await AuthCollection.instance.logout();
    } catch (e) {
      print('Error during logout: $e');
    } finally {
      _currentUser = null;
      _isAuthenticated = false;
      ApiService.instance.clearTokens();
      notifyListeners();
    }
  }

  void clearError() {
    notifyListeners();
  }
}
