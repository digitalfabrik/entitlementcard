import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

class MoreActionsDialog extends StatelessWidget {
  final VoidCallback startActivateEak;
  final VoidCallback startVerification;
  final VoidCallback startEakApplication;

  const MoreActionsDialog(
      {Key key,
      this.startActivateEak,
      this.startVerification,
      this.startEakApplication})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SimpleDialog(
      contentPadding: const EdgeInsets.only(top: 8),
      title: const Text("Weitere Aktionen"),
      children: [
        ListTile(
          title: const Text("Anderen Aktivierungscode einscannen"),
          subtitle: const Text(
              "Dadurch wird die bestehende Karte vom Gerät gelöscht."),
          leading: const Icon(Icons.qr_code_scanner, size: 36),
          onTap: () {
            Navigator.pop(context);
            startActivateEak();
          },
        ),
        ListTile(
          title: const Text("Weitere Ehrenamtskarte beantragen"),
          subtitle: const Text("Ihre hinterlegte Karte bleibt erhalten."),
          leading: const Icon(Icons.attach_file, size: 36),
          onTap: () {
            Navigator.pop(context);
            startEakApplication();
          },
        ),
        ListTile(
            title: const Text("Eine digitale Ehrenamtskarte prüfen"),
            subtitle: const Text(
                "Verifizieren Sie die Echtheit einer Ehrenamtskarte."),
            leading: const Icon(Icons.check_circle_outline, size: 36),
            onTap: () {
              Navigator.pop(context);
              startVerification();
            }),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: Row(mainAxisAlignment: MainAxisAlignment.end, children: [
            TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text("Abbrechen"))
          ]),
        )
      ],
    );
  }
}
