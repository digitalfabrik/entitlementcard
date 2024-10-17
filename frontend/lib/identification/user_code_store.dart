import 'dart:convert';
import 'dart:io';

import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/sentry.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class UserCodeStore {
  const UserCodeStore();

  static const _userCodesBase64Key = 'userCodesBase64';

  // legacy key for single card
  static const _legacyUserCodeBase64Key = 'userCodeBase64';
  static const _storageDelimiter = ',';

  Future<void> store(List<DynamicUserCode> userCodes) async {
    const storage = FlutterSecureStorage();
    Iterable<String> userCodeString = userCodes.map((code) => const Base64Encoder().convert(code.writeToBuffer()));
    await storage.write(key: _userCodesBase64Key, value: userCodeString.join(_storageDelimiter));
  }

  Future<void> remove() async {
    const storage = FlutterSecureStorage();
    await storage.delete(key: _userCodesBase64Key);
  }

  Future<List<DynamicUserCode>> load() async {
    const storage = FlutterSecureStorage();
    String? userCodesBase64;
    // make fake read on android - workaround for https://github.com/mogol/flutter_secure_storage/issues/653
    if (Platform.isAndroid) {
      String? userCodesBase64FirstRead = await storage.read(key: _userCodesBase64Key);
      userCodesBase64 = await storage.read(key: _userCodesBase64Key);
      // report error if first read is null but second read contains data to collect sentry data for reproduction
      if (userCodesBase64FirstRead != userCodesBase64) {
        bool firstIsNull = userCodesBase64FirstRead == null;
        bool secondIsNull = userCodesBase64 == null;
        reportError(
            'First read from secure storage differs from second: firstNull=$firstIsNull, secondNull=$secondIsNull',
            null);
      }
    } else {
      userCodesBase64 = await storage.read(key: _userCodesBase64Key);
    }

    if (userCodesBase64 == null) return [];
    return userCodesBase64
        .split(_storageDelimiter)
        .map((code) => DynamicUserCode.fromBuffer(const Base64Decoder().convert(code)))
        .toList();
  }

  // legacy import of existing card to keep them in storage after update
  Future<DynamicUserCode?> loadAndDeleteLegacyCard() async {
    const storage = FlutterSecureStorage();
    final String? userCodeBase64 = await storage.read(key: _legacyUserCodeBase64Key);
    if (userCodeBase64 == null) return null;
    DynamicUserCode importedLegacyCard = DynamicUserCode.fromBuffer(const Base64Decoder().convert(userCodeBase64));
    await storage.delete(key: _legacyUserCodeBase64Key);
    return importedLegacyCard;
  }
}
