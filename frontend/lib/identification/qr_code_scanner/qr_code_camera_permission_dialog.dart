import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

class QrCodeCameraPermissionDialog extends StatelessWidget {
  const QrCodeCameraPermissionDialog();

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Zugriff auf Kamera erforderlich', style: TextStyle(fontSize: 18)),
      content: SingleChildScrollView(
        child: ListBody(
          children: const <Widget>[
            Text(
              'Um einen QR-Code einzuscannen, benötigt die App Zugriff auf die Kamera.\nIn den Einstellungen können Sie der App den Zugriff auf die Kamera erlauben.',
            ),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          child: const Text('Abbrechen'),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        TextButton(
          child: const Text('Einstellungen öffnen'),
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
