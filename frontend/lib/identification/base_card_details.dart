enum CardType { standard, gold }

class BaseCardDetails {
  final String fullName;
  final String hashSecretBase64;
  final CardType cardType;
  final int regionId;
  final int? unixExpirationDate;
  final DateTime? expirationDate;

  BaseCardDetails(this.fullName, this.hashSecretBase64, this.unixExpirationDate, this.cardType, this.regionId)
      : expirationDate = unixExpirationDate != null && unixExpirationDate > 0
            ? DateTime.fromMillisecondsSinceEpoch(unixExpirationDate * 1000)
            : null;
}
