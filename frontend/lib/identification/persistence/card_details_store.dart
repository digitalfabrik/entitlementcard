import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../card_details.dart';

const dataVersionKey = "dataVersion";
const fullNameKey = "fullName";
const randomBytesKey = "randomBytes";
const regionKey = "regionId";
const unixExpirationDateKey = "unixExpirationDate";
const cardTypeKey = "cardType";
const base32TotpSecretKey = "totpSecret";

const currentDataVersion = 1;

Future<void> saveCardDetails(CardDetails cardDetails) async {
  final storage = FlutterSecureStorage();
  var futures = <Future<void>>[];
  if (cardDetails != null) {
    futures.add(storage.write(
        key: dataVersionKey, value: currentDataVersion.toString()));
    futures.add(storage.write(key: fullNameKey, value: cardDetails.fullName));
    final base64RandomBytes = Base64Encoder().convert(cardDetails.randomBytes);
    futures.add(storage.write(key: randomBytesKey, value: base64RandomBytes));
    futures.add(
        storage.write(key: regionKey, value: cardDetails.regionId.toString()));
    futures.add(storage.write(
        key: unixExpirationDateKey,
        value: cardDetails.unixExpirationDate.toString()));
    futures.add(storage.write(key: cardTypeKey, value: cardDetails.cardType));
    futures.add(storage.write(
        key: base32TotpSecretKey, value: cardDetails.base32TotpSecret));
  } else {
    futures.add(storage.delete(key: dataVersionKey));
    futures.add(storage.delete(key: fullNameKey));
    futures.add(storage.delete(key: unixExpirationDateKey));
    futures.add(storage.delete(key: regionKey));
    futures.add(storage.delete(key: cardTypeKey));
  }
  await Future.wait(futures);
}

Future<CardDetails> loadCardDetails() async {
  final storage = FlutterSecureStorage();
  final hasDataVersionKey = await storage.containsKey(key: dataVersionKey);
  if (hasDataVersionKey) {
    final storedDataVersionStr = await storage.read(key: dataVersionKey);
    final storedDataVersion = int.parse(storedDataVersionStr);
    if (storedDataVersion != currentDataVersion) {
      print("Can't load data because the versions don't match. "
          "Stored version: $storedDataVersion, "
          "current version $currentDataVersion");
      storage.delete(key: dataVersionKey);
      return null;
    }
    final fullName = await storage.read(key: fullNameKey);
    final base64RandomBytes = await storage.read(key: randomBytesKey);
    final randomBytes = Base64Decoder().convert(base64RandomBytes);
    final unixExpirationDate =
        int.parse(await storage.read(key: unixExpirationDateKey));
    final regionId = int.parse(await storage.read(key: regionKey));
    final cardType = await storage.read(key: cardTypeKey);
    final totpSecret = await storage.read(key: base32TotpSecretKey);

    return CardDetails(fullName, randomBytes.toList(), unixExpirationDate,
        cardType, regionId, totpSecret);
  } else {
    return null;
  }
}
