import 'package:flutter/material.dart';

class ActivationOverwriteExistingDialog extends StatelessWidget {
  final VoidCallback overrideExistingCard;

  const ActivationOverwriteExistingDialog({super.key, required this.overrideExistingCard});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text("Karte auf diesem Gerät aktivieren?", style: TextStyle(fontSize: 18)),
      content: SingleChildScrollView(
        child: ListBody(
          children: const <Widget>[
            Text(
              "Ihre Karte ist bereits auf einem anderen Gerät aktiviert. Wenn Sie Ihre Karte auf diesem Gerät aktivieren, wird sie auf Ihrem anderen Gerät automatisch deaktiviert.",
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
          child: const Text('Aktivieren'),
          onPressed: () {
            overrideExistingCard();
            Navigator.of(context).pop();
          },
        ),
      ],
    );
  }

  static Future<void> showActivationOverwriteExistingDialog(
      BuildContext context, VoidCallback overrideExistingCard) async {
    return showDialog<void>(
      context: context,
      builder: (context) => ActivationOverwriteExistingDialog(overrideExistingCard: overrideExistingCard),
    );
  }
}
