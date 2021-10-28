import 'package:flutter/material.dart';

class QrParsingErrorDialog extends StatelessWidget {
  final String message;

  const QrParsingErrorDialog({Key key, required this.message}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Fehler beim Lesen des Codes'),
      content: SingleChildScrollView(
        child: ListBody(
          children: <Widget>[
            Text(message),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          child: const Text('Ok'),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
      ],
    );
  }

  static Future<void> showErrorDialog(BuildContext context, String message)
  async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (context) => QrParsingErrorDialog(message: message),
    );
  }
}
