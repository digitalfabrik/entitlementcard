import 'package:geolocator/geolocator.dart';
import 'package:mutex/mutex.dart';

Mutex _mutex = Mutex();
bool _doNotAskForPermissionAgain = false;

/// Determine the current position of the device.
///
/// When the location services are not enabled or permissions
/// are denied the `Future` will return an `PositionNotAvailableException`.
Future<Position> determinePosition() async {
  await requestPermissionToDeterminePosition();
  return await Geolocator.getCurrentPosition();
}

/// Ensures all preconditions needed to determine the current position.
/// If needed, location permissions are requested.
///
/// When the location services are not enabled or permissions
/// are denied the `Future` will return with an `PositionNotAvailableException`.
/// Else it will complete without a value.
Future<void> requestPermissionToDeterminePosition() async {
  var serviceEnabled = await Geolocator.isLocationServiceEnabled();
  if (!serviceEnabled) {
    throw PositionNotAvailableException('Location services are disabled.');
  }

  // Geolocator will fail if permissions are requested again before previous
  // request was finished.
  await _mutex.protect(() async {
    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.deniedForever ||
        _doNotAskForPermissionAgain) {
      throw PositionNotAvailableException(
          'Location permissions are permantly denied.');
    }

    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission != LocationPermission.whileInUse &&
          permission != LocationPermission.always) {
        _doNotAskForPermissionAgain = true;
        throw PositionNotAvailableException(
            'Location permissions are denied (actual value: $permission).');
      }
    }
  });
}

class PositionNotAvailableException implements Exception {
  final String reason;
  PositionNotAvailableException(this.reason);
  String toString() => "PositionNotAvailableException: $reason";
}
