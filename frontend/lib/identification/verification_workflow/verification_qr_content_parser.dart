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

extension QRParsing on String {
  QrCode parseQRCodeContent() {
    const base64Decoder = Base64Decoder();

    QrCode qrcode;
    try {
      qrcode = QrCode.fromBuffer(base64Decoder.convert(this));
    } on Exception catch (e, stackTrace) {
      throw VerificationParseException(
        internalMessage: "Failed to parse QrCode from base64 encoded data. "
            "Message: ${e.toString()}",
        cause: e,
        stackTrace: stackTrace,
      );
    }

    return qrcode;
  }
}
