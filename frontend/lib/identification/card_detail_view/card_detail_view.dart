import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/more_actions_dialog.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/self_verify_card.dart';
import 'package:ehrenamtskarte/identification/id_card/id_card_with_region_query.dart';
import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:ehrenamtskarte/identification/util/card_info_utils.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/identification/card_detail_view/verification_code_view.dart';
import 'package:provider/provider.dart';

class CardDetailView extends StatefulWidget {
  final DynamicUserCode userCode;
  final VoidCallback startActivation;
  final VoidCallback startVerification;
  final VoidCallback startApplication;
  final VoidCallback openRemoveCardDialog;

  const CardDetailView(
      {super.key,
      required this.userCode,
      required this.startActivation,
      required this.startVerification,
      required this.startApplication,
      required this.openRemoveCardDialog});

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
      _selfVerifyCard(widget.userCode);
      initiatedSelfVerification = true;
    }
  }

  Future<void> _selfVerifyCard(DynamicUserCode userCode) async {
    final projectId = Configuration.of(context).projectId;
    final client = GraphQLProvider.of(context).value;
    final userCodeModel = Provider.of<UserCodeModel>(context, listen: false);
    selfVerifyCard(userCodeModel, userCode, projectId, client);
  }

  @override
  Widget build(BuildContext context) {
    final orientation = MediaQuery.of(context).orientation;

    final paddedCard = Padding(
      padding: const EdgeInsets.all(8),
      child: IdCardWithRegionQuery(
          cardInfo: widget.userCode.info,
          isExpired: isCardExpired(widget.userCode.info),
          isNotYetValid: isCardNotYetValid(widget.userCode.info)),
    );
    final qrCodeAndStatus = QrCodeAndStatus(
      userCode: widget.userCode,
      onMoreActionsPressed: () => _onMoreActionsPressed(context),
      onSelfVerifyPressed: () => _selfVerifyCard(widget.userCode),
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
  }

  void _onMoreActionsPressed(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => MoreActionsDialog(
          startActivation: widget.startActivation,
          startApplication: widget.startApplication,
          startVerification: widget.startVerification,
          openRemoveCardDialog: widget.openRemoveCardDialog),
    );
  }
}

enum CardStatus {
  /// The card expired according to the clock of the local device.
  expired,

  /// The card was not verified lately by the server.
  notVerifiedLately,

  /// The time of the device was out of sync with the server.
  timeOutOfSync,

  /// The validity period didn't start yet according to the clock of the local device
  notYetValid,

  /// The card was verified lately by the server and it responded that the card is invalid.
  invalid,

  /// In any other case, we assume the card is valid and show the dynamic QR code
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
    final t = context.t;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ...switch (status) {
            CardStatus.expired => [_PaddedText(t.identification.cardExpired)],
            CardStatus.notVerifiedLately => [
                _PaddedText(t.identification.checkFailed),
                Flexible(
                  child: TextButton.icon(
                    icon: const Icon(Icons.refresh),
                    onPressed: onSelfVerifyPressed,
                    label: Text(t.common.tryAgain),
                  ),
                ),
              ],
            CardStatus.timeOutOfSync => [
                _PaddedText(t.identification.timeIncorrect),
                Flexible(
                    child: TextButton.icon(
                  icon: const Icon(Icons.refresh),
                  onPressed: onSelfVerifyPressed,
                  label: Text(t.common.tryAgain),
                ))
              ],
            CardStatus.invalid => [_PaddedText(t.identification.cardInvalid)],
            CardStatus.valid => [
                _PaddedText(t.identification.authenticationPossible),
                Flexible(child: VerificationCodeView(userCode: userCode))
              ],
            CardStatus.notYetValid => [
                _PaddedText(t.identification.cardNotYetValid),
              ]
          },
          Container(
            alignment: Alignment.center,
            child: TextButton(
              onPressed: onMoreActionsPressed,
              child: Text(
                t.common.moreActions,
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
      child: Text(text, textAlign: TextAlign.center, style: Theme.of(context).textTheme.bodyLarge),
    );
  }
}
