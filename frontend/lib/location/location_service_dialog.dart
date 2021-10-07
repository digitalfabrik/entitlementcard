import 'package:flutter/material.dart';

class LocationServiceDialog extends StatelessWidget {
  const LocationServiceDialog({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text("Standortermittlung aktivieren"),
      content:
          const Text("Aktivieren Sie die Standortermittlung in den Einstellungen."),
      actions: [
        TextButton(
            child: const Text("Abbrechen"),
            onPressed: () => Navigator.of(context).pop(false)),
        TextButton(
            child: const Text("Einstellungen öffnen"),
            onPressed: () => Navigator.of(context).pop(true))
      ],
    );
  }
}
