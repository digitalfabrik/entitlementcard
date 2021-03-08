import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import '../../graphql/graphql_api.dart';
import '../../graphql/graphql_api.graphql.dart';
import '../verification_card_details_model.dart';
import '../verification_error.dart';
import 'result_card/negative_verification_result.dart';
import 'result_card/positive_verification_result.dart';
import 'result_card/waiting_for_verification.dart';

class VerificationResult extends StatelessWidget {
  final VerificationCardDetailsModel model;

  VerificationResult(this.model);

  @override
  Widget build(BuildContext context) {
    switch (model.verificationState) {
      case LocalVerificationState.waitingForScan:
        return Container(width: 0.0, height: 0.0);
      case LocalVerificationState.readyForRemoteVerification:
        return _buildRemoteVerification();
      case LocalVerificationState.failure:
        return NegativeVerificationResult(model.verificationError);
    }
    return Container(width: 0.0, height: 0.0);
  }

  Widget _buildRemoteVerification() {
    final byCardDetailsHash = CardVerificationByHashQuery(
        variables: CardVerificationByHashArguments(
            card: CardVerificationModelInput(
                cardDetailsHashBase64: model.verificationHash,
                totp: model.verificationCardDetails.otp)));
    return Query(
      options: QueryOptions(
          document: byCardDetailsHash.document,
          variables: byCardDetailsHash.getVariablesMap()),
      builder: (result, {refetch, fetchMore}) {
        if (result.hasException) {
          return NegativeVerificationResult(VerificationError(
              result.exception.toString(), "verifyRequestError"));
        }

        if (result.isLoading) {
          return WaitingForVerification();
        }
        final isCardValid =
            CardVerificationByHashQuery().parse(result.data).cardValid;
        if (isCardValid) {
          return PositiveVerificationResult(
              model.verificationCardDetails.cardDetails);
        } else {
          return NegativeVerificationResult(VerificationError(
              "Die zu prüfende Karte konnte vom Server nicht verifiziert "
                  "werden!",
              "cardRejected"));
        }
      },
    );
  }
}
