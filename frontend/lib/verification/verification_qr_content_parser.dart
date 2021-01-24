import 'dart:convert';
import 'dart:typed_data';

import '../identification/base_card_details.dart';
import '../identification/protobuf/card_verify_model.pb.dart';
import '../qr_code_scanner/qr_code_parser.dart';
import 'verification_card_details.dart';
import 'verification_card_details_model.dart';
import 'verification_error.dart';

VerificationError createFieldMissingError(
    String missingFieldName, String publicErrorCode) {
  print("VerificationQrContentParser."
      "processQrCodeContent(String rawBase64Content) failed to parse "
      "qr code because the field '$missingFieldName' was null");
  return VerificationError.fromStrings(
      "Die eingescannte Ehrenamtskarte ist nicht gültig, da erforderliche "
      "Daten fehlen.",
      publicErrorCode);
}

class VerificationQrContentParser {
  final VerificationCardDetailsModel _verificationCardDetailsModel;

  VerificationQrContentParser(this._verificationCardDetailsModel);

  QRCodeParseResult processQrCodeContent(String rawBase64Content) {
    try {
      final base64Decoder = Base64Decoder();

      Uint8List rawProtobufData;
      try {
        rawProtobufData = base64Decoder.convert(rawBase64Content);
      } on Exception catch (e) {
        return QRCodeParseResult(
            hasError: true,
            internalErrorMessage:
                "Failed to decode base64 string from qr code, "
                "probably not base64 encoded. Message: ${e.toString()}",
            userErrorMessage:
                "Der Inhalt des eingescannten Codes kann nicht verstanden "
                "werden. Vermutlich handelt es sich um einen QR Code, "
                "der nicht für die Ehrenamtskarte App generiert wurde.");
      }
      CardVerifyModel cardVerifyModel;
      try {
        cardVerifyModel = CardVerifyModel.fromBuffer(rawProtobufData);
      } on Exception catch (e) {
        return QRCodeParseResult(
            hasError: true,
            internalErrorMessage:
                "Failed to parse CardVerifyModel from base64 encoded data. "
                "Message: ${e.toString()}",
            userErrorMessage:
                "Der Inhalt des eingescannten Codes kann nicht verstanden "
                "werden. Vermutlich handelt es sich um einen QR Code, "
                "der nicht für die Ehrenamtskarte App generiert wurde.");
      }

      final fullName = cardVerifyModel.fullName;
      if (fullName == null || fullName.isEmpty) {
        _verificationCardDetailsModel.setVerificationFailure(
            createFieldMissingError("fullName", "fullNameMissing"));
        return QRCodeParseResult();
      }
      final randomBytes = cardVerifyModel.randomBytes;
      if (randomBytes == null) {
        _verificationCardDetailsModel.setVerificationFailure(
            createFieldMissingError("randomBytes", "randomBytesMissing"));
        return QRCodeParseResult();
      }
      final unixInt64ExpirationDate = cardVerifyModel.expirationDate;
      int unixExpirationDate;
      if (unixInt64ExpirationDate != null) {
        try {
          unixExpirationDate = unixInt64ExpirationDate.toInt();
          if (unixExpirationDate == null) {
            throw Exception(["unixExpirationDate was null"]);
          }
        } on Exception catch (e) {
          return QRCodeParseResult(
              hasError: true,
              internalErrorMessage: "Failed to parse unixExpirationDate, "
                  "Message: ${e.toString()}",
              userErrorMessage: "Beim Verarbeiten des Ablaufdatums ist ein "
                  "unerwarteter Fehler aufgetreten.");
        }
      }
      if (cardVerifyModel.cardType == CardVerifyModel_CardType.STANDARD &&
          unixExpirationDate == null) {
        _verificationCardDetailsModel
            .setVerificationFailure(VerificationError.fromStrings(
                "Die eingescannte Karte enthält kein Ablauf-"
                    "datum, obwohl dies für die blaue Ehrenamtskarte"
                    " erforderlich ist.",
                "ExpirationDateWithStandardMissing"));

        return QRCodeParseResult();
      }
      final cardType = cardVerifyModel.cardType.toString();
      final regionId = cardVerifyModel.region;
      final otp = cardVerifyModel.otp;
      if (otp == null || otp.isEmpty) {
        _verificationCardDetailsModel.setVerificationFailure(
            VerificationError.fromStrings(
                "Eine zur Verifikation erforderliche Information fehlt.",
                "otpMissing"));
        return QRCodeParseResult();
      }
      _verificationCardDetailsModel.setWaitingForVerificationResult();

      final baseCardDetails = BaseCardDetails(
          fullName, randomBytes, unixExpirationDate, cardType, regionId);
      final verificationCardDetails =
          VerificationCardDetails(baseCardDetails, otp);
      Future.delayed(
          const Duration(seconds: 2),
          () => _verificationCardDetailsModel
              .setVerificationSuccessful(verificationCardDetails));
    } on Exception catch (e) {
      return QRCodeParseResult(
          hasError: true,
          internalErrorMessage: e.toString(),
          userErrorMessage: "Ein unerwarteter Fehler ist aufgetreten.");
    }
    return QRCodeParseResult(hasError: false);
  }
}
