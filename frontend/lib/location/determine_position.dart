import 'package:flutter/widgets.dart';
import 'package:geolocator/geolocator.dart';

/// Determine the current position of the device.
///
/// When the location services are not enabled or permissions
/// are denied the `Future` will return an `PositionNotAvailableException`.
Future<Position> determinePosition({bool userInteract}) async {
  await requestPermissionToDeterminePosition(userInteract: userInteract);
  var position = await Geolocator.getLastKnownPosition();
  if (position == null) {
    position = await Geolocator.getCurrentPosition();
  }
  if (position == null) {
    throw PositionNotAvailableException("Could not determine position.");
  }
  return position;
}

/// Ensures all preconditions needed to determine the current position.
/// If needed, location permissions are requested.
///
/// When the location services are not enabled or permissions
/// are denied the `Future` will return with an `PositionNotAvailableException`.
/// Else it will complete without a value.
Future<void> requestPermissionToDeterminePosition({bool userInteract}) async {
  var serviceEnabled = await Geolocator.isLocationServiceEnabled();
  if (!serviceEnabled) {
    if (userInteract) {
      await Geolocator.openLocationSettings();
    } else {
      throw PositionNotAvailableException('Location services are disabled.');
    }
  }

  var permission = await Geolocator.checkPermission();
  if (permission == LocationPermission.deniedForever) {
    if (userInteract) {
      Geolocator.openAppSettings();
    } else {
      throw PositionNotAvailableException(
          'Location permissions are permantly denied.');
    }
  }

  if (permission == LocationPermission.denied) {
    if (userInteract) {
      permission = await Geolocator.requestPermission();
      if (permission != LocationPermission.whileInUse &&
          permission != LocationPermission.always) {
        throw PositionNotAvailableException(
            'Location permissions are denied (actual value: $permission).');
      }
    } else {
      throw PositionNotAvailableException("Location permissions are denied");
    }
  }
}

Future<bool> canDetermineLocation({ bool userInteract }) async {
  try {
    await requestPermissionToDeterminePosition(userInteract: userInteract);
    return true;
  } on PositionNotAvailableException catch (e) {
    debugPrint(e.reason);
    return false;
  }
}


class PositionNotAvailableException implements Exception {
  final String reason;

  PositionNotAvailableException(this.reason);

  String toString() => "PositionNotAvailableException: $reason";
}
