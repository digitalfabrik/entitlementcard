import 'card_details.dart';

class PersonalCardDetails {
  final String base32TotpSecret;
  final CardDetails cardDetails;

  PersonalCardDetails(this.base32TotpSecret, this.cardDetails);
}
