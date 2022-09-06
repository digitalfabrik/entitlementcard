import 'package:ehrenamtskarte/verification/dialogs/verification_result_dialog.dart';
import 'package:flutter/material.dart';

class NegativeVerificationResultDialog extends StatelessWidget {
  final String reason;

  const NegativeVerificationResultDialog({super.key, required this.reason});

  @override
  Widget build(BuildContext context) {
    return VerificationResultDialog(
      title: "Nicht verifiziert",
      icon: Icons.error,
      iconColor: Colors.red,
      child: Text(reason),
    );
  }

  static Future<void> show(BuildContext context, String reason) =>
      showDialog(context: context, builder: (_) => NegativeVerificationResultDialog(reason: reason));
}
