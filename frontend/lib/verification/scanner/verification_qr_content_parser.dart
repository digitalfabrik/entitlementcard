import 'dart:convert';
import 'dart:typed_data';

import 'package:ehrenamtskarte/identification/base_card_details.dart';
import 'package:ehrenamtskarte/identification/protobuf/card_verify_model.pb.dart';
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

  Uint8List rawProtobufData;
  try {
    rawProtobufData = base64Decoder.convert(rawBase64Content);
  } on Exception catch (e) {
    throw VerificationParseException(
      internalMessage: "Failed to decode base64 string from qr code, "
          "probably not base64 encoded. Message: ${e.toString()}",
      cause: e,
    );
  }
  CardVerifyModel cardVerifyModel;
  try {
    cardVerifyModel = CardVerifyModel.fromBuffer(rawProtobufData);
  } on Exception catch (e, stacktrace) {
    throw VerificationParseException(
      internalMessage: "Failed to parse CardVerifyModel from base64 encoded data. "
          "Message: ${e.toString()}",
      cause: e,
      stackTrace: stacktrace,
    );
  }

  final fullName = cardVerifyModel.fullName;
  final hashSecretBase64 = const Base64Encoder().convert(cardVerifyModel.hashSecret);
  final unixInt64ExpirationDate = cardVerifyModel.expirationDate;
  int? unixExpirationDate;
  unixExpirationDate = unixInt64ExpirationDate.toInt();
  final cardType = CardType.values[cardVerifyModel.cardType.value];
  final regionId = cardVerifyModel.regionId;
  final otp = cardVerifyModel.otp;

  final baseCardDetails = BaseCardDetails(fullName, hashSecretBase64, unixExpirationDate, cardType, regionId);
  return VerificationCardDetails(baseCardDetails, otp);
}
