import 'package:flutter/services.dart';

const platform = MethodChannel('app.entitlementcard/location');

/// Checks whether location services are enabled
/// without using Google Play Services
Future<bool> isNonGoogleLocationServiceEnabled() async {
  try {
    final bool result = await platform.invokeMethod('isLocationServiceEnabled') as bool;
    return result;
  } on PlatformException catch (e) {
    throw 'Failed to get state of location services: "${e.message}".';
  }
}
