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
        return _buildRemoteVerification(context);
      case LocalVerificationState.failure:
        return NegativeVerificationResult(model.verificationError);
    }
    return Container(width: 0.0, height: 0.0);
  }

  Widget _buildRemoteVerification(BuildContext context) {
    final byCardDetailsHash = CardVerificationByHashQuery(
        variables: CardVerificationByHashArguments(
            card: CardVerificationModelInput(
                cardDetailsHashBase64: model.verificationHash,
                totp: model.verificationCardDetails.otp)));
    final getRegions = GetRegionsQuery();
    final client = GraphQLProvider.of(context).value;
    final verifyQuery = client.query(QueryOptions(
        document: byCardDetailsHash.document,
        variables: byCardDetailsHash.getVariablesMap()));
    final regionsQuery = client.query(QueryOptions(
        document: getRegions.document,
        variables: getRegions.getVariablesMap()));
    return FutureBuilder(
        future: Future.wait([verifyQuery, regionsQuery]),
        builder: (context, snapshot) {
          if (!snapshot.hasError && !snapshot.hasData) {
            return WaitingForVerification();
          }
          if (snapshot.hasError) {
            return NegativeVerificationResult(VerificationError(
                "Verbindung zum Server fehlgeschlagen.", "connectionError"));
          }
          QueryResult verifyResult = snapshot.data[0];
          QueryResult regionsResult = snapshot.data[1];
          if (verifyResult.hasException || regionsResult.hasException) {
            var exception = verifyResult.hasException
                ? verifyResult.exception.toString()
                : regionsResult.exception.toString();
            return NegativeVerificationResult(
                VerificationError.fromStrings(exception, "verifyRequestError"));
          }
          final isCardValid =
              byCardDetailsHash.parse(verifyResult.data).cardValid;
          final region = getRegions
              .parse(regionsResult.data)
              .regions
              .firstWhere((region) =>
                  region.id ==
                  model.verificationCardDetails.cardDetails.regionId);
          if (isCardValid) {
            return PositiveVerificationResult(
                model.verificationCardDetails.cardDetails, region);
          } else {
            return NegativeVerificationResult(VerificationError(
                "Die zu prüfende Karte ist ungültig!", "cardRejected"));
          }
        });
  }
}
