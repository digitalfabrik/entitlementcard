import 'package:ehrenamtskarte/identification/base_card_details.dart';

class CardDetails extends BaseCardDetails {
  final String totpSecretBase32;

  CardDetails(
    super.fullName,
    super.randomBytes,
    super.expirationDay,
    super.cardType,
    super.regionId,
    this.totpSecretBase32,
  );
}
