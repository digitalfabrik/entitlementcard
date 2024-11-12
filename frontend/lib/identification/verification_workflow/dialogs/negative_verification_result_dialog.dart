import 'package:ehrenamtskarte/identification/info_dialog.dart';
import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class NegativeVerificationResultDialog extends StatelessWidget {
  final String reason;

  const NegativeVerificationResultDialog({super.key, required this.reason});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    return InfoDialog(
      title: t.identification.notVerified,
      icon: Icons.error,
      iconColor: Colors.red,
      child: Text(reason, style: Theme.of(context).textTheme.bodyLarge),
    );
  }

  static Future<void> show(BuildContext context, String reason) =>
      showDialog(context: context, builder: (_) => NegativeVerificationResultDialog(reason: reason));
}
