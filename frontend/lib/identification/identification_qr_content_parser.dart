import 'dart:convert';
import 'dart:typed_data';

import 'package:base32/base32.dart';

import '../qr_code_scanner/qr_code_parser.dart';
import 'card_details.dart';
import 'card_details_model.dart';
import 'protobuf/card_activate_model.pb.dart';

QRCodeParseResult createFieldMissingError(
    String missingFieldName, String publicErrorCode) {
  return QRCodeParseResult(
      hasError: true,
      userErrorMessage: "Beim Verarbeiten des eingescannten Codes ist ein"
          "Fehler aufgetreten. Fehlercode: $publicErrorCode");
}

class IdentificationQrContentParser {
  final CardDetailsModel _cardDetailsModel;

  IdentificationQrContentParser(this._cardDetailsModel);

  QRCodeParseResult processQrCodeContent(String rawBase64Content) {
    try {
      final base64Decoder = Base64Decoder();

      Uint8List rawProtobufData;
      try {
        rawProtobufData = base64Decoder.convert(rawBase64Content);
      } on Exception catch (_) {
        return QRCodeParseResult(
            hasError: true,
            userErrorMessage:
                "Der Inhalt des eingescannten Codes kann nicht verstanden "
                "werden. Vermutlich handelt es sich um einen QR Code, "
                "der nicht für die Ehrenamtskarte App generiert wurde.");
      }
      CardActivateModel cardActivateModel;
      try {
        cardActivateModel = CardActivateModel.fromBuffer(rawProtobufData);
      } on Exception catch (_) {
        return QRCodeParseResult(
            hasError: true,
            userErrorMessage:
                "Der Inhalt des eingescannten Codes kann nicht verstanden "
                "werden. Vermutlich handelt es sich um einen QR Code, "
                "der nicht für die Ehrenamtskarte App generiert wurde.");
      }

      final fullName = cardActivateModel.fullName;
      if (fullName == null) {
        return createFieldMissingError("fullName", "fullNameMissing");
      }
      final hashSecret = cardActivateModel.hashSecret;
      if (hashSecret == null) {
        return createFieldMissingError("randomBytes", "randomBytesMissing");
      }
      final unixInt64ExpirationDate = cardActivateModel.expirationDate;
      int unixExpirationDate;
      if (unixInt64ExpirationDate != null) {
        try {
          unixExpirationDate = unixInt64ExpirationDate.toInt();
          if (unixExpirationDate == null) {
            throw Exception(["unixExpirationDate was null"]);
          }
        } on Exception catch (_) {
          return QRCodeParseResult(
              hasError: true,
              userErrorMessage: "Beim Verarbeiten des Ablaufdatums ist ein "
                  "unerwarteter Fehler aufgetreten.");
        }
      }
      if (cardActivateModel.cardType == CardActivateModel_CardType.STANDARD &&
          unixExpirationDate == null) {
        return QRCodeParseResult(
            hasError: true,
            userErrorMessage: "Die eingescannte Karte enthält kein Ablauf-"
                "datum, obwohl dies für die blaue Ehrenamtskarte erforderlich"
                " ist. Vermutlich ist beim Erstellen der "
                "digitalen Ehrenamtskarte ein Fehler passiert.");
      }
      final cardType = cardActivateModel.cardType.value;
      final regionId = cardActivateModel.regionId;
      String base32TotpSecret;
      try {
        base32TotpSecret = base32.encode(cardActivateModel.totpSecret);
      } on Exception catch (_) {
        return QRCodeParseResult(
            hasError: true,
            userErrorMessage: "Beim Verarbeiten des eingescannten Codes ist ein"
                "Fehler aufgetreten. Fehlercode: base32TotpSecretInvalid");
      }

      final cardDetails = CardDetails(
          fullName,
          Base64Encoder().convert(hashSecret),
          unixExpirationDate,
          cardType,
          regionId,
          base32TotpSecret);
      _cardDetailsModel.setCardDetails(cardDetails);
    } on Exception catch (_) {
      return QRCodeParseResult(
          hasError: true,
          userErrorMessage: "Ein unerwarteter Fehler ist aufgetreten.");
    }
    return QRCodeParseResult(hasError: false);
  }
}
