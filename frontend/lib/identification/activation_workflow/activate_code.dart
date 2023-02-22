import 'package:ehrenamtskarte/graphql/graphql_api.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

Future<ActivateCard$Mutation$CardActivationResultModel> activateCode({
  required GraphQLClient client,
  required String projectId,
  required String cardInfoHashBase64,
  required String activationSecretBase64,
  required bool overwriteExisting,
}) async {
  final activateCard = ActivateCardMutation(
    variables: ActivateCardArguments(
      project: projectId,
      overwrite: overwriteExisting,
      activationSecretBase64: activationSecretBase64,
      cardInfoHashBase64: cardInfoHashBase64,
    ),
  );
  final mutationOptions = MutationOptions(
    fetchPolicy: FetchPolicy.noCache,
    document: activateCard.document,
    variables: activateCard.getVariablesMap(),
  );

  try {
    final mutationResult = await client.mutate(mutationOptions);
    final exception = mutationResult.exception;
    if (exception != null && mutationResult.hasException) {
      throw exception;
    }

    final data = mutationResult.data;

    if (data == null) {
      throw const ServerCardActivationException("No connection to the server");
    }

    final parsedResult = activateCard.parse(data);
    return parsedResult.activateCard;
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
