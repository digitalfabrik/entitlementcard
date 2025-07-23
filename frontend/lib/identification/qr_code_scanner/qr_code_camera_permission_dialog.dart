import 'package:ehrenamtskarte/widgets/custom_alert_dialog.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class QrCodeCameraPermissionDialog extends StatelessWidget {
  const QrCodeCameraPermissionDialog();

  @override
  Widget build(BuildContext context) {
    final t = context.t;

    return CustomAlertDialog(
      title: t.identification.cameraAccessRequired,
      message: t.identification.cameraAccessRequiredSettings,
      actions: <Widget>[
        TextButton(
          child: Text(t.common.cancel),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        TextButton(
          child: Text(t.common.openSettings),
          onPressed: () {
            openAppSettings();
          },
        ),
      ],
    );
  }

  static Future<void> showPermissionDialog(BuildContext context) async {
    return showDialog<void>(context: context, builder: (context) => const QrCodeCameraPermissionDialog());
  }
}
