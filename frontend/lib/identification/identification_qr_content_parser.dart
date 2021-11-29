import 'dart:convert';
import 'dart:typed_data';

import 'package:base32/base32.dart';

import '../qr_code_scanner/qr_code_processor.dart';
import 'base_card_details.dart';
import 'card_details.dart';
import 'card_details_model.dart';
import 'protobuf/card_activate_model.pb.dart';

class QRCodeInvalidTotpSecretException extends QrCodeParseException {
  QRCodeInvalidTotpSecretException() : super("invalid totp secret");
}

class QRCodeInvalidExpiryException extends QrCodeParseException {
  QRCodeInvalidExpiryException() : super("invalid expiry date");
}

class QRCodeMissingExpiryException extends QrCodeFieldMissingException {
  QRCodeMissingExpiryException() : super("expirationDate");
}

class QRCodeInvalidFormatException extends QrCodeParseException {
  final Exception? cause;
  final StackTrace? stackTrace;

  QRCodeInvalidFormatException([this.cause, this.stackTrace])
      : super("invalid format${cause == null ? "" : " (${cause.toString()})"}");
}

class IdentificationQrContentParser {
  final CardDetailsModel _cardDetailsModel;

  IdentificationQrContentParser(this._cardDetailsModel);

  void processQrCodeContent(String rawBase64Content) {
    const base64Decoder = Base64Decoder();

    CardActivateModel cardActivateModel;
    try {
      var rawProtobufData = base64Decoder.convert(rawBase64Content);
      cardActivateModel = CardActivateModel.fromBuffer(rawProtobufData);
    } on Exception catch (e, stackTrace) {
      throw QRCodeInvalidFormatException(e, stackTrace);
    }

    if (!cardActivateModel.hasFullName()) {
      throw QrCodeFieldMissingException("fullName");
    }
    if (!cardActivateModel.hasHashSecret()) {
      throw QrCodeFieldMissingException("hashSecret");
    }

    final unixInt64ExpirationDate = cardActivateModel.expirationDate;
    int? unixExpirationDate;
    if (unixInt64ExpirationDate > 0) {
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
    if (!cardActivateModel.hasTotpSecret()) {
      throw QrCodeFieldMissingException("totpSecret");
    }
    String? base32TotpSecret;
    try {
      base32TotpSecret =
          base32.encode(Uint8List.fromList(cardActivateModel.totpSecret));
    } on Exception catch (_) {
      throw QRCodeInvalidTotpSecretException();
    }

    final cardDetails = CardDetails(
        cardActivateModel.fullName,
        const Base64Encoder().convert(cardActivateModel.hashSecret),
        unixExpirationDate,
        cardType,
        cardActivateModel.regionId,
        base32TotpSecret);
    _cardDetailsModel.setCardDetails(cardDetails);
  }
}
