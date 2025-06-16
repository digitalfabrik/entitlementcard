import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_code_parser.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/identification/util/card_info_utils.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/query_server_verification.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/cupertino.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

Future<CardInfo?> verifyQrCodeContent(
  BuildContext context,
  QrCode qrcode,
) async {
  final client = GraphQLProvider.of(context).value;
  final projectId = Configuration.of(context).projectId;

  if (qrcode.hasDynamicVerificationCode()) {
    final verificationCode = qrcode.dynamicVerificationCode;
    return verifyDynamicVerificationCode(client, projectId, verificationCode);
  } else if (qrcode.hasStaticVerificationCode()) {
    final verificationCode = qrcode.staticVerificationCode;
    return verifyStaticVerificationCode(client, projectId, verificationCode);
  } else {
    throw QrCodeWrongTypeException(getQRCodeTypeMessage(qrcode));
  }
}

Future<CardInfo?> verifyDynamicVerificationCode(
  GraphQLClient client,
  String projectId,
  DynamicVerificationCode code,
) async {
  assertConsistentCardInfo(code.info);
  _assertConsistentDynamicVerificationCode(code);
  final (outOfSync: outOfSync, result: result) = await queryDynamicServerVerification(client, projectId, code);
  if (outOfSync) {
    debugPrint('Verification: This device\'s time is out of sync with the server.'
        'Ignoring, as only the time of the device that generates the QR code is relevant for the verification process.');
  }

  if (!result.valid) {
    return null;
  }
  return code.info;
}

Future<CardInfo?> verifyStaticVerificationCode(
  GraphQLClient client,
  String projectId,
  StaticVerificationCode code,
) async {
  assertConsistentCardInfo(code.info);
  _assertConsistentStaticVerificationCode(code);
  if (!(await queryStaticServerVerification(client, projectId, code)).valid) {
    return null;
  }
  return code.info;
}

void assertConsistentCardInfo(CardInfo cardInfo) {
  if (!cardInfo.hasFullName()) {
    throw QrCodeFieldMissingException('fullName');
  }
  if (!cardInfo.hasExpirationDay() && cardInfo.extensions.extensionBavariaCardType.cardType != BavariaCardType.GOLD) {
    throw QRCodeMissingExpiryException();
  }
  final expirationDate = getExpirationDay(cardInfo);
  if (expirationDate != null && isCardExpired(cardInfo)) {
    throw CardExpiredException(expirationDate);
  }
}

void _assertConsistentDynamicVerificationCode(DynamicVerificationCode verificationCode) {
  if (!verificationCode.hasPepper()) {
    throw QrCodeFieldMissingException('pepper');
  }
  if (verificationCode.otp <= 0) {
    throw QrCodeFieldMissingException('otp');
  }
}

void _assertConsistentStaticVerificationCode(StaticVerificationCode verificationCode) {
  if (!verificationCode.hasPepper()) {
    throw QrCodeFieldMissingException('pepper');
  }
}

class CardExpiredException extends QrCodeParseException {
  final DateTime expiry;

  CardExpiredException(this.expiry) : super('card already expired');
}
