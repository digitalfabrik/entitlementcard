import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:ehrenamtskarte/graphql_gen/graphql_queries/cards/card_activation.graphql.dart';

Future<Mutation$ActivateCard$activation> activateCode({
  required GraphQLClient client,
  required String projectId,
  required String cardInfoHashBase64,
  required String activationSecretBase64,
  required bool overwriteExisting,
}) async {
  final mutationOptions = Options$Mutation$ActivateCard(
      fetchPolicy: FetchPolicy.noCache,
      variables: Variables$Mutation$ActivateCard(
        project: projectId,
        overwrite: overwriteExisting,
        activationSecretBase64: activationSecretBase64,
        cardInfoHashBase64: cardInfoHashBase64,
      ));

  try {
    final mutationResult = await client.mutate$ActivateCard(mutationOptions);
    final exception = mutationResult.exception;
    if (exception != null) {
      throw exception;
    }

    final data = mutationResult.parsedData;

    if (data == null) {
      throw const ServerCardActivationException('Server returned null.');
    }

    return data.activation;
  } on Object catch (e) {
    throw ServerCardActivationException(e);
  }
}

class ServerCardActivationException implements Exception {
  final Object cause;

  const ServerCardActivationException(this.cause);

  @override
  String toString() {
    return 'ServerCardActivationException{cause: $cause}';
  }
}
