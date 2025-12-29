// ignore_for_file: unused_element

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:allotracteur/pages/payment_screen.dart';
import 'package:allotracteur/tractor_data.dart';

class ReservationScreen extends StatefulWidget {
  const ReservationScreen({
    required this.tractor,
    required this.language,
    super.key,
  });

  final TractorData tractor;

  final String language;

  @override
  State<ReservationScreen> createState() {
    return _ReservationScreenState();
  }
}

class _ReservationScreenState extends State<ReservationScreen> {
  final double _operatorPricePerHa = 5000.0;

  final double _fuelPricePerHa = 3000.0;

  final double _transportPrice = 15000.0;

  DateTime? _selectedDate;

  final TextEditingController _hectaresController = TextEditingController();

  bool _withOperator = false;

  bool _withFuel = false;

  bool _withTransport = false;

  final TextEditingController _notesController = TextEditingController();

  double get totalPrice {
    double hectares = double.tryParse(_hectaresController.text) ?? 0.0;
    double base = widget.tractor.pricePerHectare * hectares;
    double extras = 0.0;
    if (_withOperator) {
      extras += _operatorPricePerHa * hectares;
    }
    if (_withFuel) {
      extras += _fuelPricePerHa * hectares;
    }
    if (_withTransport) {
      extras += _transportPrice;
    }
    return base + extras;
  }

  @override
  void dispose() {
    _hectaresController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bool isWolof = widget.language == 'wo';
    return Scaffold(
      appBar: AppBar(
        title: Text(isWolof ? 'Res' : 'Réservation'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildTractorSummary(isWolof),
            const SizedBox(height: 24.0),
            const Divider(),
            const SizedBox(height: 24.0),
            _buildDateSelection(isWolof),
            const SizedBox(height: 24.0),
            _buildSurfaceInput(isWolof),
            const SizedBox(height: 24.0),
            _buildOptions(isWolof),
            const SizedBox(height: 24.0),
            _buildNotes(isWolof),
            const SizedBox(height: 24.0),
            const Divider(),
            const SizedBox(height: 24.0),
            _buildPriceSummary(isWolof),
            const SizedBox(height: 100.0),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomBar(isWolof),
    );
  }

  Widget _buildTractorSummary(bool isWolof) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(16.0),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12.0),
            child: Image.network(
              widget.tractor.imageUrl,
              width: 80.0,
              height: 80.0,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(
                width: 80.0,
                height: 80.0,
                color: Theme.of(context).colorScheme.surfaceContainerHighest,
                child: const Icon(Icons.agriculture, size: 40.0),
              ),
            ),
          ),
          const SizedBox(width: 12.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.tractor.name,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 4.0),
                Text(
                  widget.tractor.owner,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: 4.0),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8.0,
                    vertical: 3.0,
                  ),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.primaryContainer,
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                  child: Text(
                    isWolof
                        ? widget.tractor.serviceTypeWolof
                        : widget.tractor.serviceType,
                    style: TextStyle(
                      fontSize: 11.0,
                      fontWeight: FontWeight.w600,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDateSelection(bool isWolof) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8.0),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primaryContainer,
                shape: BoxShape.circle,
              ),
              child: Text(
                '1',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
            ),
            const SizedBox(width: 12.0),
            Text(
              isWolof ? 'Tànnal bësu liggéey' : 'Choisir la date',
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        const SizedBox(height: 16.0),
        InkWell(
          onTap: () async {
            final date = await showDatePicker(
              context: context,
              initialDate: DateTime.now().add(const Duration(days: 1)),
              firstDate: DateTime.now(),
              lastDate: DateTime.now().add(const Duration(days: 90)),
            );
            if (date != null) {
              setState(() {
                _selectedDate = date;
              });
            }
          },
          child: Container(
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              border: Border.all(
                color: _selectedDate != null
                    ? Theme.of(context).colorScheme.primary
                    : Theme.of(context).colorScheme.outline,
                width: 2.0,
              ),
              borderRadius: BorderRadius.circular(12.0),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.calendar_today,
                  color: _selectedDate != null
                      ? Theme.of(context).colorScheme.primary
                      : Theme.of(context).colorScheme.onSurfaceVariant,
                ),
                const SizedBox(width: 12.0),
                Text(
                  _selectedDate != null
                      ? '${_selectedDate?.day}/${_selectedDate?.month}/${_selectedDate?.year}'
                      : (isWolof ? 'Tànnal bës' : 'Sélectionner une date'),
                  style: TextStyle(
                    fontSize: 16.0,
                    fontWeight: _selectedDate != null
                        ? FontWeight.w600
                        : FontWeight.normal,
                    color: _selectedDate != null
                        ? Theme.of(context).colorScheme.onSurface
                        : Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSurfaceInput(bool isWolof) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8.0),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primaryContainer,
                shape: BoxShape.circle,
              ),
              child: Text(
                '2',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
            ),
            const SizedBox(width: 12.0),
            Text(
              isWolof ? 'Njëg sa dayo (ha)' : 'Surface à traiter',
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        const SizedBox(height: 16.0),
        TextField(
          controller: _hectaresController,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          inputFormatters: [
            FilteringTextInputFormatter.allow(RegExp('^\\d+\\.?\\d{0,2}')),
          ],
          decoration: InputDecoration(
            hintText: isWolof
                ? 'Dugal dayo (ex: 2.5)'
                : 'Entrer la surface (ex: 2.5)',
            suffixText: 'hectares (ha)',
            suffixStyle: TextStyle(
              color: Theme.of(context).colorScheme.primary,
              fontWeight: FontWeight.w600,
            ),
            prefixIcon: const Icon(Icons.landscape),
          ),
          style: const TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
          onChanged: (value) {
            setState(() {});
          },
        ),
        const SizedBox(height: 8.0),
        if (_hectaresController.text.isNotEmpty)
          Container(
            padding: const EdgeInsets.all(12.0),
            decoration: BoxDecoration(
              color: Theme.of(
                context,
              ).colorScheme.secondaryContainer.withValues(alpha: 0.5),
              borderRadius: BorderRadius.circular(12.0),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.calculate,
                  size: 20.0,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(width: 8.0),
                Text(
                  '${_hectaresController.text} ha × ${widget.tractor.pricePerHectare.toStringAsFixed(0)} F = ${(double.tryParse(_hectaresController.text) ?? 0) * widget.tractor.pricePerHectare} F',
                  style: Theme.of(
                    context,
                  ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildNotes(bool isWolof) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          isWolof ? 'Xëy-xëy ngir boroom bi' : 'Notes pour le prestataire',
          style: Theme.of(
            context,
          ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 12.0),
        TextField(
          controller: _notesController,
          maxLines: 3,
          decoration: InputDecoration(
            hintText: isWolof
                ? 'Bindee sa xëy-xëy (optionnel)'
                : 'Ajouter des notes (optionnel)',
          ),
        ),
      ],
    );
  }

  Widget _buildPriceLine({required String label, required double price}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label),
          Text(
            '${price.toStringAsFixed(0)} F',
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomBar(bool isWolof) {
    bool isValid = _selectedDate != null &&
        _hectaresController.text.isNotEmpty &&
        (double.tryParse(_hectaresController.text) ?? 0) > 0;
    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10.0,
            offset: const Offset(0.0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  isWolof ? 'Njëg total' : 'Total à payer',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                Text(
                  '${totalPrice.toStringAsFixed(0)} F',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        color: Theme.of(context).colorScheme.primary,
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 12.0),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: isValid
                    ? () {
                        _showConfirmationDialog(isWolof);
                      }
                    : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                ),
                child: Text(
                  isWolof ? 'Tëgg ak fey' : 'Confirmer et payer',
                  style: const TextStyle(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPriceSummary(bool isWolof) {
    double hectares = double.tryParse(_hectaresController.text) ?? 0.0;
    double basePrice = widget.tractor.pricePerHectare * hectares;
    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(
          color: Theme.of(context).colorScheme.primary,
          width: 2.0,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            isWolof ? 'Njëg total' : 'Récapitulatif',
            style: Theme.of(
              context,
            ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16.0),
          _buildPriceLine(
            label:
                '${isWolof ? 'Njënd bu jaadu' : 'Service de base'} ($hectares ha)',
            price: basePrice,
          ),
          if (_withOperator)
            _buildPriceLine(
              label: '${isWolof ? 'Kilimaan' : 'Opérateur'} ($hectares ha)',
              price: _operatorPricePerHa * hectares,
            ),
          if (_withFuel)
            _buildPriceLine(
              label: '${isWolof ? 'Esaas' : 'Carburant'} ($hectares ha)',
              price: _fuelPricePerHa * hectares,
            ),
          if (_withTransport)
            _buildPriceLine(
              label: isWolof ? 'Transport' : 'Transport',
              price: _transportPrice,
            ),
          const Divider(height: 24.0),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'TOTAL',
                style: Theme.of(
                  context,
                ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              Text(
                '${totalPrice.toStringAsFixed(0)} F',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: Theme.of(context).colorScheme.primary,
                      fontWeight: FontWeight.bold,
                    ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOptions(bool isWolof) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8.0),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primaryContainer,
                shape: BoxShape.circle,
              ),
              child: Text(
                '3',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
            ),
            const SizedBox(width: 12.0),
            Text(
              isWolof ? 'Tànnaluwaay yu ëpp' : 'Options supplémentaires',
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        const SizedBox(height: 16.0),
        CheckboxListTile(
          title: Text(
            isWolof ? 'Ak kilimaan' : 'Avec opérateur',
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: Text('+ ${_operatorPricePerHa.toStringAsFixed(0)} F/ha'),
          value: _withOperator,
          onChanged: (val) {
            setState(() {
              _withOperator = val ?? false;
            });
          },
          activeColor: Theme.of(context).colorScheme.primary,
          contentPadding: EdgeInsets.zero,
          controlAffinity: ListTileControlAffinity.leading,
        ),
        CheckboxListTile(
          title: Text(
            isWolof ? 'Esaas ci biir' : 'Carburant inclus',
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: Text('+ ${_fuelPricePerHa.toStringAsFixed(0)} F/ha'),
          value: _withFuel,
          onChanged: (val) {
            setState(() {
              _withFuel = val ?? false;
            });
          },
          activeColor: Theme.of(context).colorScheme.primary,
          contentPadding: EdgeInsets.zero,
          controlAffinity: ListTileControlAffinity.leading,
        ),
        CheckboxListTile(
          title: Text(
            isWolof ? 'Transport' : 'Transport du tracteur',
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: Text('+ ${_transportPrice.toStringAsFixed(0)} F (fixe)'),
          value: _withTransport,
          onChanged: (val) {
            setState(() {
              _withTransport = val ?? false;
            });
          },
          activeColor: Theme.of(context).colorScheme.primary,
          contentPadding: EdgeInsets.zero,
          controlAffinity: ListTileControlAffinity.leading,
        ),
      ],
    );
  }

  void _showConfirmationDialog(bool isWolof) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isWolof ? 'Tëgg réservation' : 'Confirmer la réservation'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.tractor.name,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8.0),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16.0),
                const SizedBox(width: 8.0),
                Text(
                  '${_selectedDate?.day}/${_selectedDate?.month}/${_selectedDate?.year}',
                ),
              ],
            ),
            const SizedBox(height: 4.0),
            Row(
              children: [
                const Icon(Icons.landscape, size: 16.0),
                const SizedBox(width: 8.0),
                Text('${_hectaresController.text} hectares'),
              ],
            ),
            const SizedBox(height: 12.0),
            const Divider(),
            const SizedBox(height: 8.0),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Total:',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                Text(
                  '${totalPrice.toStringAsFixed(0)} F',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              isWolof ? 'Bisantil' : 'Annuler',
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => PaymentScreen(
                    amount: totalPrice,
                    tractorName: widget.tractor.name,
                    serviceType: isWolof
                        ? widget.tractor.serviceTypeWolof
                        : widget.tractor.serviceType,
                    hectares: double.tryParse(_hectaresController.text) ?? 0.0,
                    date: _selectedDate!,
                    language: widget.language,
                  ),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(
                horizontal: 24.0,
                vertical: 12.0,
              ),
            ),
            child: Text(
              isWolof ? 'Fey' : 'Payer',
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showSuccessMessage(bool isWolof) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          isWolof
              ? 'Réservation bi am na ci jaadu! Statut: DEMANDÉ'
              : 'Réservation créée avec succès! Statut: DEMANDÉ',
        ),
        backgroundColor: const Color(0xff2d5016),
        behavior: SnackBarBehavior.floating,
      ),
    );
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        Navigator.popUntil(context, (route) => route.isFirst);
      }
    });
  }
}
