import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class VoiceCommandProvider extends ChangeNotifier {
  VoiceCommandProvider();

  factory VoiceCommandProvider.of(BuildContext context, {bool listen = false}) {
    return Provider.of<VoiceCommandProvider>(context, listen: listen);
  }

  bool _isListening = false;

  String _lastCommand = '';

  String _currentLanguage = 'fr';

  bool get isListening {
    return _isListening;
  }

  String get lastCommand {
    return _lastCommand;
  }

  String get currentLanguage {
    return _currentLanguage;
  }

  final Map<String, List<String>> _wolofCommands = {
    'rechercher_tracteur': [
      'gis traktëër',
      'suma bëgg gis traktëër',
      'wut ma traktëër',
    ],
    'reserver': ['bëgg na res', 'suma bëgg res', 'dama bëgg res'],
    'mes_reservations': [
      'wutal sama reservations',
      'gis sama reservations',
      'wutal réservation',
    ],
    'entretien': [
      'wutal entretien',
      'gis entretien',
      'suma bëgg gis entretien',
    ],
    'paiement': ['fey', 'suma bëgg fey', 'dama bëgg fey'],
  };

  void setLanguage(String language) {
    _currentLanguage = language;
    notifyListeners();
  }

  Future<void> startListening() async {
    _isListening = true;
    notifyListeners();
    await Future.delayed(const Duration(seconds: 2));
    if (_currentLanguage == 'wo') {
      _lastCommand = 'gis traktëër';
    } else {
      _lastCommand = 'rechercher tracteur';
    }
    _isListening = false;
    notifyListeners();
  }

  void stopListening() {
    _isListening = false;
    notifyListeners();
  }

  String? interpretWolofCommand(String command) {
    final normalizedCommand = command.toLowerCase().trim();
    for (var entry in _wolofCommands.entries) {
      for (var wolofPhrase in entry.value) {
        if (normalizedCommand.contains(wolofPhrase)) {
          return entry.key;
        }
      }
    }
    return null;
  }

  void executeCommand(BuildContext context, String action) {
    if (action == 'rechercher_tracteur') {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('🎤 Recherche de tracteurs...'),
          duration: Duration(seconds: 2),
        ),
      );
    } else {
      if (action == 'reserver') {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('🎤 Ouverture de la réservation...'),
            duration: Duration(seconds: 2),
          ),
        );
      } else {
        if (action == 'mes_reservations') {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('🎤 Affichage des réservations...'),
              duration: Duration(seconds: 2),
            ),
          );
        } else {
          if (action == 'entretien') {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('🎤 Ouverture du module d\'entretien...'),
                duration: Duration(seconds: 2),
              ),
            );
          } else {
            if (action == 'paiement') {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('🎤 Ouverture du paiement...'),
                  duration: Duration(seconds: 2),
                ),
              );
            }
          }
        }
      }
    }
  }
}
