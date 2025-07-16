import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:flutter/widgets.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/util/date_utils.dart';
import 'package:ehrenamtskarte/identification/otp_generator.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/query_server_verification.dart';

Future<void> selfVerifyCard(
  UserCodeModel userCodeModel,
  DynamicUserCode userCode,
  String projectId,
  GraphQLClient client,
) async {
  final otpCode = OTPGenerator(userCode.totpSecret).generateOTP();
  final DynamicVerificationCode qrCode = DynamicVerificationCode()
    ..info = userCode.info
    ..pepper = userCode.pepper
    ..otp = otpCode.code;

  debugPrint('Card Self-Verification: Requesting server');

  final (outOfSync: outOfSync, result: cardVerification) = await queryDynamicServerVerification(
    client,
    projectId,
    qrCode,
  );

  debugPrint('Card Self-Verification: Persisting response. Card is ${cardVerification.valid ? 'valid.' : 'INVALID.'}');

  // If the code was removed in the mean time, updateCode will do nothing.
  await userCodeModel.updateCode(
    DynamicUserCode()
      ..info = userCode.info
      ..ecSignature = userCode.ecSignature
      ..pepper = userCode.pepper
      ..totpSecret = userCode.totpSecret
      ..cardVerification = (CardVerification()
        ..cardValid = cardVerification.valid
        ..cardExtendable = cardVerification.extendable
        ..verificationTimeStamp = secondsSinceEpoch(DateTime.parse(cardVerification.verificationTimeStamp))
        ..outOfSync = outOfSync),
  );
}
