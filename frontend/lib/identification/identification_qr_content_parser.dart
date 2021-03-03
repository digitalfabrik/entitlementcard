import 'dart:convert';

import 'package:base32/base32.dart';

import '../qr_code_scanner/qr_code_parser.dart';
import 'base_card_details.dart';
import 'card_details.dart';
import 'card_details_model.dart';
import 'protobuf/card_activate_model.pb.dart';

class QRCodeInvalidTotpSecretException extends QRCodeParseException {
  QRCodeInvalidTotpSecretException() : super("invalid totp secret");
}

class QRCodeInvalidExpiryException extends QRCodeParseException {
  QRCodeInvalidExpiryException() : super("invalid expiry date");
}

class QRCodeMissingExpiryException extends QRCodeFieldMissingException {
  QRCodeMissingExpiryException() : super("expirationDate");
}

class QRCodeInvalidFormatException extends QRCodeParseException {
  QRCodeInvalidFormatException() : super("invalid format");
}

class IdentificationQrContentParser {
  final CardDetailsModel _cardDetailsModel;

  IdentificationQrContentParser(this._cardDetailsModel);

  void processQrCodeContent(String rawBase64Content) {
    try {
      final base64Decoder = Base64Decoder();

      CardActivateModel cardActivateModel;
      try {
        var rawProtobufData = base64Decoder.convert(rawBase64Content);
        cardActivateModel = CardActivateModel.fromBuffer(rawProtobufData);
      } on Exception catch (_) {
        throw QRCodeInvalidFormatException();
      }

      final fullName = cardActivateModel.fullName;
      if (fullName == null) {
        throw QRCodeFieldMissingException("fullName");
      }
      final hashSecret = cardActivateModel.hashSecret;
      if (hashSecret == null) {
        throw QRCodeFieldMissingException("randomBytes");
      }

      final unixInt64ExpirationDate = cardActivateModel.expirationDate;
      int unixExpirationDate;
      if (unixInt64ExpirationDate != null && unixInt64ExpirationDate > 0) {
        try {
          unixExpirationDate = unixInt64ExpirationDate.toInt();
        } on Exception catch (_) {
          throw QRCodeInvalidExpiryException();
        }
      }

      if (cardActivateModel.cardType == CardActivateModel_CardType.STANDARD &&
          unixExpirationDate == null) {
        throw QRCodeMissingExpiryException();
      }

      final cardType = CardType.values[cardActivateModel.cardType.value];
      final regionId = cardActivateModel.regionId;
      if (!cardActivateModel.hasTotpSecret()) {
        throw QRCodeFieldMissingException("totpSecret");
      }
      String base32TotpSecret;
      try {
        base32TotpSecret = base32.encode(cardActivateModel.totpSecret);
      } on Exception catch (_) {
        throw QRCodeInvalidTotpSecretException();
      }

      final cardDetails = CardDetails(
          fullName,
          Base64Encoder().convert(hashSecret),
          unixExpirationDate,
          cardType,
          regionId,
          base32TotpSecret);
      _cardDetailsModel.setCardDetails(cardDetails);
    } on Exception catch (e) {
      throw QRCodeParseException(e.toString());
    }
  }
}
