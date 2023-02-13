import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.dart';
import 'package:ehrenamtskarte/identification/id_card/id_card.dart';
import 'package:ehrenamtskarte/identification/info_dialog.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class PositiveVerificationResultDialog extends StatefulWidget {
  final CardInfo cardInfo;
  final bool hasStaticVerificationCode;

  const PositiveVerificationResultDialog({
    super.key,
    required this.cardInfo,
    required this.hasStaticVerificationCode,
  });

  static Future<void> show({
    required BuildContext context,
    required CardInfo cardInfo,
    required bool hasStaticVerificationCode,
  }) =>
      showDialog(
        context: context,
        builder: (_) => PositiveVerificationResultDialog(
          cardInfo: cardInfo,
          hasStaticVerificationCode: hasStaticVerificationCode,
        ),
      );

  @override
  PositiveVerificationResultDialogState createState() => PositiveVerificationResultDialogState();
}

class PositiveVerificationResultDialogState extends State<PositiveVerificationResultDialog> {
  bool isChecked = false;

  @override
  Widget build(BuildContext context) {
    final localization = buildConfig.localization.identification.verificationCodeScanner;
    final projectId = Configuration.of(context).projectId;
    final regionsQuery = GetRegionsByIdQuery(
      variables: GetRegionsByIdArguments(
        project: projectId,
        ids: [widget.cardInfo.extensions.extensionRegion.regionId],
      ),
    );

    return Query(
      options: QueryOptions(document: regionsQuery.document, variables: regionsQuery.getVariablesMap()),
      builder: (result, {refetch, fetchMore}) {
        final data = result.data;
        final region = result.isConcrete && data != null ? regionsQuery.parse(data).regionsByIdInProject[0] : null;
        final bool isUncheckedStaticQrCode = !isChecked && widget.hasStaticVerificationCode;
        return InfoDialog(
          title: isUncheckedStaticQrCode ? "Prüfung notwendig" : localization.positiveVerificationDialogTitle,
          icon: isUncheckedStaticQrCode ? Icons.info : Icons.verified_user,
          iconColor: isUncheckedStaticQrCode ? Colors.yellow : Colors.green,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Flexible(
                child: IdCard(
                  cardInfo: widget.cardInfo,
                  region: region != null ? Region(region.prefix, region.name) : null,
                ),
              ),
              if (widget.hasStaticVerificationCode)
                Flexible(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 16.0),
                    child: CheckboxListTile(
                      title: const Text('Ich habe die Daten mit einem amtlichen Lichtbildausweis abgeglichen.'),
                      checkColor: Theme.of(context).primaryColor,
                      controlAffinity: ListTileControlAffinity.leading,
                      value: isChecked,
                      onChanged: (bool? value) {
                        setState(() {
                          isChecked = value!;
                        });
                      },
                    ),
                  ),
                )
              else
                Container()
            ],
          ),
        );
      },
    );
  }
}
