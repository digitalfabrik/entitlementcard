import 'dart:convert';

import 'package:ehrenamtskarte/identification/base_card_details.dart';
import 'package:ehrenamtskarte/identification/card_details.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

const dataVersionKey = "dataVersion";
const fullNameKey = "fullName";
const pepperBase64Key = "pepperBase64";
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
      storage.write(key: pepperBase64Key, value: const Base64Encoder().convert(cardDetails.pepper)),
      storage.write(key: regionIdKey, value: cardDetails.regionId.toString()),
      storage.write(
        key: unixExpirationDateKey,
        value: cardDetails.expirationDate != null ? cardDetails.expirationDay.toString() : "0",
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
  final String? fullName = await storage.read(key: fullNameKey);
  if (fullName == null) {
    throw Exception("Can't load full name.");
  }

  final String? pepperBase64 = await storage.read(key: pepperBase64Key);
  if (pepperBase64 == null) {
    throw Exception("Can't load pepper.");
  }
  final pepper = const Base64Decoder().convert(pepperBase64);

  final storedUnixExpirationDate = await storage.read(key: unixExpirationDateKey);
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

  return CardDetails(fullName, pepper, unixExpirationDate, cardType, regionId, totpSecret);
}
