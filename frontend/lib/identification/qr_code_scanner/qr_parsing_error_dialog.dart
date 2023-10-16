import 'package:flutter/material.dart';

import '../../util/i18n.dart';

class QrParsingErrorDialog extends StatelessWidget {
  final String message;

  const QrParsingErrorDialog({super.key, required this.message});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(t(context).identification_scanningFailed),
      content: SingleChildScrollView(
        child: ListBody(
          children: <Widget>[
            Text(message),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          child: Text(t(context).common_ok),
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
