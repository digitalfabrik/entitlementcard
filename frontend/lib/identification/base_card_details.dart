enum CardType { standard, gold }

class BaseCardDetails {
  final String fullName;
  final List<int> pepper;
  final CardType cardType;
  final int regionId;

  // Days since 1970-01-01. For more information refer to the card.proto
  final int? expirationDay;
  final DateTime? expirationDate;

  BaseCardDetails(this.fullName, this.pepper, this.expirationDay, this.cardType, this.regionId)
      : expirationDate = expirationDay != null && expirationDay > 0
            ? DateTime.fromMillisecondsSinceEpoch(0).add(Duration(days: expirationDay))
            : null;
}
