import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:ehrenamtskarte/location/determine_position.dart';
import 'package:geolocator/geolocator.dart';

const hideVerificationInfoPropertyName = "hideVerificationInfo";

class SettingsModel extends ChangeNotifier {
  var _firstStart = false;
  var _hideVerificationInfo = false;
  var _locationFeatureEnabled = false;

  late SharedPreferences _preferences;

  Future<SettingsModel> initialize() async {
    _preferences = await SharedPreferences.getInstance();
    _firstStart = await loadFirstStart();
    _hideVerificationInfo = await loadHideVerificationInfo();
    _locationFeatureEnabled = await loadLocationFeatureEnabled();
    return this;
  }

  Future<bool> loadFirstStart() async {
    return _preferences.getBool("firstStart") ?? true;
  }

  // default false
  Future<void> setFirstStart(enabled) async {
    _firstStart = enabled;
    notifyListeners();
    await _preferences.setBool("firstStart", enabled);
  }

  Future<bool> loadHideVerificationInfo() async {
    return _preferences.getBool(hideVerificationInfoPropertyName) ?? false;
  }

  // default true
  Future<void> setHideVerificationInfo(enabled) async {
    _hideVerificationInfo = enabled;
    notifyListeners();
    await _preferences.setBool(hideVerificationInfoPropertyName, enabled);
  }

  Future<bool> loadLocationFeatureEnabled() async {
    var permission = await Geolocator.checkPermission();

    if (permission.toLocationStatus().isPermissionGranted()) {
      return true;
    }

    return _preferences.getBool("location") ?? true;
  }

  Future<void> setLocationFeatureEnabled(enabled) async {
    _locationFeatureEnabled = enabled;
    notifyListeners();
    await _preferences.setBool("location", enabled);
  }

  get firstStart => _firstStart;

  get hideVerificationInfo => _hideVerificationInfo;

  get locationFeatureEnabled => _locationFeatureEnabled;
}
