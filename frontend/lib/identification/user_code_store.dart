import 'dart:convert';

import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

const userCodeBase64Key = 'userCodeBase64';
// TODO remove when import is finished
@Deprecated('is needed to load old card data to new structure')
class UserCodeStore {
  const UserCodeStore();

  static const _userCodeBase64Key = 'userCodeBase64';

  Future<void> store(DynamicUserCode userCode) async {
    const storage = FlutterSecureStorage();
    await storage.write(
      key: _userCodeBase64Key,
      value: const Base64Encoder().convert(userCode.writeToBuffer()),
    );
  }

  Future<void> remove() async {
    const storage = FlutterSecureStorage();
    await storage.delete(key: _userCodeBase64Key);
  }

  Future<DynamicUserCode?> load() async {
    const storage = FlutterSecureStorage();
    final String? userCodeBase64 = await storage.read(key: _userCodeBase64Key);
    if (userCodeBase64 == null) return null;
    return DynamicUserCode.fromBuffer(const Base64Decoder().convert(userCodeBase64));
  }
}
