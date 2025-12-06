import 'package:flutter/material.dart';
import 'package:agro_boost/core/constants/app_colors.dart';
import 'package:agro_boost/core/constants/app_styles.dart';
import 'package:agro_boost/screens/home_screen.dart'; // Pour ServiceItem

class ReservationScreen extends StatefulWidget {
  final ServiceItem service;

  const ReservationScreen({super.key, required this.service});

  @override
  State<ReservationScreen> createState() => _ReservationScreenState();
}

class _ReservationScreenState extends State<ReservationScreen> {
  late DateTime _startDate;
  late DateTime _endDate;
  late TimeOfDay _startTime;
  late TimeOfDay _endTime;

  final TextEditingController _notesController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _startDate = DateTime.now().add(const Duration(days: 1));
    _endDate = DateTime.now().add(const Duration(days: 2));
    _startTime = const TimeOfDay(hour: 8, minute: 0);
    _endTime = const TimeOfDay(hour: 17, minute: 0);
  }

  // ------------------------------------------
  // CALCULS
  // ------------------------------------------
  int get _durationDays => _endDate.difference(_startDate).inDays + 1;

  int get _pricePerDay => int.parse(widget.service.price);

  int get _subTotal => _durationDays * _pricePerDay;

  int get _tax => (_subTotal * 0.05).toInt();

  int get _total => _subTotal + _tax;

  // ------------------------------------------
  // UI
  // ------------------------------------------
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.veryLightGrey,
      appBar: AppBar(
        title: const Text("Réserver un service"),
        backgroundColor: AppColors.primaryGreen,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildServiceSummary(),
            _buildDateSection(),
            _buildTimeSection(),
            _buildNotesSection(),
            _buildPriceSection(),
            _buildButtons(),
          ],
        ),
      ),
    );
  }

  // ------------------------------------------
  // SERVICE SUMMARY
  // ------------------------------------------
  Widget _buildServiceSummary() {
    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.only(bottom: 10),
      color: Colors.white,
      child: Row(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: AppColors.secondaryGreen.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.agriculture, size: 35, color: AppColors.primaryGreen),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(widget.service.title,
                    style: AppStyles.bodyLarge.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text('${widget.service.price} FCFA / jour',
                    style: AppStyles.caption.copyWith(
                        color: AppColors.primaryGreen, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ------------------------------------------
  // DATE SECTION
  // ------------------------------------------
  Widget _buildDateSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.white,
      margin: const EdgeInsets.only(bottom: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("📅 Sélectionner les dates", style: AppStyles.bodyLarge),
          const SizedBox(height: 14),

          // DATE DEBUT
          _buildDatePicker(
            label: "Date de début",
            value: _formatDate(_startDate),
            onTap: _selectStartDate,
          ),

          const SizedBox(height: 12),

          // DATE FIN
          _buildDatePicker(
            label: "Date de fin",
            value: _formatDate(_endDate),
            onTap: _selectEndDate,
          ),

          const SizedBox(height: 12),

          // Durée
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.primaryGreen.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text("⏱️ Durée : $_durationDays jour(s)",
                style: AppStyles.bodyMedium.copyWith(
                    color: AppColors.primaryGreen, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildDatePicker({required String label, required String value, required VoidCallback onTap}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppStyles.labelSmall),
        const SizedBox(height: 6),
        GestureDetector(
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
                border: Border.all(color: AppColors.border),
                borderRadius: BorderRadius.circular(8)),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(value, style: AppStyles.bodyMedium),
                const Icon(Icons.calendar_today, color: AppColors.primaryGreen),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // ------------------------------------------
  // TIME SECTION
  // ------------------------------------------
  Widget _buildTimeSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.white,
      margin: const EdgeInsets.only(bottom: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("🕐 Sélectionner les heures", style: AppStyles.bodyLarge),
          const SizedBox(height: 14),

          _buildTimePicker(
            label: "Heure début",
            value: _formatTime(_startTime),
            onTap: _selectStartTime,
          ),

          const SizedBox(height: 12),

          _buildTimePicker(
            label: "Heure fin",
            value: _formatTime(_endTime),
            onTap: _selectEndTime,
          ),
        ],
      ),
    );
  }

  Widget _buildTimePicker({required String label, required String value, required VoidCallback onTap}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppStyles.labelSmall),
        const SizedBox(height: 6),
        GestureDetector(
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
                border: Border.all(color: AppColors.border),
                borderRadius: BorderRadius.circular(8)),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(value, style: AppStyles.bodyMedium),
                const Icon(Icons.access_time, color: AppColors.primaryGreen),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // ------------------------------------------
  // NOTES
  // ------------------------------------------
  Widget _buildNotesSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.white,
      margin: const EdgeInsets.only(bottom: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("📝 Notes spéciales (optionnel)", style: AppStyles.bodyLarge),
          const SizedBox(height: 12),
          TextField(
            controller: _notesController,
            maxLines: 4,
            decoration: InputDecoration(
              hintText: "Indiquez des détails ou besoins particuliers...",
              fillColor: AppColors.lightGrey,
              filled: true,
              border: OutlineInputBorder(
                borderSide: const BorderSide(color: AppColors.border),
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ------------------------------------------
  // PRICE SECTION
  // ------------------------------------------
  Widget _buildPriceSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.white,
      margin: const EdgeInsets.only(bottom: 10),
      child: Column(
        children: [
          _priceRow("Durée", "$_durationDays jour(s)"),
          _priceRow("Prix / jour", "$_pricePerDay FCFA"),
          const Divider(),
          _priceRow("Sous-total", "$_subTotal FCFA", bold: true),
          _priceRow("Taxes (5%)", "$_tax FCFA"),
          const Divider(),
          _priceRow("TOTAL", "$_total FCFA", bold: true, big: true),
        ],
      ),
    );
  }

  Widget _priceRow(String label, String value, {bool bold = false, bool big = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: AppStyles.bodyMedium.copyWith(
                  fontWeight: bold ? FontWeight.bold : FontWeight.normal)),
          Text(value,
              style: AppStyles.bodyMedium.copyWith(
                fontSize: big ? 20 : 14,
                color: bold ? AppColors.primaryGreen : Colors.black,
                fontWeight: bold ? FontWeight.bold : FontWeight.normal,
              )),
        ],
      ),
    );
  }

  // ------------------------------------------
  // BUTTONS
  // ------------------------------------------
  Widget _buildButtons() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Expanded(
            child: OutlinedButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Annuler"),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryGreen,
              ),
              onPressed: _confirmReservation,
              child: const Text("Confirmer"),
            ),
          ),
        ],
      ),
    );
  }

  // ------------------------------------------
  // DATE & TIME PICKERS
  // ------------------------------------------
  Future<void> _selectStartDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _startDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) {
      setState(() {
        _startDate = picked;
        if (_endDate.isBefore(_startDate)) {
          _endDate = _startDate.add(const Duration(days: 1));
        }
      });
    }
  }

  Future<void> _selectEndDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _endDate,
      firstDate: _startDate,
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) {
      setState(() => _endDate = picked);
    }
  }

  Future<void> _selectStartTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: _startTime,
    );
    if (picked != null) {
      setState(() => _startTime = picked);
    }
  }

  Future<void> _selectEndTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: _endTime,
    );
    if (picked != null) {
      setState(() => _endTime = picked);
    }
  }

  // ------------------------------------------
  // CONFIRMATION
  // ------------------------------------------
  void _confirmReservation() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Réservation confirmée ✔️"),
        backgroundColor: AppColors.success,
      ),
    );
  }

  // ------------------------------------------
  // UTIL
  // ------------------------------------------
  String _formatDate(DateTime d) => "${d.day}/${d.month}/${d.year}";
  String _formatTime(TimeOfDay t) => "${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}";
}
