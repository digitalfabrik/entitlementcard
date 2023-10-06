import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/more_actions_dialog.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/self_verify_card.dart';
import 'package:ehrenamtskarte/identification/id_card/id_card.dart';
import 'package:ehrenamtskarte/identification/user_codes_model.dart';
import 'package:ehrenamtskarte/identification/util/card_info_utils.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:provider/provider.dart';

import 'verification_code_view.dart';

class CardDetailView extends StatefulWidget {
  final DynamicUserCode userCode;
  final VoidCallback startActivation;
  final VoidCallback startVerification;
  final VoidCallback startApplication;
  final VoidCallback removeCard;

  const CardDetailView(
      {super.key,
      required this.userCode,
      required this.startActivation,
      required this.startVerification,
      required this.startApplication,
      required this.removeCard});

  @override
  State<CardDetailView> createState() => _CardDetailViewState();
}

class _CardDetailViewState extends State<CardDetailView> {
  bool initiatedSelfVerification = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    if (!initiatedSelfVerification) {
      // On every app start when this widget is first rendered, we verify the card with the backend
      // in order to detect if one of the following events happened:
      // - the card was activated on another device
      // - the card was revoked
      // - the card expired (on backend's system time)
      _selfVerifyCard();
      initiatedSelfVerification = true;
    }
  }

  Future<void> _selfVerifyCard() async {
    final userCodesModel = Provider.of<UserCodesModel>(context, listen: false);
    final projectId = Configuration.of(context).projectId;
    final client = GraphQLProvider.of(context).value;
    userCodesModel.userCodes!.map((code) => selfVerifyCard(context, code, projectId, client));
  }

  @override
  Widget build(BuildContext context) {
    final projectId = Configuration.of(context).projectId;
    final regionsQuery = GetRegionsByIdQuery(
      variables: GetRegionsByIdArguments(
        project: projectId,
        ids: [widget.userCode.info.extensions.extensionRegion.regionId],
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
              cardInfo: widget.userCode.info,
              region: region != null ? Region(region.prefix, region.name) : null,
              isExpired: isCardExpired(widget.userCode.info),
              isNotYetValid: isCardNotYetValid(widget.userCode.info)),
        );
        final qrCodeAndStatus = QrCodeAndStatus(
          userCode: widget.userCode,
          onMoreActionsPressed: () => _onMoreActionsPressed(context),
          onSelfVerifyPressed: _selfVerifyCard,
        );

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
                          Flexible(child: qrCodeAndStatus)
                        else
                          ConstrainedBox(
                            constraints: const BoxConstraints.tightFor(width: qrCodeMinWidth),
                            child: qrCodeAndStatus,
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
                    child: Column(children: [paddedCard, const SizedBox(height: 16), qrCodeAndStatus]),
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
          startActivation: widget.startActivation,
          startApplication: widget.startApplication,
          startVerification: widget.startVerification,
          removeCard: widget.removeCard),
    );
  }
}

enum CardStatus {
  // The card expired according to the clock of the local device.
  expired,
  // The card was not verified lately by the server.
  notVerifiedLately,
  // The time of the device was out of sync with the server.
  timeOutOfSync,
  // The validity period didn't start yet according to the clock of the local device
  notYetValid,
  // The card was verified lately by the server and it responded that the card is invalid.
  invalid,
  // In any other case, we assume the card is valid and show the dynamic QR code
  valid;

  factory CardStatus.from(DynamicUserCode code) {
    if (isCardExpired(code.info)) {
      return CardStatus.expired;
    } else if (!cardWasVerifiedLately(code.cardVerification)) {
      return CardStatus.notVerifiedLately;
    } else if (code.cardVerification.outOfSync) {
      return CardStatus.timeOutOfSync;
    } else if (isCardNotYetValid(code.info)) {
      return CardStatus.notYetValid;
    } else if (!code.cardVerification.cardValid) {
      return CardStatus.invalid;
    } else {
      return CardStatus.valid;
    }
  }
}

class QrCodeAndStatus extends StatelessWidget {
  final VoidCallback onMoreActionsPressed;
  final VoidCallback onSelfVerifyPressed;
  final DynamicUserCode userCode;

  const QrCodeAndStatus(
      {super.key, required this.onMoreActionsPressed, required this.onSelfVerifyPressed, required this.userCode});

  @override
  Widget build(BuildContext context) {
    final CardStatus status = CardStatus.from(userCode);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ...switch (status) {
            CardStatus.expired => [
                _PaddedText(
                    'Ihre Karte ist abgelaufen.\nUnter "Weitere Aktionen" können Sie einen Antrag auf Verlängerung stellen.')
              ],
            CardStatus.notVerifiedLately => [
                _PaddedText(
                    'Ihre Karte konnte nicht auf ihre Gültigkeit geprüft werden. Bitte stellen Sie sicher, dass eine Verbindung mit dem Internet besteht und prüfen Sie erneut.'),
                Flexible(
                  child: TextButton.icon(
                    icon: const Icon(Icons.refresh),
                    onPressed: onSelfVerifyPressed,
                    label: Text('Erneut prüfen'),
                  ),
                ),
              ],
            CardStatus.timeOutOfSync => [
                _PaddedText(
                    'Die Uhrzeit Ihres Geräts scheint nicht zu stimmen. Bitte synchronisieren Sie die Uhrzeit in den Systemeinstellungen.'),
                Flexible(
                    child: TextButton.icon(
                  icon: const Icon(Icons.refresh),
                  onPressed: onSelfVerifyPressed,
                  label: Text('Erneut prüfen'),
                ))
              ],
            CardStatus.invalid => [
                _PaddedText(
                    'Ihre Karte ist ungültig.\nSie wurde entweder widerrufen oder auf einem anderen Gerät aktiviert.')
              ],
            CardStatus.valid => [
                _PaddedText('Mit diesem QR-Code können Sie sich bei Akzeptanzstellen ausweisen:'),
                Flexible(child: VerificationCodeView(userCode: userCode))
              ],
            CardStatus.notYetValid => [
                _PaddedText('Der Gültigkeitszeitraum Ihrer Karte hat noch nicht begonnen.'),
              ]
          },
          Container(
            alignment: Alignment.center,
            child: TextButton(
              onPressed: onMoreActionsPressed,
              child: Text(
                'Weitere Aktionen',
                style: TextStyle(color: Theme.of(context).colorScheme.secondary),
              ),
            ),
          )
        ],
      ),
    );
  }
}

class _PaddedText extends StatelessWidget {
  final String text;

  const _PaddedText(this.text);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.only(bottom: 4),
      constraints: const BoxConstraints(maxWidth: 300),
      child: Text(text, textAlign: TextAlign.center),
    );
  }
}
