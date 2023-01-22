import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.dart';
import 'package:ehrenamtskarte/identification/id_card/id_card.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/dialogs/verification_result_dialog.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class PositiveVerificationResultDialog extends StatelessWidget {
  final CardInfo cardInfo;

  const PositiveVerificationResultDialog({super.key, required this.cardInfo});

  @override
  Widget build(BuildContext context) {
    final localization = buildConfig.localization.ausweisen.verificationCodeScanner;
    final projectId = Configuration.of(context).projectId;
    final regionsQuery = GetRegionsByIdQuery(
      variables: GetRegionsByIdArguments(
        project: projectId,
        ids: [cardInfo.extensions.extensionRegion.regionId],
      ),
    );

    return Query(
      options: QueryOptions(document: regionsQuery.document, variables: regionsQuery.getVariablesMap()),
      builder: (result, {refetch, fetchMore}) {
        final data = result.data;
        final region = result.isConcrete && data != null ? regionsQuery.parse(data).regionsByIdInProject[0] : null;
        return VerificationResultDialog(
          title: localization.positiveVerificationDialogTitle,
          icon: Icons.verified_user,
          iconColor: Colors.green,
          child: IdCard(
            cardInfo: cardInfo,
            region: region != null ? Region(region.prefix, region.name) : null,
          ),
        );
      },
    );
  }

  static Future<void> show(BuildContext context, CardInfo cardInfo) =>
      showDialog(context: context, builder: (_) => PositiveVerificationResultDialog(cardInfo: cardInfo));
}
