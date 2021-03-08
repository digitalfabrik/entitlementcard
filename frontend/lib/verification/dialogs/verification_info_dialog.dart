import 'package:flutter/material.dart';

class VerificationInfoDialog extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("So prüfen Sie die Echtheit einer Ehrenamtskarte"),
      content: SingleChildScrollView(
        child: ListBody(children: [
          Text("Scannen Sie den QR-Code, der auf der „Ausweisen“-Seite Ihres "
              "Gegenübers angezeigt wird. "
              "Daraufhin wird durch eine Server-Anfrage geprüft, ob die "
              "gescannte Ehrenamtskarte gültig ist. "
              "Sie benötigen eine Internetverbindung."),
        ]),
      ),
      actions: [
        // TODO add "do not show again" button
        TextButton(
          child: Text("OK"),
          onPressed: () => Navigator.of(context).pop(true),
        )
      ],
    );
  }

  /// Shows a [VerificationInfoDialog].
  /// Returns a future that resolves to true if the user accepted the info,
  /// and to null if the dialog was dismissed.
  static Future<bool> show(BuildContext context) {
    return showDialog<bool>(
        context: context,
        builder: (_) => VerificationInfoDialog(),
    );
  }
}
