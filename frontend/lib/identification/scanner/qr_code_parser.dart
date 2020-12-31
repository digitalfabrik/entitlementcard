import '../card_details.dart';
import '../jwt/parse_jwt.dart';

CardDetails parseQRCodeContent(String rawContent) {
  var payload = parseJwtPayLoad(rawContent);
  String firstName = payload["firstName"];
  String lastName = payload["lastName"];

  if (firstName == null || lastName == null) {
    throw Exception("Name konnte nicht aus QR Code gelesen werden.");
  }

  final expirationDate = DateTime.parse(payload["expirationDate"]);
  String region = payload["region"] ?? "";

  return CardDetails(firstName, lastName, expirationDate, region);
}
