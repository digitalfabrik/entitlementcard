class CardDetails {
  final String fullName;
  final int unixExpirationDate;
  final String cardType;
  final int regionId;
  final DateTime expirationDate;

  CardDetails(
      this.fullName, this.unixExpirationDate, this.cardType, this.regionId)
      : expirationDate =
            DateTime.fromMillisecondsSinceEpoch(unixExpirationDate * 1000);
}
