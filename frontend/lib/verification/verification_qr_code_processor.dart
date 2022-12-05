import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/verification/scanner/verification_qr_content_parser.dart';
import 'package:ehrenamtskarte/verification/verification_card_details.dart';

VerificationCardDetails processQrCodeContent(String rawBase64Content) {
  final cardDetails = parseQRCodeContent(rawBase64Content);
  _assertConsistentCardDetails(cardDetails);
  return cardDetails;
}

void _assertConsistentCardDetails(VerificationCardDetails verCardDetails) {
  final baseCardDetails = verCardDetails.cardDetails;
  if (baseCardDetails.fullName.isEmpty) {
    throw QrCodeFieldMissingException("fullName");
  }
  if (baseCardDetails.expirationDay == null &&
      baseCardDetails.cardType.index == BavariaCardType.STANDARD.value) { // FIXME: Insecure index comparision
    throw QrCodeFieldMissingException("expirationDate");
  }
  if (baseCardDetails.hashSecretBase64.isEmpty) {
    throw QrCodeFieldMissingException("hashSecretBase64");
  }
  final expirationDate = baseCardDetails.expirationDate;
  if (expirationDate != null) {
    final now = DateTime.now();
    if (expirationDate.isBefore(now)) {
      throw CardExpiredException(expirationDate);
    }
  }
  if (verCardDetails.otp <= 0) {
    throw QrCodeFieldMissingException("otp");
  }
}

class CardExpiredException extends QrCodeParseException {
  final DateTime expiry;

  CardExpiredException(this.expiry) : super("card already expired");
}
