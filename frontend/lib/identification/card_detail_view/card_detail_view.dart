import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import '../../graphql/graphql_api.dart';
import '../card/eak_card.dart';
import '../card/id_card.dart';
import '../card_details.dart';
import 'more_actions_dialog.dart';
import 'verification_qr_code_view.dart';

class CardDetailView extends StatelessWidget {
  final CardDetails cardDetails;
  final VoidCallback startActivateEak;
  final VoidCallback startVerification;
  final VoidCallback startEakApplication;

  const CardDetailView(
      {Key? key,
      required this.cardDetails,
      required this.startActivateEak,
      required this.startVerification,
      required this.startEakApplication})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    final regionsQuery = GetRegionsByIdQuery(
        variables: GetRegionsByIdArguments(
            ids: IdsParamsInput(ids: [cardDetails.regionId])));

    return Query(
        options: QueryOptions(
            document: regionsQuery.document,
            variables: regionsQuery.getVariablesMap()),
        builder: (result, {refetch, fetchMore}) {
          var orientation = MediaQuery.of(context).orientation;

          final fetchedData = result.data;

          var region =
              result.isLoading || result.hasException || fetchedData == null
                  ? null
                  : regionsQuery.parse(fetchedData).regionsById[0];

          var eakCard = Padding(
              padding: const EdgeInsets.all(8.0),
              child: IdCard(
                  child: EakCard(
                      cardDetails: cardDetails,
                      region: region != null
                          ? Region(region.prefix, region.name)
                          : null)));
          var richQrCode = RichQrCode(
              cardDetails: cardDetails,
              onMoreActionsPressed: () => _onMoreActionsPressed(context));

          return orientation == Orientation.landscape
              ? SafeArea(child: LayoutBuilder(builder: (context, constraints) {
                  const qrCodeMinWidth = 280.0;
                  return Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Flexible(child: eakCard),
                        constraints.maxWidth > qrCodeMinWidth * 2
                            ? Flexible(child: richQrCode)
                            : ConstrainedBox(
                                constraints: const BoxConstraints.tightFor(
                                    width: qrCodeMinWidth),
                                child: richQrCode)
                      ]);
                }))
              : SingleChildScrollView(
                  child: SafeArea(
                      child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(children: [
                    eakCard,
                    const SizedBox(height: 16),
                    richQrCode
                  ]),
                )));
        });
  }

  void _onMoreActionsPressed(BuildContext context) {
    showDialog(
        context: context,
        builder: (context) => MoreActionsDialog(
            startActivateEak: startActivateEak,
            startEakApplication: startEakApplication,
            startVerification: startVerification));
  }
}

class RichQrCode extends StatelessWidget {
  final VoidCallback onMoreActionsPressed;
  final CardDetails cardDetails;
  final bool compact;

  const RichQrCode(
      {Key? key,
      required this.onMoreActionsPressed,
      required this.cardDetails,
      this.compact = false})
      : super(key: key);

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
                )),
            Flexible(child: VerificationQrCodeView(cardDetails: cardDetails)),
            Container(
                alignment: Alignment.center,
                child: TextButton(
                    child: Text(
                      "Weitere Aktionen",
                      style: TextStyle(
                          color: Theme.of(context).colorScheme.secondary),
                    ),
                    onPressed: onMoreActionsPressed)),
          ],
        ));
  }
}
