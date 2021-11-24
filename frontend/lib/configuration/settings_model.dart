import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

const hideVerificationInfoPropertyName = "hideVerificationInfo";

class SettingsModel extends ChangeNotifier {
  var _firstStart = false;
  var _hideVerificationInfo = false;
  var _locationFeatureEnabled = false;

  SharedPreferences? _preferences;

  Future<SettingsModel> initialize() async {
    try {
      _preferences = await SharedPreferences.getInstance();
      _firstStart = await loadFirstStart();
      _hideVerificationInfo = await loadHideVerificationInfo();
      _locationFeatureEnabled = await loadLocationFeatureEnabled();
    } on Exception {
      _preferences?.clear();
    }
    return this;
  }

  Future<bool> loadFirstStart() async {
    return _preferences?.getBool("firstStart") ?? true;
  }

  // default false
  Future<void> setFirstStart(enabled) async {
    _firstStart = enabled;
    notifyListeners();
    await _preferences?.setBool("firstStart", enabled);
  }

  Future<bool> loadHideVerificationInfo() async {
    return _preferences?.getBool(hideVerificationInfoPropertyName) ?? false;
  }

  // default true
  Future<void> setHideVerificationInfo(enabled) async {
    _hideVerificationInfo = enabled;
    notifyListeners();
    await _preferences?.setBool(hideVerificationInfoPropertyName, enabled);
  }

  Future<bool> loadLocationFeatureEnabled() async {
    return _preferences?.getBool("location") ?? true;
  }

  Future<void> setLocationFeatureEnabled(enabled) async {
    _locationFeatureEnabled = enabled;
    notifyListeners();
    await _preferences?.setBool("location", enabled);
  }

  get firstStart => _firstStart;

  get hideVerificationInfo => _hideVerificationInfo;

  get locationFeatureEnabled => _locationFeatureEnabled;

  @override
  String toString() {
    return 'SettingsModel{_firstStart: $_firstStart, _hideVerificationInfo: $_hideVerificationInfo, _locationFeatureEnabled: $_locationFeatureEnabled}';
  }
}
