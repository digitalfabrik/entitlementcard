import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class ActivationExistingCardDialog extends StatelessWidget {
  const ActivationExistingCardDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return AlertDialog(
      title: Text('Diese Karte existiert bereits', style: theme.textTheme.titleMedium),
      content: SingleChildScrollView(
        child: ListBody(
          children: <Widget>[
            Text('Diese Karte ist bereits auf ihrem Gerät aktiv.', style: theme.textTheme.bodyLarge),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          style: theme.textButtonTheme.style,
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
