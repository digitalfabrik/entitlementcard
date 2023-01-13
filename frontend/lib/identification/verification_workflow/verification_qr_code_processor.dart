import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/identification/verification_workflow/verification_qr_content_parser.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';

DynamicVerifyCode processQrCodeContent(String rawBase64Content) {
  final verifyCode = parseQRCodeContent(rawBase64Content);
  _assertConsistentCardDetails(verifyCode);
  return verifyCode;
}

void _assertConsistentCardDetails(DynamicVerifyCode verifyCode) {
  final cardInfo = verifyCode.info;
  if (cardInfo.fullName.isEmpty) {
    throw QrCodeFieldMissingException("fullName");
  }
  if (!cardInfo.hasExpirationDay() && cardInfo.extensions.extensionBavariaCardType.cardType != BavariaCardType.GOLD) {
    throw QrCodeFieldMissingException("expirationDate");
  }
  if (verifyCode.pepper.isEmpty) {
    throw QrCodeFieldMissingException("hashSecretBase64");
  }
  final expirationDate = cardInfo.hasExpirationDay()
      ? DateTime.fromMicrosecondsSinceEpoch(0).add(Duration(days: cardInfo.expirationDay))
      : null;
  if (expirationDate != null) {
    if (DateTime.now().isAfterDate(expirationDate)) {
      throw CardExpiredException(expirationDate);
    }
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
