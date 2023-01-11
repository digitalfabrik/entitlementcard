import 'dart:convert';

import 'package:ehrenamtskarte/identification/base_card_details.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/verification/verification_card_details.dart';

class VerificationParseException extends QrCodeParseException {
  final String internalMessage;
  final Exception cause;
  final StackTrace? stackTrace;

  VerificationParseException({required this.internalMessage, required this.cause, this.stackTrace})
      : super(internalMessage);
}

VerificationCardDetails parseQRCodeContent(String rawBase64Content) {
  const base64Decoder = Base64Decoder();

  // TODO (Max): Refactor into Dart extension
  QrCode qrcode;
  try {
    qrcode = QrCode.fromBuffer(base64Decoder.convert(rawBase64Content));
  } on Exception catch (e, stackTrace) {
    throw VerificationParseException(
      internalMessage: "Failed to parse QrCode from base64 encoded data. "
          "Message: ${e.toString()}",
      cause: e,
      stackTrace: stackTrace,
    );
  }

  // TODO: Allow to parse and verify StaticVerifyCodes.
  if (!qrcode.hasDynamicActivationCode()) {
    throw QrCodeWrongTypeException();
  }

  final DynamicVerifyCode verifyCode = qrcode.dynamicVerifyCode;

  // TODO (Max): Duplicate code to identification_qr_content_parser.dart
  final cardInfo = verifyCode.info;
  final bavarianCardType = cardInfo.extensions.extensionBavariaCardType.cardType;

  final fullName = cardInfo.fullName;
  final pepper = verifyCode.pepper;
  final expirationDay = cardInfo.expirationDay;
  final cardType = CardType.values[bavarianCardType.value];
  final regionId = cardInfo.extensions.extensionRegion.regionId;
  final otp = verifyCode.otp;

  final baseCardDetails = BaseCardDetails(fullName, pepper, expirationDay, cardType, regionId);
  return VerificationCardDetails(baseCardDetails, otp);
}
