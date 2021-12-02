import 'package:graphql_flutter/graphql_flutter.dart';

import '../graphql/graphql_api.dart';
import 'verification_card_details.dart';
import 'verification_hasher.dart';

Future<bool> queryServerVerification(GraphQLClient client, VerificationCardDetails cardDetails) async {
  final hash = hashVerificationCardDetails(cardDetails);
  return _queryServerVerification(client, hash, cardDetails.otp);
}

Future<bool> _queryServerVerification(GraphQLClient client, String verificationHash, int totp) async {
  final byCardDetailsHash = CardVerificationByHashQuery(
    variables: CardVerificationByHashArguments(
      card: CardVerificationModelInput(cardDetailsHashBase64: verificationHash, totp: totp),
    ),
  );
  final queryOptions = QueryOptions(
    fetchPolicy: FetchPolicy.noCache,
    document: byCardDetailsHash.document,
    variables: byCardDetailsHash.getVariablesMap(),
  );

  try {
    final queryResult = await client.query(queryOptions);
    final exception = queryResult.exception;
    if (exception != null && queryResult.hasException) {
      throw exception;
    }
    final data = queryResult.data;

    if (data == null) {
      return false;
    }

    final parsedResult = byCardDetailsHash.parse(data);
    return parsedResult.cardValid;
  } on Object catch (e) {
    throw ServerVerificationException(e);
  }
}

class ServerVerificationException implements Exception {
  final Object cause;

  const ServerVerificationException(this.cause);

  @override
  String toString() {
    return 'ServerVerificationException{cause: $cause}';
  }
}
