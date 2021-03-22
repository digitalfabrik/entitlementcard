import 'package:graphql_flutter/graphql_flutter.dart';

import '../graphql/graphql_api.dart';
import 'verification_card_details.dart';
import 'verification_hasher.dart';

Future<bool> queryServerVerification(
    GraphQLClient client, VerificationCardDetails cardDetails) async {
  final hash = hashVerificationCardDetails(cardDetails);
  return _queryServerVerification(client, hash, cardDetails.otp);
}

Future<bool> _queryServerVerification(
    GraphQLClient client, String verificationHash, int totp) async {
  final byCardDetailsHash = CardVerificationByHashQuery(
      variables: CardVerificationByHashArguments(
          card: CardVerificationModelInput(
              cardDetailsHashBase64: verificationHash, totp: totp)));
  final queryOptions = QueryOptions(
      fetchPolicy: FetchPolicy.noCache,
      document: byCardDetailsHash.document,
      variables: byCardDetailsHash.getVariablesMap());

  try {
    final queryResult = await client.query(queryOptions);
    if (queryResult.hasException) {
      throw queryResult.exception;
    }
    final parsedResult = CardVerificationByHashQuery().parse(queryResult.data);
    return parsedResult.cardValid;
    // because we do not know what kinds of exceptions might be thrown:
    // ignore: avoid_catches_without_on_clauses
  } catch (e) {
    throw ServerVerificationException(e);
  }
}

class ServerVerificationException implements Exception {
  final Exception cause;
  const ServerVerificationException(this.cause);

  @override
  String toString() {
    return 'ServerVerificationException{cause: $cause}';
  }
}
