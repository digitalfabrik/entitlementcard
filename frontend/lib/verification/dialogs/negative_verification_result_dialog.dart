import 'package:flutter/material.dart';

import 'verification_result_dialog.dart';

class NegativeVerificationResultDialog extends StatelessWidget {
  final String reason;

  const NegativeVerificationResultDialog({Key key, this.reason}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return VerificationResultDialog(
        title: "Nicht validiert",
        icon: Icons.error,
        iconColor: Colors.red,
        child: Text(reason)
    );
  }

  static Future<void> show(BuildContext context, String reason) =>
      showDialog(
          context: context,
          builder: (_) => NegativeVerificationResultDialog(reason: reason)
      );
}
