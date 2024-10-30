import 'package:carousel_slider/carousel_controller.dart';
import 'package:ehrenamtskarte/identification/id_card/id_card_with_region_query.dart';
import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class RemoveCardConfirmationDialog extends StatefulWidget {
  final DynamicUserCode userCode;
  final CarouselController carouselController;

  const RemoveCardConfirmationDialog({super.key, required this.userCode, required this.carouselController});

  static Future<void> show(
          {required BuildContext context,
          required DynamicUserCode userCode,
          required CarouselController carouselController}) =>
      showDialog(
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

    final theme = Theme.of(context);
    return AlertDialog(
      titlePadding: EdgeInsets.all(4),
      contentPadding: EdgeInsets.only(left: 20, right: 20),
      actionsPadding: EdgeInsets.only(left: 20, right: 20, top: 10, bottom: 10),
      title: ListTile(
        leading: Icon(Icons.warning, color: theme.colorScheme.primaryContainer, size: 30),
        title: Text(t.identification.removeTitle, style: theme.textTheme.titleMedium),
      ),
      content: SingleChildScrollView(
        child: ListBody(
          children: <Widget>[
            Padding(
                padding: EdgeInsets.only(bottom: 20),
                child: Text(t.identification.removeDescription, style: TextStyle(fontSize: 14))),
            IdCardWithRegionQuery(
              cardInfo: widget.userCode.info,
              // We trust the backend to have checked for expiration.
              isExpired: false,
              isNotYetValid: false,
            ),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          child: const Text('Abbrechen'),
          onPressed: () => Navigator.of(context).pop(false),
          style: theme.textButtonTheme.style,
        ),
        TextButton(
          child: const Text('Löschen'),
          onPressed: () => removeCard(context),
          style: theme.textButtonTheme.style,
        ),
      ],
    );
  }
}
