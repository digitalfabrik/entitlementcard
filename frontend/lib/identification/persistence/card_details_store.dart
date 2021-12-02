import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../base_card_details.dart';
import '../card_details.dart';

const dataVersionKey = "dataVersion";
const fullNameKey = "fullName";
const hashSecretBase64Key = "hashSecretBase64";
const regionIdKey = "regionId";
const unixExpirationDateKey = "unixExpirationDate";
const cardTypeKey = "cardType";
const totpSecretBase32Key = "totpSecretBase32";

const invalidDataVersion = -1;

const currentDataVersion = 4;

Future<void> saveCardDetails(CardDetails? cardDetails) async {
  const storage = FlutterSecureStorage();
  if (cardDetails != null) {
    await Future.wait([
      storage.write(key: dataVersionKey, value: currentDataVersion.toString()),
      storage.write(key: fullNameKey, value: cardDetails.fullName),
      storage.write(key: hashSecretBase64Key, value: cardDetails.hashSecretBase64),
      storage.write(key: regionIdKey, value: cardDetails.regionId.toString()),
      storage.write(
        key: unixExpirationDateKey,
        value: cardDetails.unixExpirationDate != null ? cardDetails.unixExpirationDate.toString() : "0",
      ),
      storage.write(key: cardTypeKey, value: cardDetails.cardType.index.toString()),
      storage.write(key: totpSecretBase32Key, value: cardDetails.totpSecretBase32),
    ]);
  } else {
    await Future.wait([
      storage.delete(key: dataVersionKey),
      storage.delete(key: fullNameKey),
      storage.delete(key: unixExpirationDateKey),
      storage.delete(key: regionIdKey),
      storage.delete(key: cardTypeKey),
    ]);
  }
}

Future<CardDetails?> loadCardDetails() async {
  const storage = FlutterSecureStorage();
  final storedDataVersion = await storage.read(key: dataVersionKey);
  if (storedDataVersion == null) {
    return null;
  }
  final dataVersion = int.parse(storedDataVersion);
  if (dataVersion != currentDataVersion) {
    throw Exception(
      "Can't load data because the versions don't match. "
      "Stored version: $dataVersion, "
      "current version $currentDataVersion",
    );
  }
  final fullName = await storage.read(key: fullNameKey);
  final hashSecretBase64 = await storage.read(key: hashSecretBase64Key);

  var storedUnixExpirationDate = await storage.read(key: unixExpirationDateKey);
  if (storedUnixExpirationDate == null) {
    throw Exception("Can't load expiration date.");
  }
  final unixExpirationDate = int.parse(storedUnixExpirationDate);

  final storedRegionId = await storage.read(key: regionIdKey);
  if (storedRegionId == null) {
    throw Exception("Can't load region id.");
  }
  final regionId = int.parse(storedRegionId);

  final storedCardType = await storage.read(key: cardTypeKey);
  if (storedCardType == null) {
    throw Exception("Can't load region id.");
  }
  final cardType = CardType.values[int.parse(storedCardType)];
  final totpSecret = await storage.read(key: totpSecretBase32Key);
  if (totpSecret == null) {
    throw Exception("Can't load totp secret.");
  }

  return CardDetails(fullName, hashSecretBase64, unixExpirationDate, cardType, regionId, totpSecret);
}
