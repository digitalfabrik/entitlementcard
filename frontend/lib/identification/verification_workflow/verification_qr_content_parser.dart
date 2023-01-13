import 'dart:convert';

import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';

class VerificationParseException extends QrCodeParseException {
  final String internalMessage;
  final Exception cause;
  final StackTrace? stackTrace;

  VerificationParseException({required this.internalMessage, required this.cause, this.stackTrace})
      : super(internalMessage);
}

DynamicVerifyCode parseQRCodeContent(String rawBase64Content) {
  const base64Decoder = Base64Decoder();

  // TODO (Max): Refactor into Dart extension
  QrCode qrcode;
  try {
    qrcode = QrCode.fromBuffer(base64Decoder.convert(rawBase64Content));
  } on Exception catch (e, stackTrace) {
    throw VerificationParseException(
      internalMessage: "Failed to parse QrCode from base64 encoded data. "
          "Message: ${e.toString()}",
      cause: e,
      stackTrace: stackTrace,
    );
  }

  // TODO: Allow to parse and verify StaticVerifyCodes.
  if (!qrcode.hasDynamicVerifyCode()) {
    throw QrCodeWrongTypeException();
  }
  return qrcode.dynamicVerifyCode;
}
