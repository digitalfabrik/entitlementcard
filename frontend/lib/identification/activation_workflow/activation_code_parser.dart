import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/verification_qr_code_processor.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/verification_qr_content_parser.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';

class QRCodeInvalidTotpSecretException extends QrCodeParseException {
  QRCodeInvalidTotpSecretException() : super("invalid totp secret");
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
    final QrCode qrCode = rawBase64Content.parseQRCodeContent();

    if (!qrCode.hasDynamicActivationCode()) {
      throw QrCodeWrongTypeException();
    }

    final DynamicActivationCode activationCode = qrCode.dynamicActivationCode;

    assertConsistentCardInfo(activationCode.info);
    _assertConsistentDynamicActivationCode(activationCode);

    return activationCode;
  }

  void _assertConsistentDynamicActivationCode(DynamicActivationCode code) {
    if (!code.hasPepper()) {
      throw QrCodeFieldMissingException("hashSecretBase64");
    }
    if (!code.hasTotpSecret()) {
      throw QrCodeFieldMissingException("totpSecret");
    }
  }
}
