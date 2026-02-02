import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class OfflineModeProvider extends ChangeNotifier {
  OfflineModeProvider();

  factory OfflineModeProvider.of(BuildContext context, {bool listen = false}) {
    return Provider.of<OfflineModeProvider>(context, listen: listen);
  }

  bool _isOnline = true;

  DateTime? _lastSync;

  final List<dynamic> _pendingActions = [];

  final Map<String, dynamic> _cachedData = {};

  bool get isOnline {
    return _isOnline;
  }

  DateTime? get lastSync {
    return _lastSync;
  }

  List<dynamic> get pendingActions {
    return _pendingActions;
  }

  int get pendingActionsCount {
    return _pendingActions.length;
  }

  void setOnlineStatus(bool isOnline) {
    _isOnline = isOnline;
    notifyListeners();
    if (isOnline) {
      _syncPendingActions();
    }
  }

  void cacheData(String key, dynamic data) {
    _cachedData[key] = data;
    notifyListeners();
  }

  dynamic getCachedData(String key) {
    return _cachedData[key];
  }

  void addPendingAction(dynamic action) {
    _pendingActions.add(action);
    notifyListeners();
  }

  Future<void> _syncPendingActions() async {
    if (_pendingActions.isEmpty) {
      return;
    }
    await Future.delayed(const Duration(seconds: 2));
    _pendingActions.clear();
    _lastSync = DateTime.now();
    notifyListeners();
  }

  Future<void> syncNow() async {
    await _syncPendingActions();
  }
}
