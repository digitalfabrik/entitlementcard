import '../identification/protobuf/card_activate_model.pb.dart';
import '../qr_code_scanner/qr_code_parser.dart';
import 'scanner/verification_qr_content_parser.dart';
import 'verification_card_details.dart';

VerificationCardDetails processQrCodeContent(String rawBase64Content) {
  VerificationCardDetails cardDetails;
  cardDetails = parseQRCodeContent(rawBase64Content);
  _assertConsistentCardDetails(cardDetails);
  return cardDetails;
}

void _assertConsistentCardDetails(VerificationCardDetails verCardDetails) {
  final baseCardDetails = verCardDetails.cardDetails;
  if (baseCardDetails.fullName == null || baseCardDetails.fullName.isEmpty) {
    throw QRCodeFieldMissingException("fullName");
  }
  if (baseCardDetails.regionId == null) {
    throw QRCodeFieldMissingException("regionId");
  }
  if (baseCardDetails.unixExpirationDate == null &&
      baseCardDetails.cardType == CardActivateModel_CardType.STANDARD.value) {
    throw QRCodeFieldMissingException("expirationDate");
  }
  if (baseCardDetails.hashSecretBase64 == null ||
      baseCardDetails.hashSecretBase64.isEmpty) {
    throw QRCodeFieldMissingException("hashSecretBase64");
  }
  if (baseCardDetails.expirationDate != null) {
    var now = DateTime.now();
    if (baseCardDetails.expirationDate.isBefore(now)) {
      throw CardExpiredException(baseCardDetails.expirationDate);
    }
  }
  if (verCardDetails.otp == null || verCardDetails.otp <= 0) {
    throw QRCodeFieldMissingException("otp");
  }
}

class CardExpiredException extends QRCodeParseException {
  final DateTime expiry;
  CardExpiredException(this.expiry) : super("card already expired");
}
