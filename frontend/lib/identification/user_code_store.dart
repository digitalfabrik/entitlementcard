import 'dart:convert';
import 'dart:io';

import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/sentry.dart';
import 'package:flutter/services.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'package:ehrenamtskarte/util/read_write_lock.dart';

class UserCodeStore {
  final _storage = ReadWriteLock(FlutterSecureStorage());
  static const _userCodesBase64Key = 'userCodesBase64';

  // legacy key for single card
  static const _legacyUserCodeBase64Key = 'userCodeBase64';
  static const _storageDelimiter = ',';

  Future<void> store(List<DynamicUserCode> userCodes) async {
    String userCodesString =
        userCodes.map((code) => const Base64Encoder().convert(code.writeToBuffer())).join(_storageDelimiter);
    await _storage.use((it) => it.write(key: _userCodesBase64Key, value: userCodesString));
  }

  Future<void> remove() async {
    await _storage.use((it) => it.delete(key: _userCodesBase64Key));
  }

  Future<List<DynamicUserCode>> load() async {
    String? userCodesBase64 = await _storage.use((storage) async {
      return await _safeRead(storage, _userCodesBase64Key);
    });

    if (userCodesBase64 == null) return [];
    return userCodesBase64
        .split(_storageDelimiter)
        .map((code) => DynamicUserCode.fromBuffer(const Base64Decoder().convert(code)))
        .toList();
  }

  // legacy import of existing card to keep them in storage after update
  Future<DynamicUserCode?> loadAndDeleteLegacyCard() async {
    return await _storage.use((storage) async {
      final String? userCodeBase64 = await _safeRead(storage, _legacyUserCodeBase64Key);
      if (userCodeBase64 == null) return null;
      DynamicUserCode importedLegacyCard = DynamicUserCode.fromBuffer(const Base64Decoder().convert(userCodeBase64));
      await storage.delete(key: _legacyUserCodeBase64Key);
      return importedLegacyCard;
    });
  }
}

/// This function deletes the secure storage in the situation that the app data was backed up (e.g. on a new device),
/// but the secret is no longer available.
/// Upstream issue: https://github.com/juliansteenbakker/flutter_secure_storage/issues/354
Future<String?> _safeRead(FlutterSecureStorage storage, String key) async {
  try {
    return await storage.read(key: key);
  } on PlatformException catch (e, stackTrace) {
    if (Platform.isAndroid && e.toString().contains('javax.crypto.BadPaddingException')) {
      reportError(
          'Could not read the key $key from secure storage probably due to wrong or missing secret caused by a backup. '
          'Deleting secure storage on purpose to resolve the situation and trying again. Original Error: $e',
          stackTrace);
      await storage.deleteAll();
      return await storage.read(key: key);
    } else {
      rethrow;
    }
  }
}
