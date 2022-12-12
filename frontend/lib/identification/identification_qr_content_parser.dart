import 'dart:convert';
import 'dart:typed_data';

import 'package:base32/base32.dart';
import 'package:ehrenamtskarte/identification/base_card_details.dart';
import 'package:ehrenamtskarte/identification/card_details.dart';
import 'package:ehrenamtskarte/identification/card_details_model.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/qr_code_scanner/qr_code_processor.dart';

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

    // TODO (Max): Refactor into Dart extension
    CardActivationCode activationCode;
    try {
      final rawProtobufData = base64Decoder.convert(rawBase64Content);
      activationCode = CardActivationCode.fromBuffer(rawProtobufData);
    } on Exception catch (e, stackTrace) {
      throw QRCodeInvalidFormatException(e, stackTrace);
    }

    final cardInfo = activationCode.info;
    if (!cardInfo.hasFullName()) {
      throw QrCodeFieldMissingException("fullName");
    }
    if (!activationCode.hasHashSecret()) {
      throw QrCodeFieldMissingException("hashSecret");
    }

    int? expirationDay;
    if (!cardInfo.hasExpirationDay()) {
      expirationDay = null;
    } else {
      expirationDay = cardInfo.expirationDay;
    }

    final bavarianCardType = cardInfo.extensions.extensionBavariaCardType.cardType;

    if (bavarianCardType == BavariaCardType.STANDARD && expirationDay == null) {
      throw QRCodeMissingExpiryException();
    }

    final cardType = CardType.values[bavarianCardType.value]; // FIXME: Insecure mapping
    if (!activationCode.hasTotpSecret()) {
      throw QrCodeFieldMissingException("totpSecret");
    }
    String? base32TotpSecret;
    try {
      base32TotpSecret = base32.encode(Uint8List.fromList(activationCode.totpSecret));
    } on Exception catch (_) {
      throw QRCodeInvalidTotpSecretException();
    }

    final cardDetails = CardDetails(
      cardInfo.fullName,
      const Base64Encoder().convert(activationCode.hashSecret),
      expirationDay,
      cardType,
      cardInfo.extensions.extensionRegion.regionId,
      base32TotpSecret,
    );
    _cardDetailsModel.setCardDetails(cardDetails);
  }
}
