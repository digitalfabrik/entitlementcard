import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

class MoreActionsDialog extends StatelessWidget {
  final VoidCallback startActivateEak;
  final VoidCallback startVerification;

  const MoreActionsDialog(
      {Key key, this.startActivateEak, this.startVerification})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SimpleDialog(
      contentPadding: EdgeInsets.only(top: 8),
      title: Text("Weitere Aktionen"),
      children: [
        ListTile(
          title: Text("Anderen Aktivierungscode einscannen"),
          subtitle:
              Text("Dadurch wird die bestehende Karte vom Gerät gelöscht."),
          leading: Icon(Icons.qr_code_scanner, size: 36),
          onTap: () {
            Navigator.pop(context);
            startActivateEak();
          },
        ),
        ListTile(
            title: Text("Eine digitale Ehrenamtskarte prüfen"),
            subtitle:
                Text("Verifizieren Sie die Echtheit einer Ehrenamtskarte."),
            leading: Icon(Icons.check_circle_outline, size: 36),
            onTap: () {
              Navigator.pop(context);
              startVerification();
            }),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: Row(mainAxisAlignment: MainAxisAlignment.end, children: [
            TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text("Abbrechen"))
          ]),
        )
      ],
    );
  }
}
