import 'package:ehrenamtskarte/graphql_gen/graphql_queries/cards/card_verification_by_hash.graphql.dart';
import 'package:ehrenamtskarte/graphql_gen/schema.graphql.dart';
import 'package:ehrenamtskarte/identification/util/card_info_utils.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

Future<({bool outOfSync, Query$CardVerificationByHash$verification result})> queryDynamicServerVerification(
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
    Enum$CodeType.DYNAMIC,
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

Future<Query$CardVerificationByHash$verification> queryStaticServerVerification(
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
    Enum$CodeType.STATIC,
  );
}

Future<Query$CardVerificationByHash$verification> _queryServerVerification(
  GraphQLClient client,
  String projectId,
  String verificationHash,
  int? totp,
  Enum$CodeType codeType,
) async {
  final options = Options$Query$CardVerificationByHash(
    fetchPolicy: FetchPolicy.noCache,
    variables: Variables$Query$CardVerificationByHash(
      project: projectId,
      card: Input$CardVerificationModelInput(
        cardInfoHashBase64: verificationHash,
        totp: totp,
        codeType: codeType,
      ),
    ),
  );

  try {
    final queryResult = await client.query$CardVerificationByHash(options);
    final exception = queryResult.exception;
    if (exception != null) {
      throw exception;
    }
    final data = queryResult.parsedData;

    if (data == null) {
      throw ServerVerificationException('Returned data is null.');
    }

    return data.verification;
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
