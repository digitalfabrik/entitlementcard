import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class MoreActionsDialog extends StatelessWidget {
  final VoidCallback startActivation;
  final VoidCallback startVerification;
  final VoidCallback startApplication;
  final VoidCallback openRemoveCardDialog;

  const MoreActionsDialog({
    super.key,
    required this.startActivation,
    required this.startVerification,
    required this.startApplication,
    required this.openRemoveCardDialog,
  });

  @override
  Widget build(BuildContext context) {
    final localization = buildConfig.localization.identification.moreActions;
    final userCodeModel = Provider.of<UserCodeModel>(context, listen: false);
    final String cardsInUse = userCodeModel.userCodes.length.toString();
    final String maxCardAmount = buildConfig.maxCardAmount.toString();
    final bool cardLimitIsReached = hasReachedCardLimit(userCodeModel.userCodes);

    return AlertDialog(
      contentPadding: const EdgeInsets.only(top: 12),
      title: Text(t.common.moreActions),
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
            ListTile(
              enabled: !cardLimitIsReached,
              title: Text('${localization.activateAnotherCardTitle} ($cardsInUse/$maxCardAmount)',
                  style: TextStyle(color: Theme.of(context).colorScheme.onBackground)),
              subtitle: Text(cardLimitIsReached
                  ? localization.activationLimitDescription
                  : localization.activateAnotherCardDescription),
              leading: Icon(Icons.add_card, size: 36),
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
                openRemoveCardDialog();
              },
            ),
          ],
        ),
      ),
      actions: [TextButton(onPressed: () => Navigator.pop(context), child: Text(t.common.cancel))],
    );
  }
}
