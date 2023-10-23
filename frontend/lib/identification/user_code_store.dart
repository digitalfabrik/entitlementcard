import 'dart:convert';

import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class UserCodeStore {
  const UserCodeStore();

  static const _userCodesBase64Key = 'userCodesBase64';
  // legacy key for single card
  static const _userCodeBase64Key = 'userCodeBase64';
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
    final String? userCodesBase64 = await storage.read(key: _userCodesBase64Key);
    if (userCodesBase64 == null) return [];
    return userCodesBase64
        .split(_storageDelimiter)
        .map((code) => DynamicUserCode.fromBuffer(const Base64Decoder().convert(code)))
        .toList();
  }

  // legacy import of existing card to keep them in storage after update
  Future<void> importLegacyCard() async {
    const storage = FlutterSecureStorage();
    final String? userCodeBase64 = await storage.read(key: _userCodeBase64Key);
    if (userCodeBase64 == null) return;
    DynamicUserCode importedLegacyCard = DynamicUserCode.fromBuffer(const Base64Decoder().convert(userCodeBase64));
    UserCodeModel().insertCode(importedLegacyCard);
    await storage.delete(key: _userCodeBase64Key);
  }
}
