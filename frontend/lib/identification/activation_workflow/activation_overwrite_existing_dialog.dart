import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class ActivationOverwriteExistingDialog extends StatelessWidget {
  const ActivationOverwriteExistingDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final t = context.t;
    return AlertDialog(
      title: Text(t.identification.activateCurrentDeviceTitle, style: theme.textTheme.titleMedium),
      content: SingleChildScrollView(
        child: ListBody(
          children: <Widget>[
            Text(t.identification.activateCurrentDeviceDescription, style: theme.textTheme.bodyLarge),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          style: theme.textButtonTheme.style,
          child: Text(t.common.cancel),
          onPressed: () {
            Navigator.of(context).pop(false);
          },
        ),
        TextButton(
          style: theme.textButtonTheme.style,
          child: Text(t.identification.activate),
          onPressed: () {
            Navigator.of(context).pop(true);
          },
        ),
      ],
    );
  }

  /// Returns true, if the user wants to override the existing device
  static Future<bool> showActivationOverwriteExistingDialog(BuildContext context) async {
    return await showDialog<bool>(
          context: context,
          builder: (context) => ActivationOverwriteExistingDialog(),
        ) ??
        false;
  }
}
