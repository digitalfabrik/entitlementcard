import '../card_details.dart';
import '../jwt/parse_jwt.dart';

CardDetails parseQRCodeContent(String rawContent) {
  var payload = parseJwtPayLoad(rawContent);
  String fullName = payload["fullName"];

  if (fullName == null) {
    throw Exception("Name konnte nicht aus QR Code gelesen werden.");
  }

  final randomBytes = payload["randomBytes"];
  final expirationDate = payload["expirationDate"];
  final cardType = payload["cardType"];
  final totpSecret = payload["totpSecret"];
  String region = payload["region"];

  return CardDetails(
      fullName: fullName,
      randomBytes: randomBytes,
      expirationDate: expirationDate,
      cardType: cardType,
      totpSecret: totpSecret,
      region: region);
}
