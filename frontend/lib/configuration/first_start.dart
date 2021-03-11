import 'package:shared_preferences/shared_preferences.dart';

Future<bool> isFirstStart() async {
  try {
    final sharedPreferences = await SharedPreferences.getInstance();
    if (sharedPreferences.containsKey("firstStart")) {
      return false;
    } else {
      sharedPreferences.setBool("firstStart", false).catchError((e) {
        print("Failed to save firstStart, error message: $e");
        return false;
      });
      return true;
    }
  } on Exception catch (e) {
    print("Failed to check if isFirstStart(), error message: $e");
    return false;
  }
}
