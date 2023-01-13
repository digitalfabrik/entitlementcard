import 'package:ehrenamtskarte/verification/dialogs/verification_result_dialog.dart';
import 'package:flutter/material.dart';

class InternetConnectionVerificationDialog extends StatelessWidget {
  final String reason;

  const InternetConnectionVerificationDialog({super.key, required this.reason});

  @override
  Widget build(BuildContext context) {
    return VerificationResultDialog(
      title: "Keine Verbindung möglich",
      icon: Icons.signal_cellular_connected_no_internet_4_bar,
      iconColor: Colors.white,
      child: Text(reason),
    );
  }

  static Future<void> show(BuildContext context, String reason) =>
      showDialog(context: context, builder: (_) => InternetConnectionVerificationDialog(reason: reason));
}
