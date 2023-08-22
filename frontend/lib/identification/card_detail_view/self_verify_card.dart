import 'package:flutter/widgets.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import '../../proto/card.pb.dart';
import '../../util/date_utils.dart';
import '../otp_generator.dart';
import '../user_code_model.dart';
import '../verification_workflow/query_server_verification.dart';

Future<void> selfVerifyCard(UserCodeModel userCodeModel, String projectId, GraphQLClient client) async {
  final userCode = userCodeModel.userCode;
  if (userCode == null) {
    return;
  }

  final otpCode = OTPGenerator(userCode.totpSecret).generateOTP();
  final DynamicVerificationCode qrCode = DynamicVerificationCode()
    ..info = userCode.info
    ..pepper = userCode.pepper
    ..otp = otpCode.code;

  debugPrint("Card Self-Verification: Requesting server");

  final (outOfSync: outOfSync, result: cardVerification) =
      await queryDynamicServerVerification(client, projectId, qrCode);

  // If the user code has changed during the server request, we abort.
  if (userCodeModel.userCode != userCode) {
    debugPrint("Card Self-Verification: The user code has been changed during server request for the old user code.");
    return;
  }

  debugPrint("Card Self-Verification: Persisting response. Card is ${cardVerification.valid ? "valid." : "INVALID."}");

  userCodeModel.setCode(DynamicUserCode()
    ..info = userCode.info
    ..ecSignature = userCode.ecSignature
    ..pepper = userCode.pepper
    ..totpSecret = userCode.totpSecret
    ..cardVerification = (CardVerification()
      ..cardValid = cardVerification.valid
      ..verificationTimeStamp = secondsSinceEpoch(DateTime.parse(cardVerification.verificationTimeStamp))
      ..outOfSync = outOfSync));
}
