import 'dart:convert';
import 'dart:typed_data';

import '../../identification/base_card_details.dart';
import '../../identification/protobuf/card_verify_model.pb.dart';
import '../verification_card_details.dart';

const String genericExternalFailureMessage =
    "Der Inhalt des eingescannten Codes kann nicht verstanden "
    "werden. Vermutlich handelt es sich um einen QR Code, "
    "der nicht für die Ehrenamtskarte App generiert wurde.";

class VerificationParseException implements Exception {
  final String internalMessage;
  final String externalMessage;
  final Exception cause;
  final StackTrace stackTrace;

  VerificationParseException(
      {this.internalMessage,
      this.externalMessage,
      this.cause,
      this.stackTrace});
}

VerificationCardDetails parseQRCodeContent(String rawBase64Content) {
  final base64Decoder = Base64Decoder();

  Uint8List rawProtobufData;
  try {
    rawProtobufData = base64Decoder.convert(rawBase64Content);
  } on Exception catch (e) {
    throw VerificationParseException(
        internalMessage: "Failed to decode base64 string from qr code, "
            "probably not base64 encoded. Message: ${e.toString()}",
        externalMessage: genericExternalFailureMessage,
        cause: e);
  }
  CardVerifyModel cardVerifyModel;
  try {
    cardVerifyModel = CardVerifyModel.fromBuffer(rawProtobufData);
  } on Exception catch (e, stacktrace) {
    throw VerificationParseException(
        internalMessage:
            "Failed to parse CardVerifyModel from base64 encoded data. "
            "Message: ${e.toString()}",
        externalMessage: genericExternalFailureMessage,
        cause: e,
        stackTrace: stacktrace);
  }

  final fullName = cardVerifyModel.fullName;
  final hashSecretBase64 = Base64Encoder().convert(cardVerifyModel.hashSecret);
  final unixInt64ExpirationDate = cardVerifyModel.expirationDate;
  int unixExpirationDate;
  if (unixInt64ExpirationDate != null) {
    unixExpirationDate = unixInt64ExpirationDate.toInt();
  }
  final cardType = CardType.values[cardVerifyModel.cardType.value];
  final regionId = cardVerifyModel.regionId;
  final otp = cardVerifyModel.otp;

  final baseCardDetails = BaseCardDetails(
      fullName, hashSecretBase64, unixExpirationDate, cardType, regionId);
  return VerificationCardDetails(baseCardDetails, otp);
}
