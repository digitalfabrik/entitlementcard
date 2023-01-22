import 'package:ehrenamtskarte/build_config/build_config.dart';
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
    final localization = buildConfig.localization.identification.moreActions;
    return AlertDialog(
      contentPadding: const EdgeInsets.only(top: 12),
      title: const Text("Weitere Aktionen"),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            title: Text(localization.applyForAnotherCardTitle),
            subtitle: Text(localization.applyForAnotherCardDescription),
            leading: const Icon(Icons.assignment, size: 36),
            onTap: () {
              Navigator.pop(context);
              startApplication();
            },
          ),
          ListTile(
            title: Text(localization.activateAnotherCardTitle),
            subtitle: Text(localization.activateAnotherCardDescription),
            leading: const Icon(Icons.add_card, size: 36),
            onTap: () {
              Navigator.pop(context);
              startActivation();
            },
          ),
          ListTile(
            title: Text(localization.verifyTitle),
            subtitle: Text(localization.verifyDescription),
            leading: const Icon(Icons.verified, size: 36),
            onTap: () {
              Navigator.pop(context);
              startVerification();
            },
          ),
        ],
      ),
      actions: [TextButton(onPressed: () => Navigator.pop(context), child: const Text("Abbrechen"))],
    );
  }
}
