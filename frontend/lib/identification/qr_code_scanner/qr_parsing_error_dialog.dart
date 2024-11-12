import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class QrParsingErrorDialog extends StatelessWidget {
  final String message;

  const QrParsingErrorDialog({super.key, required this.message});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final t = context.t;
    return AlertDialog(
      title: Text(t.identification.scanningFailed),
      content: SingleChildScrollView(
        child: ListBody(
          children: <Widget>[
            Text(message, style: theme.textTheme.bodyMedium),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          child: Text(t.common.ok),
          onPressed: () {
            Navigator.of(context, rootNavigator: true).pop();
          },
        ),
      ],
    );
  }

  static Future<void> showErrorDialog(BuildContext context, String message) async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (context) => QrParsingErrorDialog(message: message),
    );
  }
}
