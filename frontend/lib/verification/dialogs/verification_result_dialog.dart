import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../identification/base_card_details.dart';

class VerificationResultDialog extends StatelessWidget {
  final Widget child;
  final String title;
  final IconData icon;
  final Color iconColor;

  VerificationResultDialog({
    Key key,
    this.child,
    this.title,
    this.icon,
    this.iconColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final titleText = title != null
        ? Text(title, style: theme.textTheme.headline5)
        : null;
    return AlertDialog(
        title: (icon != null)
          ? ListTile(
                leading: Icon(
                    icon,
                    color: iconColor ?? theme.colorScheme.primaryVariant,
                    size: 30
                ),
                title: titleText,
              )
          : titleText,
        content: child,
        actions: [
          TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text("OK"))
        ],
    );
  }

  static Future<void> showSuccess(BuildContext context,
      BaseCardDetails cardDetails) {
    var expirationDateString;
    if (cardDetails.expirationDate == null) {
      expirationDateString = "unbegrenzt";
    } else {
      final dateFormat = DateFormat('dd.MM.yyyy');
      expirationDateString = dateFormat.format(cardDetails.expirationDate);
    }
    TableRow toTableRow(String key, String value) =>
        TableRow(children: [Text(key), Text(value)]);
    return showDialog(context: context, builder: (_) =>
        VerificationResultDialog(
          title: "Validiert",
          icon: Icons.verified_user,
          iconColor: Colors.green,
          child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Table(
                  children: [
                    toTableRow("Name: ", cardDetails.fullName),
                    toTableRow("Ablaufdatum: ", expirationDateString),
                    toTableRow("Landkreis: ", cardDetails.regionId.toString()),
                    toTableRow("Typ: ", cardDetails.cardType == CardType.gold
                      ? "Gold" : "Standard"),
                ],)
              ])),
    );
  }

  static Future<void> showFailure(BuildContext context, String reason) =>
      showDialog(context: context, builder: (_) =>
        VerificationResultDialog(
            title: "Nicht validiert",
            icon: Icons.error,
            iconColor: Colors.red,
            child: Text(reason)
        ));
}
