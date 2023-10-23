import 'package:flutter/material.dart';

class ActivationExistingCardDialog extends StatelessWidget {
  const ActivationExistingCardDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Diese Karte existiert bereits', style: TextStyle(fontSize: 18)),
      content: SingleChildScrollView(
        child: ListBody(
          children: const <Widget>[
            Text(
              'Diese Karte ist bereits auf ihrem Gerät aktiv.',
            ),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          child: const Text('Ok'),
          onPressed: () {
            Navigator.of(context).pop(false);
          },
        )
      ],
    );
  }

  /// Returns true, if the user wants to activate an existing card
  static Future<bool> showExistingCardDialog(BuildContext context) async {
    return await showDialog<bool>(
          context: context,
          builder: (context) => ActivationExistingCardDialog(),
        ) ??
        false;
  }
}
