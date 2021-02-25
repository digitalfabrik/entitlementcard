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

const currentDataVersion = 4;

Future<void> saveCardDetails(CardDetails cardDetails) async {
  final storage = FlutterSecureStorage();
  if (cardDetails != null) {
    await Future.wait([
      storage.write(key: dataVersionKey, value: currentDataVersion.toString()),
      storage.write(key: fullNameKey, value: cardDetails.fullName),
      storage.write(
          key: hashSecretBase64Key, value: cardDetails.hashSecretBase64),
      storage.write(key: regionIdKey, value: cardDetails.regionId.toString()),
      storage.write(
          key: unixExpirationDateKey,
          value: cardDetails.unixExpirationDate != null
              ? cardDetails.unixExpirationDate.toString()
              : "0"),
      storage.write(
          key: cardTypeKey, value: cardDetails.cardType.index.toString()),
      storage.write(
          key: totpSecretBase32Key, value: cardDetails.totpSecretBase32),
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

Future<CardDetails> loadCardDetails() async {
  final storage = FlutterSecureStorage();
  final hasDataVersionKey = await storage.containsKey(key: dataVersionKey);
  if (hasDataVersionKey) {
    final storedDataVersionStr = await storage.read(key: dataVersionKey);
    final storedDataVersion = int.parse(storedDataVersionStr);
    if (storedDataVersion != currentDataVersion) {
      throw Exception(("Can't load data because the versions don't match. "
          "Stored version: $storedDataVersion, "
          "current version $currentDataVersion"));
    }
    final fullName = await storage.read(key: fullNameKey);
    final hashSecretBase64 = await storage.read(key: hashSecretBase64Key);
    final unixExpirationDate =
        int.parse(await storage.read(key: unixExpirationDateKey));
    final regionId = int.parse(await storage.read(key: regionIdKey));
    final cardType =
        CardType.values[int.parse(await storage.read(key: cardTypeKey))];
    final totpSecret = await storage.read(key: totpSecretBase32Key);

    return CardDetails(fullName, hashSecretBase64, unixExpirationDate, cardType,
        regionId, totpSecret);
  } else {
    return null;
  }
}
