import 'dart:convert';

import 'package:ehrenamtskarte/identification/user_codes_model.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

const userCodeBase64Key = 'userCodeBase64';

class UserCodesStore {
  const UserCodesStore();

  static const _userCodesBase64Key = 'userCodesBase64';
  // legacy key for single card
  static const _userCodeBase64Key = 'userCodeBase64';

  Future<void> store(List<DynamicUserCode> userCodes) async {
    const storage = FlutterSecureStorage();
    Iterable<String> userCodeString = userCodes.map((code) => const Base64Encoder().convert(code.writeToBuffer()));

    await storage.write(key: _userCodesBase64Key, value: userCodeString.join(','));
  }

  Future<void> remove() async {
    const storage = FlutterSecureStorage();
    await storage.delete(key: _userCodesBase64Key);
  }

  Future<List<DynamicUserCode>?> load() async {
    const storage = FlutterSecureStorage();
    final String? userCodesBase64 = await storage.read(key: _userCodesBase64Key);
    if (userCodesBase64 == null) return null;
    return userCodesBase64
        .split(',')
        .map((code) => DynamicUserCode.fromBuffer(const Base64Decoder().convert(code)))
        .toList();
  }

  // legacy import for single cards to keep compatible after update
  Future<void> importLegacyCard() async {
    const storage = FlutterSecureStorage();
    final String? userCodeBase64 = await storage.read(key: _userCodeBase64Key);
    if (userCodeBase64 == null) return;
    DynamicUserCode importedLegacyCard = DynamicUserCode.fromBuffer(const Base64Decoder().convert(userCodeBase64));
    UserCodesModel().setCode(importedLegacyCard);
    await storage.delete(key: _userCodesBase64Key);
  }
}
