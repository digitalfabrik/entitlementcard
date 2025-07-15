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
    final userCodeModel = Provider.of<UserCodeModel>(context, listen: false);
    final String cardsInUse = userCodeModel.userCodes.length.toString();
    final String maxCardAmount = buildConfig.maxCardAmount.toString();
    final bool cardLimitIsReached = hasReachedCardLimit(userCodeModel.userCodes);
    final t = context.t;
    final theme = Theme.of(context);

    return AlertDialog(
      contentPadding: const EdgeInsets.only(top: 12),
      title: Text(t.common.moreActions),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              title: Text(t.identification.moreActionsApplyTitle, style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text(t.identification.moreActionsApplyDescription),
              leading: const Icon(Icons.assignment, size: 36),
              onTap: () {
                Navigator.pop(context);
                startApplication();
              },
            ),
            ListTile(
              title: Text(t.identification.moreActionsVerifyTitle, style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text(t.identification.moreActionsVerifyDescription),
              leading: const Icon(Icons.verified, size: 36),
              onTap: () {
                Navigator.pop(context);
                startVerification();
              },
            ),
            ListTile(
              enabled: !cardLimitIsReached,
              title: Text(
                '${t.identification.moreActionsActivateTitle} ($cardsInUse/$maxCardAmount)',
                style: TextStyle(color: cardLimitIsReached ? theme.hintColor : null, fontWeight: FontWeight.bold),
              ),
              subtitle: Text(
                cardLimitIsReached
                    ? t.identification.moreActionsActivateLimitDescription
                    : t.identification.moreActionsActivateDescription,
                style: TextStyle(color: cardLimitIsReached ? theme.hintColor : null),
              ),
              leading: Icon(Icons.add_card, size: 36),
              onTap: () {
                Navigator.pop(context);
                startActivation();
              },
            ),
            ListTile(
              title: Text(t.identification.moreActionsRemoveTitle, style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text(t.identification.moreActionsRemoveDescription),
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
