import 'package:flutter/material.dart';
import '../view_models/auth_view_model.dart';
import 'home_screen.dart';
import '../core/constants/app_colors.dart';
import 'dart:async';

class OtpScreen extends StatefulWidget {
  final String phone;
  const OtpScreen({super.key, required this.phone});

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  List<String> otpValues = ["", "", "", ""]; // 4 cases
  final List<FocusNode> focusNodes = List.generate(4, (_) => FocusNode());
  final auth = AuthViewModel();

  int timer = 30;
  Timer? countdown;

  @override
  void initState() {
    super.initState();
    startTimer();
  }

  void startTimer() {
    timer = 30;
    countdown?.cancel();
    countdown = Timer.periodic(const Duration(seconds: 1), (t) {
      if (timer == 0) {
        t.cancel();
      } else {
        setState(() => timer--);
      }
    });
  }

  @override
  void dispose() {
    countdown?.cancel();
    for (var node in focusNodes) node.dispose();
    super.dispose();
  }

  void submitOtp() {
    String enteredOtp = otpValues.join();
    if (enteredOtp == "1234") {
      // code OTP fixe
      Navigator.pushReplacement(
          context, MaterialPageRoute(builder: (_) => const HomeScreen()));
    } else {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text("OTP incorrect")));
    }
  }

  Widget otpBox(int index) {
    return SizedBox(
      width: 55,
      child: TextField(
        focusNode: focusNodes[index],
        keyboardType: TextInputType.number,
        textAlign: TextAlign.center,
        maxLength: 1,
        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        decoration: InputDecoration(
          counterText: "",
          filled: true,
          fillColor: AppColors.greyBackground,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        onChanged: (val) {
          if (val.isNotEmpty && index < 3) {
            focusNodes[index + 1].requestFocus();
          }
          if (val.isEmpty && index > 0) {
            focusNodes[index - 1].requestFocus();
          }
          otpValues[index] = val;
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Validation OTP")),
      body: Padding(
        padding: const EdgeInsets.all(25),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "Code envoyé à ${widget.phone}",
              style: const TextStyle(fontSize: 18),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: List.generate(4, (index) => otpBox(index)),
            ),
            const SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryGreen,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15)),
                ),
                onPressed: submitOtp,
                child: const Text(
                  "Valider OTP",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            const SizedBox(height: 15),
            TextButton(
              onPressed: timer == 0 ? startTimer : null,
              child: Text(
                timer == 0 ? "Renvoyer OTP" : "Renvoyer dans $timer s",
                style: TextStyle(
                    color:
                        timer == 0 ? AppColors.primaryGreen : Colors.black54),
              ),
            )
          ],
        ),
      ),
    );
  }
}
