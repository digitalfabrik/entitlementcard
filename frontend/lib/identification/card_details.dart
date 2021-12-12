import 'base_card_details.dart';

class CardDetails extends BaseCardDetails {
  final String totpSecretBase32;

  CardDetails(
    String fullName,
    String randomBytes,
    int? unixExpirationDate,
    CardType cardType,
    int regionId,
    this.totpSecretBase32,
  ) : super(fullName, randomBytes, unixExpirationDate, cardType, regionId);
}
