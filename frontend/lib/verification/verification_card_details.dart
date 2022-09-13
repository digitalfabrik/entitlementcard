import 'package:ehrenamtskarte/identification/base_card_details.dart';

class VerificationCardDetails {
  final BaseCardDetails cardDetails;
  final int otp;

  VerificationCardDetails(this.cardDetails, this.otp);
}
