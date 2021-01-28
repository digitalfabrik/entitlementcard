import 'package:graphql_flutter/graphql_flutter.dart';

import '../graphql/verification_graphql_api.graphql.dart';
import 'verification_card_details_model.dart';
import 'verification_error.dart';
import 'verification_hasher.dart';

Future<void> verifyCardValidWithRemote(
    VerificationCardDetailsModel model, GraphQLClient client) async {
  try {
    await Future.delayed(const Duration(seconds: 2), () => "2");
    final hash = hashVerificationCardDetails(model.verificationCardDetails);
    print("Verification hash: $hash");
    model.setVerificationSuccessful();
  } on Exception catch (e) {
    print("verifyCardValidWithRemote failed with unexpected "
        "error: ${e.toString()}");
    model.setVerificationFailure(VerificationError.fromStrings(
        "Ein unerwarteter Fehler ist aufgetreten", "#genVerErr"));
  }
}

Future<bool> requestValidityFromBackend(
    GraphQLClient client, String hash, int otp) async {
  final query = CardVerificationByHashQuery(
      variables: CardVerificationByHashArguments(
          card: CardVerificationModelInput(hashModel: hash, totp: otp)));

  final result = await client.query(QueryOptions(
      documentNode: query.document, variables: query.getVariablesMap()));

  final isCardValid = query.parse(result.data).verifyCard;
  if (isCardValid) {
    print("Card is valid!");
  } else {
    print("Card is not valid!");
  }

  return isCardValid;
}
