import 'package:flutter/material.dart';

class MoreActionsDialog extends StatelessWidget {
  final VoidCallback startActivation;
  final VoidCallback startVerification;
  final VoidCallback startApplication;

  const MoreActionsDialog({
    super.key,
    required this.startActivation,
    required this.startVerification,
    required this.startApplication,
  });

  @override
  Widget build(BuildContext context) {
    return SimpleDialog(
      contentPadding: const EdgeInsets.only(top: 8),
      title: const Text("Weitere Aktionen"),
      children: [
        ListTile(
          title: const Text("Weitere Ehrenamtskarte beantragen"),
          subtitle: const Text("Ihre hinterlegte Karte bleibt erhalten."),
          leading: const Icon(Icons.assignment, size: 36),
          onTap: () {
            Navigator.pop(context);
            startApplication();
          },
        ),
        ListTile(
          title: const Text("Anderen Aktivierungscode einscannen"),
          subtitle: const Text("Dadurch wird die hinterlegte Karte vom Gerät gelöscht."),
          leading: const Icon(Icons.add_card, size: 36),
          onTap: () {
            Navigator.pop(context);
            startActivation();
          },
        ),
        ListTile(
          title: const Text("Eine digitale Ehrenamtskarte prüfen"),
          subtitle: const Text("Verifizieren Sie die Echtheit einer Ehrenamtskarte."),
          leading: const Icon(Icons.verified, size: 36),
          onTap: () {
            Navigator.pop(context);
            startVerification();
          },
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [TextButton(onPressed: () => Navigator.pop(context), child: const Text("Abbrechen"))],
          ),
        )
      ],
    );
  }
}
