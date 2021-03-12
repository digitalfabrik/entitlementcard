import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:intl/intl.dart';

import '../../graphql/graphql_api.dart';
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
                    toTableRow("Gültig bis: ", expirationDateString),
                    TableRow(children: [
                      Text("Ausgestellt von: "),
                      _buildLoadingRegionName(context, cardDetails.regionId)
                    ]),
                    toTableRow("Typ: ", cardDetails.cardType == CardType.gold
                      ? "Gold" : "Standard"),
                ],)
              ])),
    );
  }

  static Widget _buildLoadingRegionName(BuildContext context, int regionId) {
    final regionsQuery = GetRegionsByIdQuery(variables:
      GetRegionsByIdArguments(ids: IdsParamsInput(ids: [regionId])));
    return Query(
      options: QueryOptions(
          document: regionsQuery.document,
          variables: regionsQuery.getVariablesMap()),
      builder: (result, {refetch, fetchMore}) {
        if (result.hasException) {
          return Text("konnte nicht geladen werden");
        }
        if (result.isLoading) {
          return Text("wird geladen …");
        }
        final regions = GetRegionsByIdQuery().parse(result.data).regionsById;
        if (regions.isEmpty) {
          return Text("unbekannt");
        }
        final region = regions.first;
        return Text("${region.prefix} ${region.name}");
      },
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
