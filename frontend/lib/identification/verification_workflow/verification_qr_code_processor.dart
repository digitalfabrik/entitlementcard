import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_code_parser.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/query_server_verification.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/verification_qr_content_parser.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/cupertino.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

Future<CardInfo?> verifyQrCodeContent(
  BuildContext context,
  String rawBase64Content,
) async {
  final client = GraphQLProvider.of(context).value;
  final projectId = Configuration.of(context).projectId;
  final qrcode = rawBase64Content.parseQRCodeContent();

  if (qrcode.hasDynamicVerifyCode()) {
    final verifyCode = qrcode.dynamicVerifyCode;
    return processDynamicVerifyCode(client, projectId, verifyCode);
  } else if (qrcode.hasStaticVerifyCode()) {
    final verifyCode = qrcode.staticVerifyCode;
    return processStaticVerifyCode(client, projectId, verifyCode);
  } else {
    throw QrCodeWrongTypeException();
  }
}

Future<CardInfo?> processDynamicVerifyCode(GraphQLClient client, String projectId, DynamicVerifyCode code) async {
  assertConsistentCardInfo(code.info);
  _assertConsistentDynamicVerifyCode(code);
  if (!(await queryDynamicServerVerification(client, projectId, code))) {
    return null;
  }
  return code.info;
}

Future<CardInfo?> processStaticVerifyCode(GraphQLClient client, String projectId, StaticVerifyCode code) async {
  assertConsistentCardInfo(code.info);
  _assertConsistentStaticVerifyCode(code);
  if (!(await queryStaticServerVerification(client, projectId, code))) {
    return null;
  }
  return code.info;
}

void assertConsistentCardInfo(CardInfo cardInfo) {
  if (!cardInfo.hasFullName()) {
    throw QrCodeFieldMissingException("fullName");
  }
  if (!cardInfo.hasExpirationDay() && cardInfo.extensions.extensionBavariaCardType.cardType != BavariaCardType.GOLD) {
    throw QRCodeMissingExpiryException();
  }
  final expirationDate = cardInfo.hasExpirationDay()
      ? DateTime.fromMicrosecondsSinceEpoch(0).add(Duration(days: cardInfo.expirationDay))
      : null;
  if (expirationDate != null) {
    if (DateTime.now().isAfterDate(expirationDate)) {
      throw CardExpiredException(expirationDate);
    }
  }
}

void _assertConsistentDynamicVerifyCode(DynamicVerifyCode verifyCode) {
  if (!verifyCode.hasPepper()) {
    throw QrCodeFieldMissingException("hashSecretBase64");
  }
  if (verifyCode.otp <= 0) {
    throw QrCodeFieldMissingException("otp");
  }
}

void _assertConsistentStaticVerifyCode(StaticVerifyCode verifyCode) {
  if (!verifyCode.hasPepper()) {
    throw QrCodeFieldMissingException("hashSecretBase64");
  }
}

extension DateComparison on DateTime {
  bool isAfterDate(DateTime other) {
    if (isAfter(other)) return true;
    return year == other.year && month == other.month && day == other.day;
  }
}

class CardExpiredException extends QrCodeParseException {
  final DateTime expiry;

  CardExpiredException(this.expiry) : super("card already expired");
}
