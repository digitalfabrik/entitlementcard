import 'base_card_details.dart';

class CardDetails extends BaseCardDetails {
  final String base32TotpSecret;

  CardDetails(fullName, randomBytes, unixExpirationDate, cardType, regionId,
      this.base32TotpSecret)
      : super(fullName, randomBytes, unixExpirationDate, cardType, regionId);
}
