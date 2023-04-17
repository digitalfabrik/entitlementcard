import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

const hideVerificationInfoPropertyName = "hideVerificationInfo";

class SettingsModel extends ChangeNotifier {
  var _firstStart = false;
  var _hideVerificationInfo = false;
  var _locationFeatureEnabled = false;
  var _staging = false;

  SharedPreferences? _preferences;

  Future<SettingsModel> initialize() async {
    try {
      _preferences = await SharedPreferences.getInstance();
      _firstStart = await loadFirstStart();
      _hideVerificationInfo = await loadHideVerificationInfo();
      _locationFeatureEnabled = await loadLocationFeatureEnabled();
      _staging = await loadStaging();
    } on Exception {
      _preferences?.clear();
    }
    return this;
  }

  Future<void> clearPreferences() async {
    _preferences?.clear();
  }

  Future<bool> loadFirstStart() async {
    return _preferences?.getBool("firstStart") ?? true;
  }

  // default false
  Future<void> setFirstStart({required bool enabled}) async {
    _firstStart = enabled;
    notifyListeners();
    await _preferences?.setBool("firstStart", enabled);
  }

  Future<bool> loadStaging() async {
    return _preferences?.getBool("staging") ?? false;
  }

  // default false
  Future<void> setStaging({required bool enabled}) async {
    _staging = enabled;
    notifyListeners();
    await _preferences?.setBool("staging", enabled);
  }

  Future<bool> loadHideVerificationInfo() async {
    return _preferences?.getBool(hideVerificationInfoPropertyName) ?? false;
  }

  // default true
  Future<void> setHideVerificationInfo({required bool enabled}) async {
    _hideVerificationInfo = enabled;
    notifyListeners();
    await _preferences?.setBool(hideVerificationInfoPropertyName, enabled);
  }

  Future<bool> loadLocationFeatureEnabled() async {
    return _preferences?.getBool("location") ?? true;
  }

  Future<void> setLocationFeatureEnabled({required bool enabled}) async {
    _locationFeatureEnabled = enabled;
    notifyListeners();
    await _preferences?.setBool("location", enabled);
  }

  bool get firstStart => _firstStart;

  bool get hideVerificationInfo => _hideVerificationInfo;

  bool get locationFeatureEnabled => _locationFeatureEnabled;

  bool get staging => _staging;

  @override
  String toString() {
    return 'SettingsModel{_firstStart: $_firstStart, _hideVerificationInfo: $_hideVerificationInfo, _locationFeatureEnabled: $_locationFeatureEnabled, _staging:$_staging}';
  }
}
