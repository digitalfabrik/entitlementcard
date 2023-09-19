import 'package:flutter/material.dart';

class LocationServiceDialog extends StatelessWidget {
  const LocationServiceDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Standortermittlung aktivieren'),
      content: const Text('Aktivieren Sie die Standortermittlung in den Einstellungen.'),
      actions: [
        TextButton(child: const Text('Abbrechen'), onPressed: () => Navigator.of(context).pop(false)),
        TextButton(child: const Text('Einstellungen öffnen'), onPressed: () => Navigator.of(context).pop(true))
      ],
    );
  }
}

class RationaleDialog extends StatelessWidget {
  final String _rationale;

  const RationaleDialog({super.key, required String rationale}) : _rationale = rationale;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Standortberechtigung'),
      content: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[Text(_rationale), const Text('Soll nocheinmal nach der Berechtigung gefragt werden?')],
      ),
      actions: [
        TextButton(child: const Text('Berechtigung erteilen'), onPressed: () => Navigator.of(context).pop(true)),
        TextButton(child: const Text('Abbrechen'), onPressed: () => Navigator.of(context).pop(false))
      ],
    );
  }
}
