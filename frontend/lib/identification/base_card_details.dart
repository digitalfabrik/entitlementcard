class BaseCardDetails {
  final String fullName;
  final List<int> randomBytes;
  final int unixExpirationDate;
  final String cardType;
  final int regionId;
  final DateTime expirationDate;

  BaseCardDetails(this.fullName, this.randomBytes, this.unixExpirationDate,
      this.cardType, this.regionId)
      : expirationDate =
            DateTime.fromMillisecondsSinceEpoch(unixExpirationDate * 1000);
}
