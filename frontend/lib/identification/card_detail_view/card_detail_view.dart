import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/more_actions_dialog.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/verification_code_view.dart';
import 'package:ehrenamtskarte/identification/id_card/id_card.dart';
import 'package:ehrenamtskarte/identification/util/card_info_utils.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class CardDetailView extends StatelessWidget {
  final DynamicUserCode userCode;
  final VoidCallback startActivation;
  final VoidCallback startVerification;
  final VoidCallback startApplication;

  const CardDetailView({
    super.key,
    required this.userCode,
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
        ids: [userCode.info.extensions.extensionRegion.regionId],
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
          padding: const EdgeInsets.all(8),
          child: IdCard(
              cardInfo: userCode.info,
              region: region != null ? Region(region.prefix, region.name) : null,
              isExpired: isCardExpired(userCode.info)),
        );
        final richQrCode = RichQrCode(
            userCode: userCode,
            onMoreActionsPressed: () => _onMoreActionsPressed(context),
            isExpired: isCardExpired(userCode.info));

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
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
  final DynamicUserCode userCode;
  final bool compact;
  final bool isExpired;

  const RichQrCode(
      {super.key,
      required this.onMoreActionsPressed,
      required this.userCode,
      this.compact = false,
      required this.isExpired});

  @override
  Widget build(BuildContext context) {
    final wasCardVerifiedLately = cardWasVerifiedLately(userCode.cardVerification);
    final isCardInvalid = !userCode.cardVerification.cardValid;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.only(bottom: 4),
            constraints: const BoxConstraints(maxWidth: 300),
            child: Text(
              getCardInfoText(wasCardVerifiedLately, isCardInvalid, context),
              textAlign: TextAlign.center,
            ),
          ),
          Flexible(
              child: (isExpired || isCardInvalid)
                  ? Container()
                  : VerificationCodeView(userCode: userCode, isCardVerificationExpired: !wasCardVerifiedLately)),
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

  String getCardInfoText(bool wasCardVerifiedLately, bool isCardInvalid, BuildContext context) {
    if (isExpired) {
      return "Ihre Karte ist abgelaufen.\nUnter \"Weitere Aktionen\" können Sie einen Antrag auf Verlängerung stellen.";
    }
    if (isCardInvalid) {
      return 'Ihre Karte ist ungültig.\nSie wurde entweder widerrufen oder auf einem anderen Gerät aktiviert.';
    }
    if (!wasCardVerifiedLately) {
      return 'Ihre Karte konnte nicht auf ihre Gültigkeit geprüft werden.Bitte stellen sie sicher, dass eine Verbindung mit dem Internet besteht und prüfen sie erneut.';
    }

    return 'Mit diesem QR-Code können Sie sich bei Akzeptanzstellen ausweisen:';
  }
}
