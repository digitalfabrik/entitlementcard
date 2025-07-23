import 'package:carousel_slider/carousel_controller.dart';
import 'package:ehrenamtskarte/identification/id_card/id_card_with_region_query.dart';
import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/widgets/custom_alert_dialog.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class RemoveCardConfirmationDialog extends StatefulWidget {
  final DynamicUserCode userCode;
  final CarouselSliderController carouselController;

  const RemoveCardConfirmationDialog({super.key, required this.userCode, required this.carouselController});

  static Future<void> show({
    required BuildContext context,
    required DynamicUserCode userCode,
    required CarouselSliderController carouselController,
  }) => showDialog(
    context: context,
    builder: (_) => RemoveCardConfirmationDialog(userCode: userCode, carouselController: carouselController),
  );

  @override
  RemoveCardConfirmationDialogState createState() => RemoveCardConfirmationDialogState();
}

class RemoveCardConfirmationDialogState extends State<RemoveCardConfirmationDialog> {
  void removeCard(BuildContext context) {
    final userCodeModel = Provider.of<UserCodeModel>(context, listen: false);
    // ensures that the store will be reset to empty list
    if (userCodeModel.userCodes.length == 1) {
      userCodeModel.removeCodes();
    } else {
      userCodeModel.removeCode(widget.userCode);
      widget.carouselController.previousPage(duration: Duration(milliseconds: 500), curve: Curves.linear);
    }
    Navigator.of(context).pop(true);
  }

  @override
  Widget build(BuildContext context) {
    final t = context.t;

    return CustomAlertDialog(
      icon: Icons.warning,
      title: t.identification.removeTitle,
      message: t.identification.removeDescription,
      customContent: IdCardWithRegionQuery(
        cardInfo: widget.userCode.info,
        // We trust the backend to have checked for expiration.
        isExpired: false,
        isNotYetValid: false,
      ),
      actions: [
        TextButton(child: const Text('Abbrechen'), onPressed: () => Navigator.of(context).pop(false)),
        TextButton(child: const Text('Löschen'), onPressed: () => removeCard(context)),
      ],
    );
  }
}
