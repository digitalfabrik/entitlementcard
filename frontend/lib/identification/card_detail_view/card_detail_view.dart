import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/more_actions_dialog.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/verification_code_view.dart';
import 'package:ehrenamtskarte/identification/id_card/id_card.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class CardDetailView extends StatelessWidget {
  final DynamicActivationCode activationCode;
  final VoidCallback startActivation;
  final VoidCallback startVerification;
  final VoidCallback startApplication;

  const CardDetailView({
    super.key,
    required this.activationCode,
    required this.startActivation,
    required this.startVerification,
    required this.startApplication,
  });

  @override
  Widget build(BuildContext context) {
    final projectId = Configuration.of(context).projectId;
    final regionsQuery = GetRegionsByIdQuery(
      variables: GetRegionsByIdArguments(
        project: projectId,
        ids: [activationCode.info.extensions.extensionRegion.regionId],
      ),
    );

    return Query(
      options: QueryOptions(document: regionsQuery.document, variables: regionsQuery.getVariablesMap()),
      builder: (result, {refetch, fetchMore}) {
        final orientation = MediaQuery.of(context).orientation;

        final fetchedData = result.data;

        final region = result.isLoading || result.hasException || fetchedData == null
            ? null
            : regionsQuery.parse(fetchedData).regionsByIdInProject[0];

        final paddedCard = Padding(
          padding: const EdgeInsets.all(8.0),
          child: IdCard(
            cardInfo: activationCode.info,
            region: region != null ? Region(region.prefix, region.name) : null,
          ),
        );
        final richQrCode =
            RichQrCode(activationCode: activationCode, onMoreActionsPressed: () => _onMoreActionsPressed(context));

        return orientation == Orientation.landscape
            ? SafeArea(
                child: LayoutBuilder(
                  builder: (context, constraints) {
                    const qrCodeMinWidth = 280.0;
                    return Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Flexible(child: paddedCard),
                        if (constraints.maxWidth > qrCodeMinWidth * 2)
                          Flexible(child: richQrCode)
                        else
                          ConstrainedBox(
                            constraints: const BoxConstraints.tightFor(width: qrCodeMinWidth),
                            child: richQrCode,
                          )
                      ],
                    );
                  },
                ),
              )
            : SingleChildScrollView(
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Column(children: [paddedCard, const SizedBox(height: 16), richQrCode]),
                  ),
                ),
              );
      },
    );
  }

  void _onMoreActionsPressed(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => MoreActionsDialog(
        startActivation: startActivation,
        startApplication: startApplication,
        startVerification: startVerification,
      ),
    );
  }
}

class RichQrCode extends StatelessWidget {
  final VoidCallback onMoreActionsPressed;
  final DynamicActivationCode activationCode;
  final bool compact;

  const RichQrCode({super.key, required this.onMoreActionsPressed, required this.activationCode, this.compact = false});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(vertical: 4),
            constraints: const BoxConstraints(maxWidth: 300),
            child: const Text(
              "Mit diesem QR-Code können Sie sich"
              " bei Akzeptanzstellen ausweisen:",
              textAlign: TextAlign.center,
            ),
          ),
          Flexible(child: VerificationCodeView(activationCode: activationCode)),
          Container(
            alignment: Alignment.center,
            child: TextButton(
              onPressed: onMoreActionsPressed,
              child: Text(
                "Weitere Aktionen",
                style: TextStyle(color: Theme.of(context).colorScheme.secondary),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
