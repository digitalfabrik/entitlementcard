import 'package:ehrenamtskarte/identification/id_card/id_card_with_region_query.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/widgets/custom_alert_dialog.dart';
import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class PositiveVerificationResultDialog extends StatefulWidget {
  final CardInfo cardInfo;
  final bool isStaticVerificationCode;

  const PositiveVerificationResultDialog({super.key, required this.cardInfo, required this.isStaticVerificationCode});

  static Future<void> show({
    required BuildContext context,
    required CardInfo cardInfo,
    required bool isStaticVerificationCode,
  }) => showDialog(
    context: context,
    builder: (_) =>
        PositiveVerificationResultDialog(cardInfo: cardInfo, isStaticVerificationCode: isStaticVerificationCode),
  );

  @override
  PositiveVerificationResultDialogState createState() => PositiveVerificationResultDialogState();
}

class PositiveVerificationResultDialogState extends State<PositiveVerificationResultDialog> {
  bool isChecked = false;

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final theme = Theme.of(context);

    final bool isUncheckedStaticQrCode = !isChecked && widget.isStaticVerificationCode;

    return CustomAlertDialog(
      title: isUncheckedStaticQrCode ? t.identification.checkRequired : t.identification.verificationSuccessful,
      icon: isUncheckedStaticQrCode ? Icons.report : Icons.verified_user,
      iconColor: isUncheckedStaticQrCode ? theme.colorScheme.onSurface : Colors.green,
      customContent: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Flexible(
            child: IdCardWithRegionQuery(
              cardInfo: widget.cardInfo,
              // We trust the backend to have checked for expiration.
              isExpired: false,
              isNotYetValid: false,
            ),
          ),
          if (widget.isStaticVerificationCode)
            Flexible(
              child: Padding(
                padding: const EdgeInsets.only(top: 8.0),
                child: CheckboxListTile(
                  title: Text(t.identification.comparedWithID, style: theme.textTheme.bodySmall),
                  controlAffinity: ListTileControlAffinity.leading,
                  contentPadding: EdgeInsets.zero,
                  visualDensity: VisualDensity.compact,
                  value: isChecked,
                  onChanged: (bool? value) {
                    setState(() {
                      isChecked = value ?? false;
                    });
                  },
                ),
              ),
            ),
        ],
      ),
    );
  }
}
