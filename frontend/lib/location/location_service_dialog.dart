import 'package:flutter/material.dart';

class LocationServiceDialog extends StatelessWidget {
  const LocationServiceDialog({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Standortermittlung aktivieren"),
      content:
          Text("Aktivieren Sie die Standortermittlung in den Einstellungen."),
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
