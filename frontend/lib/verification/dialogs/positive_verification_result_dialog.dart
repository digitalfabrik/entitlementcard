import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:intl/intl.dart';

import '../../graphql/graphql_api.dart';
import '../../identification/base_card_details.dart';
import '../../util/padded_table.dart';
import 'verification_result_dialog.dart';

class PositiveVerificationResultDialog extends StatelessWidget {
  final BaseCardDetails cardDetails;

  PositiveVerificationResultDialog({Key key, this.cardDetails}) :
        super(key: key);

  @override
  Widget build(BuildContext context) {
    var expirationDateString;
    if (cardDetails.expirationDate == null) {
      expirationDateString = "unbegrenzt";
    } else {
      final dateFormat = DateFormat('dd.MM.yyyy');
      expirationDateString = dateFormat.format(cardDetails.expirationDate);
    }
    TableRow toTableRow(String key, String value) =>
        TableRow(children: [Text(key), Spacer(), Text(value)]);

    return VerificationResultDialog(
        title: "Validiert",
        icon: Icons.verified_user,
        iconColor: Colors.green,
        child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              PaddedTable(
                horizontalPadding: 8,
                verticalPadding: 8,
                children: [
                  toTableRow("Name: ", cardDetails.fullName),
                  toTableRow("Gültig bis: ", expirationDateString),
                  TableRow(children: [
                    Text("Ausgestellt von: "),
                    Spacer(),
                    _buildLoadingRegionName(context, cardDetails.regionId)
                  ]),
                  toTableRow("Typ: ", cardDetails.cardType == CardType.gold
                      ? "Gold" : "Standard"),
                ],)
            ]));
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

  static Future<void> show(BuildContext context,
      BaseCardDetails cardDetails) =>
      showDialog(context: context, builder: (_) =>
        PositiveVerificationResultDialog(cardDetails: cardDetails));
}
