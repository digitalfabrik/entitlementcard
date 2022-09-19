import 'package:ehrenamtskarte/graphql/graphql_api.dart';
import 'package:ehrenamtskarte/verification/verification_card_details.dart';
import 'package:ehrenamtskarte/verification/verification_hasher.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

Future<bool> queryServerVerification(
  GraphQLClient client,
  String projectId,
  VerificationCardDetails cardDetails,
) async {
  final hash = hashVerificationCardDetails(cardDetails);
  return _queryServerVerification(client, projectId, hash, cardDetails.otp);
}

Future<bool> _queryServerVerification(GraphQLClient client, String projectId, String verificationHash, int totp) async {
  final byCardDetailsHash = CardVerificationByHashQuery(
    variables: CardVerificationByHashArguments(
      project: projectId,
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
