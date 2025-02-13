import 'package:ehrenamtskarte/widgets/custom_alert_dialog.dart';
import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class ActivationErrorDialog extends StatelessWidget {
  final String message;

  const ActivationErrorDialog({super.key, required this.message});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    return CustomAlertDialog(title: t.identification.activationError, message: message);
  }

  static Future<void> showErrorDialog(BuildContext context, String message) async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (context) => ActivationErrorDialog(message: message),
    );
  }
}
