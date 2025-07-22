import 'package:ehrenamtskarte/widgets/custom_alert_dialog.dart';
import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class ActivationOverwriteExistingDialog extends StatelessWidget {
  const ActivationOverwriteExistingDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    return CustomAlertDialog(
      title: t.identification.activateCurrentDeviceTitle,
      message: t.identification.activateCurrentDeviceDescription,
      actions: <Widget>[
        TextButton(
          child: Text(t.common.cancel),
          onPressed: () {
            Navigator.of(context).pop(false);
          },
        ),
        TextButton(
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
    return await showDialog<bool>(context: context, builder: (context) => ActivationOverwriteExistingDialog()) ?? false;
  }
}
