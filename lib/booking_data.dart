import 'package:flutter/material.dart';

class BookingData {
  BookingData({
    required this.id,
    required this.tractorName,
    required this.tractorModel,
    required this.service,
    required this.date,
    required this.hectares,
    required this.totalPrice,
    required this.status,
    this.tractorImage,
    required this.ownerName,
  });

  final String id;

  final String tractorName;

  final String tractorModel;

  final String service;

  final DateTime date;

  final double hectares;

  final double totalPrice;

  final String status;

  final String? tractorImage;

  final String ownerName;

  String getStatusText() {
    if (status == 'pending') {
      return 'En attente';
    }
    if (status == 'confirmed') {
      return 'Confirmée';
    }
    if (status == 'in_progress') {
      return 'En cours';
    }
    if (status == 'completed') {
      return 'Terminée';
    }
    if (status == 'cancelled') {
      return 'Annulée';
    }
    return status;
  }

  Color getStatusColor() {
    if (status == 'pending') {
      return Colors.orange;
    }
    if (status == 'confirmed') {
      return Colors.blue;
    }
    if (status == 'in_progress') {
      return const Color(0xffe56d4b);
    }
    if (status == 'completed') {
      return Colors.green;
    }
    if (status == 'cancelled') {
      return Colors.red;
    }
    return Colors.grey;
  }
}
