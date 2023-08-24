import 'package:ehrenamtskarte/graphql/graphql_api.dart';
import 'package:ehrenamtskarte/identification/util/card_info_utils.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

Future<({bool outOfSync, CardVerificationByHash$Query$CardVerificationResultModel result})>
    queryDynamicServerVerification(
  GraphQLClient client,
  String projectId,
  DynamicVerificationCode verificationCode,
) async {
  final hash = verificationCode.info.hash(verificationCode.pepper);
  final timeBeforeRequest = DateTime.now();
  final stopWatch = Stopwatch()..start();
  final result = await _queryServerVerification(
    client,
    projectId,
    hash,
    verificationCode.otp,
    CodeType.kw$DYNAMIC,
  );
  stopWatch.stop();
  // We assume that the server captured the verificationTimeStamp in the middle of the request:
  final estimatedTimeOfVerification = timeBeforeRequest.add(Duration(milliseconds: stopWatch.elapsedMilliseconds ~/ 2));
  final actualTimeOfVerification = DateTime.parse(result.verificationTimeStamp);
  final timeOffset =
      (estimatedTimeOfVerification.millisecondsSinceEpoch - actualTimeOfVerification.millisecondsSinceEpoch).abs() /
          1000;
  // The server tolerates a time offset of 30 seconds
  // (see backend/src/main/kotlin/app/ehrenamtskarte/backend/verification/service/CardVerifier.kt)
  final outOfSync = timeOffset >= 30;
  return (outOfSync: outOfSync, result: result);
}

Future<CardVerificationByHash$Query$CardVerificationResultModel> queryStaticServerVerification(
  GraphQLClient client,
  String projectId,
  StaticVerificationCode verificationCode,
) async {
  final hash = verificationCode.info.hash(verificationCode.pepper);
  return _queryServerVerification(
    client,
    projectId,
    hash,
    null,
    CodeType.kw$STATIC,
  );
}

Future<CardVerificationByHash$Query$CardVerificationResultModel> _queryServerVerification(
  GraphQLClient client,
  String projectId,
  String verificationHash,
  int? totp,
  CodeType codeType,
) async {
  final byCardDetailsHash = CardVerificationByHashQuery(
    variables: CardVerificationByHashArguments(
      project: projectId,
      card: CardVerificationModelInput(
        cardInfoHashBase64: verificationHash,
        totp: totp,
        codeType: codeType,
      ),
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
    if (exception != null) {
      throw exception;
    }
    final data = queryResult.data;

    if (data == null) {
      throw ServerVerificationException('Returned data is null.');
    }

    final parsedResult = byCardDetailsHash.parse(data);
    return parsedResult.verifyCardInProjectV2;
  } on Object catch (e) {
    throw ServerVerificationException(e);
  }
}

class ServerVerificationException implements Exception {
  final Object cause;

  const ServerVerificationException(this.cause);

  @override
  String toString() {
    return "ServerVerificationException{cause: $cause}";
  }
}
