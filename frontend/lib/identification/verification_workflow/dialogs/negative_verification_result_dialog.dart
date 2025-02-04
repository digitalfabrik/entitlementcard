import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

import 'package:ehrenamtskarte/widgets/custom_alert_dialog.dart';

class NegativeVerificationResultDialog extends StatelessWidget {
  final String reason;

  const NegativeVerificationResultDialog({super.key, required this.reason});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    return CustomAlertDialog(
      title: t.identification.notVerified,
      icon: Icons.error,
      iconColor: Colors.red,
      message: reason,
    );
  }

  static Future<void> show(BuildContext context, String reason) =>
      showDialog(context: context, builder: (_) => NegativeVerificationResultDialog(reason: reason));
}
