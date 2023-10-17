import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

import '../../util/l10n.dart';

class QrCodeCameraPermissionDialog extends StatelessWidget {
  const QrCodeCameraPermissionDialog();

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(context.l10n.identification_cameraAccessRequired, style: TextStyle(fontSize: 18)),
      content: SingleChildScrollView(
        child: ListBody(
          children: <Widget>[
            Text(context.l10n.identification_cameraAccessRequiredSettings),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          child: Text(context.l10n.common_cancel),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        TextButton(
          child: Text(context.l10n.common_openSettings),
          onPressed: () {
            openAppSettings();
          },
        ),
      ],
    );
  }

  static Future<void> showPermissionDialog(BuildContext context) async {
    return showDialog<void>(
      context: context,
      builder: (context) => const QrCodeCameraPermissionDialog(),
    );
  }
}
