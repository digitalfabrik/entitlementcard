import 'package:flutter/material.dart';

class LocationPermissionDialog extends StatelessWidget {

  const LocationPermissionDialog({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text("Standortberechtigung freigeben"),
      content: const Text("Geben Sie in den App-Einstellungen die"
          " Standortberechtigung frei."),
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
