import 'package:flutter/material.dart';

import '../../util/l10n.dart';

class QrParsingErrorDialog extends StatelessWidget {
  final String message;

  const QrParsingErrorDialog({super.key, required this.message});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(context.l10n.identification_scanningFailed),
      content: SingleChildScrollView(
        child: ListBody(
          children: <Widget>[
            Text(message),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          child: Text(context.l10n.common_ok),
          onPressed: () {
            Navigator.of(context).pop();
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
