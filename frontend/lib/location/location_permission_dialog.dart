import 'package:flutter/material.dart';

class LocationPermissionDialog extends StatelessWidget {

  const LocationPermissionDialog({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Standortberechtigung freigeben"),
      content: Text("Geben Sie in den App-Einstellungen die"
          " Standortberechtigung frei."),
      actions: [
        TextButton(
            child: Text("Abbrechen"),
            onPressed: () => Navigator.of(context).pop(false)),
        TextButton(
            child: Text("Einstellungen öffnen"),
            onPressed: () => Navigator.of(context).pop(true))
      ],
    );
  }
}
