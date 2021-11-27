
import 'package:flutter/services.dart';

class LocationFFI {
  static const platform = MethodChannel('app.ehrenamtskarte/location');

  static Future<bool> isLocationServiceEnabled() async {
    try {
      final bool result = await platform.invokeMethod('isLocationServiceEnabled');
      return result;
    } on PlatformException catch (e) {
      throw "Failed to get state of location services: '${e.message}'.";
    }
  }
}
