import 'dart:convert';

import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

const activationCodeBase64Key = "activationCodeBase64";

class ActivationCodeStore {
  const ActivationCodeStore();

  static const _activationCodeBase64Key = "activationCodeBase64";

  Future<void> store(DynamicActivationCode activationCode) async {
    const storage = FlutterSecureStorage();
    await storage.write(
      key: _activationCodeBase64Key,
      value: const Base64Encoder().convert(activationCode.writeToBuffer()),
    );
  }

  Future<void> remove() async {
    const storage = FlutterSecureStorage();
    await storage.delete(key: _activationCodeBase64Key);
  }

  Future<DynamicActivationCode?> load() async {
    const storage = FlutterSecureStorage();
    final String? activationCodeBase64 = await storage.read(key: _activationCodeBase64Key);
    if (activationCodeBase64 == null) return null;
    return DynamicActivationCode.fromBuffer(const Base64Decoder().convert(activationCodeBase64));
  }
}
