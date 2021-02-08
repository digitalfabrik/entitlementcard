import 'base_card_details.dart';

class CardDetails extends BaseCardDetails {
  final String totpSecretBase32;

  CardDetails(fullName, randomBytes, unixExpirationDate, cardType, regionId,
      this.totpSecretBase32)
      : super(fullName, randomBytes, unixExpirationDate, cardType, regionId);
}
