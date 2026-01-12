import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:hallo/pages/main_screen.dart';

class PaymentScreen extends StatefulWidget {
    const PaymentScreen({
    required this.amount,
    required this.tractorName,
    required this.serviceType,
    required this.hectares,
    required this.date,
    required this.language,
    super.key,
  });

  final double amount;

  final String tractorName;

  final String serviceType;

  final double hectares;

  final DateTime date;

  final String language;

  @override
  State<PaymentScreen> createState() {
    return _PaymentScreenState();
  }
}

class _PaymentScreenState extends State<PaymentScreen> {
  String _selectedPaymentMethod = '';

  final TextEditingController _phoneController = TextEditingController();

  final TextEditingController _pinController = TextEditingController();

  bool _isProcessing = false;

  double _paymentProgress = 0.0;

  bool _showPhoneInput = false;

  bool _phoneValidated = false;

  bool _showPinInput = false;

  bool _showSuccessAnimation = false;

  bool _isValidatingPin = false;

  bool _pinValidated = false;

  @override
  void initState() {
    super.initState();
    _phoneController.addListener(_onPhoneChanged);
    _pinController.addListener(_onPinChanged);
  }

  @override
  void dispose() {
    _phoneController.removeListener(_onPhoneChanged);
    _pinController.removeListener(_onPinChanged);
    _phoneController.dispose();
    _pinController.dispose();
    super.dispose();
  }

  void _onPhoneChanged() {
    if (_phoneController.text.length == 9 && !_phoneValidated) {
      setState(() {
        _showSuccessAnimation = true;
      });
      Future.delayed(const Duration(milliseconds: 500), () {
        if (mounted) {
          setState(() {
            _phoneValidated = true;
          });
          Future.delayed(const Duration(milliseconds: 800), () {
            if (mounted) {
              setState(() {
                _showPinInput = true;
              });
            }
          });
        }
      });
    } else {
      if (_phoneController.text.length < 9 && _phoneValidated) {
        setState(() {
          _phoneValidated = false;
          _showSuccessAnimation = false;
          _showPinInput = false;
          _pinValidated = false;
        });
      }
    }
  }

  void _onPinChanged() {
    if (_pinController.text.length == 4 && !_pinValidated) {
      setState(() {
        _isValidatingPin = true;
      });
      Future.delayed(const Duration(milliseconds: 600), () {
        if (mounted) {
          setState(() {
            _isValidatingPin = false;
            _pinValidated = true;
          });
        }
      });
    } else {
      if (_pinController.text.length < 4 && _pinValidated) {
        setState(() {
          _pinValidated = false;
          _isValidatingPin = false;
        });
      }
    }
  }

  void _onPaymentMethodSelected(String id) {
    setState(() {
      _selectedPaymentMethod = id;
      if (!_showPhoneInput) {
        _showPhoneInput = true;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final bool isWolof = widget.language == 'wo';
    return Scaffold(
      appBar: AppBar(
        title: Text(isWolof ? 'Fey' : 'Paiement'),
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
            _buildOrderSummary(isWolof),
            const SizedBox(height: 32.0),
            const Divider(),
            const SizedBox(height: 24.0),
            _buildPaymentMethods(isWolof),
            if (_showPhoneInput) ...[
              const SizedBox(height: 24.0),
              _buildPhoneInput(isWolof),
            ],
            if (_showPinInput) ...[
              const SizedBox(height: 24.0),
              _buildPinInput(isWolof),
              const SizedBox(height: 32.0),
              _buildSecurityInfo(isWolof),
            ],
            const SizedBox(height: 100.0),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomBar(isWolof),
    );
  }

  Widget _buildOrderSummary(bool isWolof) {
    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Theme.of(context).colorScheme.primary,
            Theme.of(context).colorScheme.secondary,
          ],
        ),
        borderRadius: BorderRadius.circular(16.0),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                isWolof ? 'Njëg bu fey' : 'Montant à payer',
                style: const TextStyle(color: Colors.white, fontSize: 14.0),
              ),
              const Icon(Icons.payment, color: Colors.white, size: 20.0),
            ],
          ),
          const SizedBox(height: 8.0),
          Text(
            '${widget.amount.toStringAsFixed(0)} FCFA',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 36.0,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16.0),
          Divider(color: Colors.white.withValues(alpha: 0.3)),
          const SizedBox(height: 12.0),
          _buildSummaryRow(Icons.agriculture, widget.tractorName),
          const SizedBox(height: 8.0),
          _buildSummaryRow(Icons.category, widget.serviceType),
          const SizedBox(height: 8.0),
          _buildSummaryRow(Icons.landscape, '${widget.hectares} ha'),
          const SizedBox(height: 8.0),
          _buildSummaryRow(
            Icons.calendar_today,
            '${widget.date.day}/${widget.date.month}/${widget.date.year}',
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, color: Colors.white.withValues(alpha: 0.8), size: 16.0),
        const SizedBox(width: 8.0),
        Text(text, style: const TextStyle(color: Colors.white, fontSize: 13.0)),
      ],
    );
  }

  Widget _buildPaymentMethods(bool isWolof) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          isWolof ? 'Tànnal yoon bu fey' : 'Choisir le moyen de paiement',
          style: Theme.of(
            context,
          ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16.0),
        _buildPaymentMethodCard(
          id: 'wave',
          name: 'Wave',
          color: const Color(0xff00d9ff),
          icon: Icons.water_drop,
        ),
        const SizedBox(height: 12.0),
        _buildPaymentMethodCard(
          id: 'orange',
          name: 'Orange Money',
          color: const Color(0xffff7900),
          icon: Icons.circle,
        ),
        const SizedBox(height: 12.0),
        _buildPaymentMethodCard(
          id: 'free',
          name: 'Free Money',
          color: const Color(0xffc8102e),
          icon: Icons.account_balance_wallet,
        ),
      ],
    );
  }

  Widget _buildPaymentMethodCard({
    required String id,
    required String name,
    required Color color,
    required IconData icon,
  }) {
    final bool isSelected = _selectedPaymentMethod == id;
    return InkWell(
      onTap: () => _onPaymentMethodSelected(id),
      borderRadius: BorderRadius.circular(12.0),
      child: Container(
        padding: const EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          color: isSelected
              ? color.withValues(alpha: 0.1)
              : Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(12.0),
          border: Border.all(
            color: isSelected ? color : Theme.of(context).colorScheme.outline,
            width: 2.0,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12.0),
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(12.0),
              ),
              child: Icon(icon, color: Colors.white, size: 24.0),
            ),
            const SizedBox(width: 16.0),
            Expanded(
              child: Text(
                name,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: isSelected ? color : null,
                ),
              ),
            ),
            if (isSelected) Icon(Icons.check_circle, color: color, size: 28.0),
          ],
        ),
      ),
    );
  }

  Widget _buildPhoneInput(bool isWolof) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          isWolof ? 'Nimëro téléfon' : 'Numéro de téléphone',
          style: Theme.of(
            context,
          ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 12.0),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: TextField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(9),
                ],
                decoration: InputDecoration(
                  hintText: '77 123 45 67',
                  prefixIcon: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text('🇸🇳', style: TextStyle(fontSize: 24.0)),
                        const SizedBox(width: 8.0),
                        Text(
                          '+221',
                          style: Theme.of(context).textTheme.bodyLarge,
                        ),
                        const SizedBox(width: 8.0),
                        Container(
                          width: 1.0,
                          height: 24.0,
                          color: Theme.of(context).colorScheme.outline,
                        ),
                        const SizedBox(width: 8.0),
                      ],
                    ),
                  ),
                ),
                style: const TextStyle(
                  fontSize: 18.0,
                  fontWeight: FontWeight.w500,
                  letterSpacing: 1.5,
                ),
              ),
            ),
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              width: _showSuccessAnimation ? 50.0 : 0.0,
              child: _phoneValidated
                  ? const Padding(
                      padding: EdgeInsets.only(left: 12.0, top: 12.0),
                      child: Icon(
                        Icons.check_circle,
                        color: Color(0xff2d5016),
                        size: 32.0,
                      ),
                    )
                  : const SizedBox.shrink(),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildPinInput(bool isWolof) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          isWolof ? 'Code PIN' : 'Code PIN',
          style: Theme.of(
            context,
          ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 12.0),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: TextField(
                controller: _pinController,
                keyboardType: TextInputType.number,
                obscureText: true,
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(4),
                ],
                decoration: InputDecoration(
                  hintText: '• • • •',
                  prefixIcon: const Icon(Icons.lock),
                  suffixIcon: IconButton(
                    icon: const Icon(Icons.help_outline),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            isWolof
                                ? 'Dugal sa code PIN bu Mobile Money'
                                : 'Entrez votre code PIN Mobile Money',
                          ),
                        ),
                      );
                    },
                  ),
                ),
                style: const TextStyle(
                  fontSize: 24.0,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 8.0,
                ),
              ),
            ),
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              width: _isValidatingPin || _pinValidated ? 50.0 : 0.0,
              child: _isValidatingPin
                  ? const Padding(
                      padding: EdgeInsets.only(left: 12.0, top: 12.0),
                      child: SizedBox(
                        width: 24.0,
                        height: 24.0,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.5,
                          color: Color(0xff2d5016),
                        ),
                      ),
                    )
                  : _pinValidated
                  ? const Padding(
                      padding: EdgeInsets.only(left: 12.0, top: 12.0),
                      child: Icon(
                        Icons.check_circle,
                        color: Color(0xff2d5016),
                        size: 32.0,
                      ),
                    )
                  : const SizedBox.shrink(),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSecurityInfo(bool isWolof) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: const Color(0xff2d5016).withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(
          color: const Color(0xff2d5016).withValues(alpha: 0.3),
        ),
      ),
      child: Row(
        children: [
          const Icon(Icons.security, color: Color(0xff2d5016), size: 24.0),
          const SizedBox(width: 12.0),
          Expanded(
            child: Text(
              isWolof
                  ? 'Fey bi am na sécurité. Xët-xët bi dañuy gëm.'
                  : 'Paiement 100% sécurisé. Vos informations sont protégées.',
              style: Theme.of(
                context,
              ).textTheme.bodySmall?.copyWith(color: const Color(0xff2d5016)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomBar(bool isWolof) {
    bool isValid =
        _phoneController.text.length == 9 &&
        _pinController.text.length == 4 &&
        _phoneValidated &&
        _pinValidated;
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
            if (_isProcessing) ...[
              Container(
                margin: const EdgeInsets.only(bottom: 16.0),
                padding: const EdgeInsets.all(20.0),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      const Color(0xffe56d4b).withValues(alpha: 0.1),
                      const Color(0xfff19066).withValues(alpha: 0.05),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(16.0),
                  border: Border.all(
                    color: const Color(0xffe56d4b).withValues(alpha: 0.3),
                  ),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8.0),
                              decoration: const BoxDecoration(
                                gradient: LinearGradient(
                                  colors: const [
                                    Color(0xffe56d4b),
                                    Color(0xfff19066),
                                  ],
                                ),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.sync,
                                color: Colors.white,
                                size: 20.0,
                              ),
                            ),
                            const SizedBox(width: 12.0),
                            Text(
                              isWolof
                                  ? 'Daldi procéder ci fey...'
                                  : 'Traitement du paiement...',
                              style: Theme.of(context).textTheme.titleSmall
                                  ?.copyWith(
                                    fontWeight: FontWeight.bold,
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.primary,
                                  ),
                            ),
                          ],
                        ),
                        Text(
                          '${(_paymentProgress * 100).toInt()}%',
                          style: Theme.of(context).textTheme.titleMedium
                              ?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: const Color(0xffe56d4b),
                              ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16.0),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8.0),
                      child: LinearProgressIndicator(
                        value: _paymentProgress,
                        minHeight: 8.0,
                        backgroundColor: Theme.of(
                          context,
                        ).colorScheme.surfaceContainerHighest,
                        valueColor: const AlwaysStoppedAnimation<Color>(
                          Color(0xffe56d4b),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12.0),
                    Row(
                      children: [
                        const Icon(
                          Icons.security,
                          color: Color(0xff2d5016),
                          size: 16.0,
                        ),
                        const SizedBox(width: 8.0),
                        Expanded(
                          child: Text(
                            isWolof
                                ? 'Connexion sécurisée bu Mobile Money...'
                                : 'Connexion sécurisée avec Mobile Money...',
                            style: Theme.of(context).textTheme.bodySmall
                                ?.copyWith(
                                  color: Theme.of(
                                    context,
                                  ).colorScheme.onSurfaceVariant,
                                ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: isValid && !_isProcessing ? _processPayment : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                  disabledBackgroundColor: Theme.of(
                    context,
                  ).colorScheme.outline,
                ),
                child: _isProcessing
                    ? Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const SizedBox(
                            width: 24.0,
                            height: 24.0,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2.0,
                            ),
                          ),
                          const SizedBox(width: 16.0),
                          Text(
                            isWolof ? 'Daldi fey...' : 'Paiement en cours...',
                            style: const TextStyle(
                              fontSize: 16.0,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      )
                    : Text(
                        '${isWolof ? 'Fey' : 'Payer'} ${widget.amount.toStringAsFixed(0)} F',
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

  Future<void> _processPayment() async {
    setState(() {
      _isProcessing = true;
      _paymentProgress = 0.0;
    });
    for (int i = 0; i <= 100; i += 10) {
      await Future.delayed(const Duration(milliseconds: 135));
      if (mounted) {
        setState(() {
          _paymentProgress = i / 100;
        });
      }
    }
    await Future.delayed(const Duration(milliseconds: 150));
    setState(() {
      _isProcessing = false;
    });
    if (mounted) {
      _showSuccessDialog();
    }
  }

  void _showSuccessDialog() {
    final bool isWolof = widget.language == 'wo';
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24.0),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(24.0),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [const Color(0xff2d5016), const Color(0xff3d6b1e)],
                ),
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xff2d5016).withValues(alpha: 0.4),
                    blurRadius: 20.0,
                    spreadRadius: 5.0,
                  ),
                ],
              ),
              child: const Icon(Icons.check, color: Colors.white, size: 56.0),
            ),
            const SizedBox(height: 24.0),
            Text(
              isWolof ? 'Fey bi am na!' : 'Paiement réussi !',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: const Color(0xff2d5016),
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16.0),
            Container(
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    const Color(0xffffda79).withValues(alpha: 0.2),
                    const Color(0xfff19066).withValues(alpha: 0.1),
                  ],
                ),
                borderRadius: BorderRadius.circular(12.0),
                border: Border.all(
                  color: const Color(0xffe56d4b).withValues(alpha: 0.3),
                ),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.info_outline,
                        color: Color(0xffe56d4b),
                        size: 20.0,
                      ),
                      const SizedBox(width: 8.0),
                      Expanded(
                        child: Text(
                          isWolof
                              ? 'Réservation bi dañuy yónne ci boroom bi'
                              : 'Votre réservation a été envoyée au prestataire',
                          style: Theme.of(context).textTheme.bodyMedium
                              ?.copyWith(fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12.0),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12.0,
                      vertical: 6.0,
                    ),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          const Color(0xffffda79).withValues(alpha: 0.4),
                          const Color(0xfff19066).withValues(alpha: 0.3),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(20.0),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.pending_actions,
                          color: const Color(0xffe56d4b).withValues(alpha: 0.9),
                          size: 16.0,
                        ),
                        const SizedBox(width: 6.0),
                        const Text(
                          'STATUT: DEMANDÉ',
                          style: TextStyle(
                            color: Color(0xff2d5016),
                            fontWeight: FontWeight.bold,
                            fontSize: 12.0,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24.0),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(
                      builder: (context) => MainScreen(
                        language: widget.language,
                        userType: 'producteur',
                      ),
                    ),
                    (route) => false,
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                ),
                icon: const Icon(Icons.home),
                label: Text(
                  isWolof ? 'Dellu ci accueil' : 'Retour à l\'accueil',
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
}
