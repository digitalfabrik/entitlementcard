enum CardType { standard, gold }

class BaseCardDetails {
  final String fullName;
  final String hashSecretBase64;
  final int unixExpirationDate;
  final CardType cardType;
  final int regionId;
  final DateTime expirationDate;

  BaseCardDetails(this.fullName, this.hashSecretBase64, this.unixExpirationDate,
      this.cardType, this.regionId)
      : expirationDate = unixExpirationDate != null
            ? DateTime.fromMillisecondsSinceEpoch(unixExpirationDate * 1000)
            : null;
}
