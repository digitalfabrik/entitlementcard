import 'package:flutter/material.dart';

class ActivationOverwriteExistingDialog extends StatelessWidget {
  const ActivationOverwriteExistingDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Karte auf diesem Gerät aktivieren?', style: TextStyle(fontSize: 18)),
      content: SingleChildScrollView(
        child: ListBody(
          children: const <Widget>[
            Text(
              'Ihre Karte ist bereits auf einem anderen Gerät aktiviert. Wenn Sie Ihre Karte auf diesem Gerät aktivieren, wird sie auf Ihrem anderen Gerät automatisch deaktiviert.',
            ),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          child: const Text('Abbrechen'),
          onPressed: () {
            Navigator.of(context).pop(false);
          },
        ),
        TextButton(
          child: const Text('Aktivieren'),
          onPressed: () {
            Navigator.of(context).pop(true);
          },
        ),
      ],
    );
  }

  /// Returns true, if the user wants to override the existing device
  static Future<bool> showActivationOverwriteExistingDialog(BuildContext context) async {
    return await showDialog<bool>(
          context: context,
          builder: (context) => ActivationOverwriteExistingDialog(),
        ) ??
        false;
  }
}
