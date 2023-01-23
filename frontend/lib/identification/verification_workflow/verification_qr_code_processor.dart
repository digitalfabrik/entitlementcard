import 'package:ehrenamtskarte/identification/activation_workflow/activation_code_parser.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/verification_qr_content_parser.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';

DynamicVerifyCode processQrCodeContent(String rawBase64Content) {
  final qrcode = rawBase64Content.parseQRCodeContent();

  if (!qrcode.hasDynamicVerifyCode()) {
    throw QrCodeWrongTypeException();
  }

  final verifyCode = qrcode.dynamicVerifyCode;
  assertConsistentCardInfo(verifyCode.info);
  _assertConsistentDynamicVerifyCode(verifyCode);
  return verifyCode;
}

void assertConsistentCardInfo(CardInfo cardInfo) {
  if (!cardInfo.hasFullName()) {
    throw QrCodeFieldMissingException("fullName");
  }
  if (!cardInfo.hasExpirationDay() && cardInfo.extensions.extensionBavariaCardType.cardType != BavariaCardType.GOLD) {
    throw QRCodeMissingExpiryException();
  }
  final expirationDate = cardInfo.hasExpirationDay()
      ? DateTime.fromMicrosecondsSinceEpoch(0).add(Duration(days: cardInfo.expirationDay))
      : null;
  if (expirationDate != null) {
    if (DateTime.now().isAfterDate(expirationDate)) {
      throw CardExpiredException(expirationDate);
    }
  }
}

void _assertConsistentDynamicVerifyCode(DynamicVerifyCode verifyCode) {
  if (!verifyCode.hasPepper()) {
    throw QrCodeFieldMissingException("hashSecretBase64");
  }
  if (verifyCode.otp <= 0) {
    throw QrCodeFieldMissingException("otp");
  }
}

extension DateComparison on DateTime {
  bool isAfterDate(DateTime other) {
    if (isAfter(other)) return true;
    return year == other.year && month == other.month && day == other.day;
  }
}

class CardExpiredException extends QrCodeParseException {
  final DateTime expiry;

  CardExpiredException(this.expiry) : super("card already expired");
}
