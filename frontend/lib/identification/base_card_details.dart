enum CardType { standard, gold }

const dayInSeconds = 60 * 60 * 24;
const secondInMS = 1000;

class BaseCardDetails {
  final String fullName;
  final String hashSecretBase64;
  final CardType cardType;
  final int regionId;
  final int? expirationDay;
  final DateTime? expirationDate;

  BaseCardDetails(this.fullName, this.hashSecretBase64, this.expirationDay, this.cardType, this.regionId)
      : expirationDate = expirationDay != null && expirationDay > 0
            ? DateTime.fromMillisecondsSinceEpoch(expirationDay * dayInSeconds * secondInMS)
            : null;
}
