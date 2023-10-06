import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/identification/user_codes_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class MoreActionsDialog extends StatelessWidget {
  final VoidCallback startActivation;
  final VoidCallback startVerification;
  final VoidCallback startApplication;
  final VoidCallback removeCard;

  const MoreActionsDialog({
    super.key,
    required this.startActivation,
    required this.startVerification,
    required this.startApplication,
    required this.removeCard,
  });

  @override
  Widget build(BuildContext context) {
    final localization = buildConfig.localization.identification.moreActions;
    final userCodesModel = Provider.of<UserCodesModel>(context, listen: false);
    final String availableCards = (buildConfig.maxCardAmount - userCodesModel.userCodes!.length).toString();
    final String maxCardAmount = buildConfig.maxCardAmount.toString();
    return AlertDialog(
      contentPadding: const EdgeInsets.only(top: 12),
      title: const Text('Weitere Aktionen'),
      content: SingleChildScrollView(
        child: Column(
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
              title: Text(localization.verifyTitle),
              subtitle: Text(localization.verifyDescription),
              leading: const Icon(Icons.verified, size: 36),
              onTap: () {
                Navigator.pop(context);
                startVerification();
              },
            ),
            if (!hasReachedCardLimit(userCodesModel.userCodes!))
              ListTile(
                title: Text(localization.activateAnotherCardTitle),
                subtitle: Text(
                    '${localization.activateAnotherCardDescription}\n(Noch $availableCards von $maxCardAmount frei)'),
                leading: const Icon(Icons.add_card, size: 36),
                onTap: () {
                  Navigator.pop(context);
                  startActivation();
                },
              ),
            ListTile(
              title: Text(localization.removeCardTitle),
              subtitle: Text(localization.removeCardDescription),
              leading: const Icon(Icons.delete, size: 36),
              onTap: () {
                Navigator.pop(context);
                removeCard();
              },
            ),
          ],
        ),
      ),
      actions: [TextButton(onPressed: () => Navigator.pop(context), child: const Text('Abbrechen'))],
    );
  }
}
