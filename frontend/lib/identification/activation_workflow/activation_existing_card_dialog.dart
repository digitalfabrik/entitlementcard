import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

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
          child: Text(context.t.common.ok),
          onPressed: () {
            Navigator.of(context).pop();
          },
        )
      ],
    );
  }

  /// Returns true, if the user wants to activate an existing card
  static Future<void> showExistingCardDialog(BuildContext context) async {
    return await showDialog(
      context: context,
      builder: (context) => ActivationExistingCardDialog(),
    );
  }
}
