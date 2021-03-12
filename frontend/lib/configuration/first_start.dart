import 'package:shared_preferences/shared_preferences.dart';

Future<bool> isFirstStart() async {
  try {
    final sharedPreferences = await SharedPreferences.getInstance();
    if (sharedPreferences.containsKey("firstStart")) {
      return sharedPreferences.getBool("firstStart");
    } else {
      return true;
    }
  } on Exception catch (e) {
    print("Failed to check if isFirstStart(), error message: $e");
    return false;
  }
}

Future<void> setFirstStart({bool isFirstStart = false}) async {
  try {
    final sharedPreferences = await SharedPreferences.getInstance();
    sharedPreferences.setBool("firstStart", isFirstStart).catchError((e) {
      print("Failed to save firstStart, error message: $e");
    });
  } on Exception catch (e) {
    print("Failed to check if isFirstStart(), error message: $e");
  }
}
