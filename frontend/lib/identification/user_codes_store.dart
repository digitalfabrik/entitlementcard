import 'dart:convert';

import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

const userCodeBase64Key = 'userCodeBase64';

class UserCodesStore {
  const UserCodesStore();

  static const _userCodesBase64Key = 'userCodesBase64';

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
}
