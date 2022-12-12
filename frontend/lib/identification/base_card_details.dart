enum CardType { standard, gold }

const secondsPerDay = 60 * 60 * 24;
const millisecondsPerSecond = 1000;

class BaseCardDetails {
  final String fullName;
  final String hashSecretBase64;
  final CardType cardType;
  final int regionId;
  // Days since 1970-01-01. For more information refer to the card.proto
  final int? expirationDay;
  final DateTime? expirationDate;

  BaseCardDetails(this.fullName, this.hashSecretBase64, this.expirationDay, this.cardType, this.regionId)
      : expirationDate = expirationDay != null && expirationDay > 0
            ? DateTime.fromMillisecondsSinceEpoch(expirationDay * secondsPerDay * millisecondsPerSecond) // FIXME: this is not correct as a day is not always 24h :D
            : null;
}
