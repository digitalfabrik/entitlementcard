class BaseCardDetails {
  final String fullName;
  final String hashSecretBase64;
  final int unixExpirationDate;
  final String cardType;
  final int regionId;
  final DateTime expirationDate;

  BaseCardDetails(this.fullName, this.hashSecretBase64, this.unixExpirationDate,
      this.cardType, this.regionId)
      : expirationDate =
            DateTime.fromMillisecondsSinceEpoch(unixExpirationDate * 1000);
}
