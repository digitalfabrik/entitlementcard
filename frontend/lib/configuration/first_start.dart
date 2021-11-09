import 'dart:developer';

import 'package:shared_preferences/shared_preferences.dart';

Future<bool> isFirstStart() async {
  try {
    final sharedPreferences = await SharedPreferences.getInstance();
    if (sharedPreferences.containsKey("firstStart")) {
      return sharedPreferences.getBool("firstStart") ?? false;
    } else {
      return true;
    }
  } on Exception catch (e) {
    log("Failed to check if isFirstStart()", error: e);
    return false;
  }
}

Future<void> setFirstStart({bool isFirstStart = false}) async {
  try {
    final sharedPreferences = await SharedPreferences.getInstance();
    sharedPreferences.setBool("firstStart", isFirstStart).catchError((e) {
      log("Failed to save firstStart", error: e);
    });
  } on Exception catch (e) {
    log("Failed to check if isFirstStart()", error: e);
  }
}
