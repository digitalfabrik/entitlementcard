import 'dart:convert';

import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';

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

class ActivationCodeParser {
  const ActivationCodeParser();

  DynamicActivationCode parseQrCodeContent(String rawBase64Content) {
    QrCode qrCode;
    try {
      qrCode = QrCode.fromBuffer(const Base64Decoder().convert(rawBase64Content));
    } on Exception catch (e, stackTrace) {
      throw QRCodeInvalidFormatException(e, stackTrace);
    }

    if (!qrCode.hasDynamicActivationCode()) {
      throw QrCodeWrongTypeException();
    }

    final DynamicActivationCode activationCode = qrCode.dynamicActivationCode;

    final cardInfo = activationCode.info;
    if (!cardInfo.hasFullName()) {
      throw QrCodeFieldMissingException("fullName");
    }
    if (!activationCode.hasPepper()) {
      throw QrCodeFieldMissingException("pepper");
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

    if (!activationCode.hasTotpSecret()) {
      throw QrCodeFieldMissingException("totpSecret");
    }

    return qrCode.dynamicActivationCode;
  }
}
