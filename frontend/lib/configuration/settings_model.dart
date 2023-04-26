import 'dart:developer';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SettingsModel extends ChangeNotifier {
  SharedPreferences? _preferences;

  Future<void> initialize() async {
    if (_preferences != null) {
      // Already initialized
      return;
    }

    _preferences = await SharedPreferences.getInstance();
  }

  Future<void> clearSettings() async {
    await _preferences?.clear();
    notifyListeners();
  }

  bool? _getBool(String key) {
    final obj = _preferences?.get(key);
    if (obj == null) {
      return null;
    } else if (obj is! bool) {
      log("Preference key $key has wrong type: Expected bool, but got ${obj.runtimeType}. Returning fallback.",
          level: 1000);
      return null;
    }
    return obj;
  }

  String? _getString(String key) {
    final obj = _preferences?.get(key);
    if (obj == null) {
      return null;
    } else if (obj is! String) {
      log("Preference key $key has wrong type: Expected bool, but got ${obj.runtimeType}. Returning fallback.",
          level: 1000);
      return null;
    }
    return obj;
  }

  bool get cardValid => _getBool("cardValid") ?? false;

  Future<void> setCardValid({required bool valid}) async {
    await _preferences?.setBool("cardValid", valid);
    notifyListeners();
  }

  String? get lastCardVerification => _getString("lastCardVerification");

  Future<void> setLastCardVerification({required String lastVerification}) async {
    await _preferences?.setString("lastCardVerification", lastVerification);
    notifyListeners();
  }

  bool get firstStart => _getBool("firstStart") ?? true;

  Future<void> setFirstStart({required bool enabled}) async {
    await _preferences?.setBool("firstStart", enabled);
    notifyListeners();
  }

  bool get enableStaging => _getBool("enableStaging") ?? false;

  Future<void> setEnableStaging({required bool enabled}) async {
    await _preferences?.setBool("enableStaging", enabled);
    notifyListeners();
  }

  bool get hideVerificationInfo => _getBool("hideVerificationInfo") ?? true;

  Future<void> setHideVerificationInfo({required bool enabled}) async {
    await _preferences?.setBool("hideVerificationInfo", enabled);
    notifyListeners();
  }

  bool get locationFeatureEnabled => _getBool("location") ?? false;

  Future<void> setLocationFeatureEnabled({required bool enabled}) async {
    await _preferences?.setBool("location", enabled);
    notifyListeners();
  }

  @override
  String toString() {
    return 'SettingsModel{firstStart: $firstStart, hideVerificationInfo: $hideVerificationInfo, locationFeatureEnabled: $locationFeatureEnabled, enableStaging:$enableStaging, lastCardVerification: $lastCardVerification, cardValid: $cardValid}';
  }
}
