import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.dart';
import 'package:ehrenamtskarte/identification/base_card_details.dart';
import 'package:ehrenamtskarte/identification/card/card_content.dart';
import 'package:ehrenamtskarte/identification/card/id_card.dart';
import 'package:ehrenamtskarte/verification/dialogs/verification_result_dialog.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class PositiveVerificationResultDialog extends StatelessWidget {
  final BaseCardDetails cardDetails;

  const PositiveVerificationResultDialog({super.key, required this.cardDetails});

  @override
  Widget build(BuildContext context) {
    final projectId = Configuration.of(context).projectId;
    final regionsQuery =
        GetRegionsByIdQuery(variables: GetRegionsByIdArguments(project: projectId, ids: [cardDetails.regionId]));

    return Query(
      options: QueryOptions(document: regionsQuery.document, variables: regionsQuery.getVariablesMap()),
      builder: (result, {refetch, fetchMore}) {
        final data = result.data;
        final region = result.isConcrete && data != null ? regionsQuery.parse(data).regionsByIdInProject[0] : null;
        return VerificationResultDialog(
          title: "Karte ist gültig",
          icon: Icons.verified_user,
          iconColor: Colors.green,
          child: IdCard(
            child: CardContent(
              cardDetails: cardDetails,
              region: region != null ? Region(region.prefix, region.name) : null,
            ),
          ),
        );
      },
    );
  }

  static Future<void> show(BuildContext context, BaseCardDetails cardDetails) =>
      showDialog(context: context, builder: (_) => PositiveVerificationResultDialog(cardDetails: cardDetails));
}
