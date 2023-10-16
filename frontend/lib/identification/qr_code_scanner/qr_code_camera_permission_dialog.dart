import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

import '../../util/i18n.dart';

class QrCodeCameraPermissionDialog extends StatelessWidget {
  const QrCodeCameraPermissionDialog();

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(t(context).identification_cameraAccessRequired, style: TextStyle(fontSize: 18)),
      content: SingleChildScrollView(
        child: ListBody(
          children: <Widget>[
            Text(t(context).identification_cameraAccessRequired),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          child: Text(t(context).common_cancel),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        TextButton(
          child: Text(t(context).common_openSettings),
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
