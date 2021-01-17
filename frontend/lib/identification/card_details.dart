import 'package:meta/meta.dart';

class CardDetails {
  final String fullName;
  final String randomBytes;
  final int expirationDate;
  final String totpSecret;
  final String cardType;
  final String region;

  CardDetails(
      {@required this.fullName,
      @required this.randomBytes,
      @required this.expirationDate,
      @required this.totpSecret,
      @required this.cardType,
      @required this.region});
}
