import 'package:shared_preferences/shared_preferences.dart';

const hideVerificationInfoPropertyName = "hideVerificationInfo";

Future<bool> hideVerificationInfo() async =>
    (await SharedPreferences.getInstance())
        .getBool(hideVerificationInfoPropertyName) ?? false;

Future<void> setHideVerificationInfo({bool hideVerificationInfo = true})
  async => (await SharedPreferences.getInstance())
        .setBool(hideVerificationInfoPropertyName, hideVerificationInfo);
