import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:flutter/widgets.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:provider/provider.dart';

import '../../proto/card.pb.dart';
import '../../util/date_utils.dart';
import '../otp_generator.dart';
import '../verification_workflow/query_server_verification.dart';

Future<void> selfVerifyCard(
    BuildContext context, DynamicUserCode? userCode, String projectId, GraphQLClient client) async {
  final initialUserCode = userCode;
  if (initialUserCode == null) {
    return;
  }

  final otpCode = OTPGenerator(initialUserCode.totpSecret).generateOTP();
  final DynamicVerificationCode qrCode = DynamicVerificationCode()
    ..info = initialUserCode.info
    ..pepper = initialUserCode.pepper
    ..otp = otpCode.code;

  debugPrint('Card Self-Verification: Requesting server');

  final (outOfSync: outOfSync, result: cardVerification) =
      await queryDynamicServerVerification(client, projectId, qrCode);

  // If the user code has changed during the server request, we abort.
  if (userCode != initialUserCode) {
    debugPrint('Card Self-Verification: The user code has been changed during server request for the old user code.');
    return;
  }

  debugPrint("Card Self-Verification: Persisting response. Card is ${cardVerification.valid ? "valid." : "INVALID."}");

  final userCodeModel = Provider.of<UserCodeModel>(context, listen: false);
  userCodeModel.setCode(DynamicUserCode()
    ..info = initialUserCode.info
    ..ecSignature = initialUserCode.ecSignature
    ..pepper = initialUserCode.pepper
    ..totpSecret = initialUserCode.totpSecret
    ..cardVerification = (CardVerification()
      ..cardValid = cardVerification.valid
      ..verificationTimeStamp = secondsSinceEpoch(DateTime.parse(cardVerification.verificationTimeStamp))
      ..outOfSync = outOfSync));
}
