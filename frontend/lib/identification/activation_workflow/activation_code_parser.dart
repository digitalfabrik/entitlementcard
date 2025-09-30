import 'dart:typed_data';

import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/identification/qr_content_parser.dart';
import 'package:ehrenamtskarte/identification/util/card_info_utils.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';

class QRCodeInvalidTotpSecretException extends QrCodeParseException {
  QRCodeInvalidTotpSecretException() : super('invalid totp secret');
}

class QRCodeMissingExpiryException extends QrCodeFieldMissingException {
  QRCodeMissingExpiryException() : super('expirationDate');
}

class ActivationCodeParser {
  const ActivationCodeParser();

  DynamicActivationCode parseQrCodeContent(Uint8List rawContent) {
    final QrCode qrCode = rawContent.parseQRCodeContent();

    if (!qrCode.hasDynamicActivationCode()) {
      throw QrCodeWrongTypeException(getQRCodeTypeMessage(qrCode));
    }

    final DynamicActivationCode activationCode = qrCode.dynamicActivationCode;

    assertConsistentCardInfo(activationCode.info);
    _assertConsistentDynamicActivationCode(activationCode);

    return activationCode;
  }

  void _assertConsistentDynamicActivationCode(DynamicActivationCode code) {
    if (!code.hasPepper()) {
      throw QrCodeFieldMissingException('pepper');
    }
    if (!code.hasActivationSecret()) {
      throw QrCodeFieldMissingException('activationSecret');
    }
  }
}

String getQRCodeTypeMessage(QrCode code) {
  if (code.hasDynamicVerificationCode()) {
    return 'dynamic verification code';
  }
  if (code.hasStaticVerificationCode()) {
    return 'static verification code';
  }
  if (code.hasDynamicActivationCode()) {
    return 'dynamic activation code';
  }
  return 'unknown code';
}
