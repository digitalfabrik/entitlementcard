import 'dart:typed_data';

import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';

class VerificationParseException extends QrCodeParseException {
  final String internalMessage;
  final Exception cause;
  final StackTrace? stackTrace;

  VerificationParseException({required this.internalMessage, required this.cause, this.stackTrace})
    : super(internalMessage);
}

extension QRParsing on Uint8List {
  QrCode parseQRCodeContent() {
    QrCode qrcode;
    try {
      qrcode = QrCode.fromBuffer(this);
    } on Exception catch (e, stackTrace) {
      throw VerificationParseException(
        internalMessage: 'Failed to parse QrCode from encoded data. Message: ${e.toString()}',
        cause: e,
        stackTrace: stackTrace,
      );
    }

    return qrcode;
  }
}

Uint8List createDynamicVerificationQrCodeData(DynamicUserCode userCode, int otpCode) {
  return (QrCode()
        ..dynamicVerificationCode = (DynamicVerificationCode()
          ..info = userCode.info
          ..pepper = userCode.pepper
          ..otp = otpCode))
      .writeToBuffer();
}
