import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:geolocator/geolocator.dart';

import 'location_permission_dialog.dart';
import 'location_service_dialog.dart';

/// Determine the current position of the device.
///
/// When the location services are not enabled or permissions
/// are denied the `Future` will return an `PositionNotAvailableException`.
Future<Position> determinePosition({BuildContext userInteractContext}) async {
  await requestPermissionToDeterminePosition(
      userInteractContext: userInteractContext);
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
Future<void> requestPermissionToDeterminePosition(
    {BuildContext userInteractContext}) async {
  var serviceEnabled = await Geolocator.isLocationServiceEnabled();
  if (!serviceEnabled) {
    if (userInteractContext != null) {
      var result = await showDialog(
          context: userInteractContext,
          builder: (context) => LocationServiceDialog());
      if (result == true) {
        await Geolocator.openLocationSettings();
      }
    }
    throw PositionNotAvailableException('Location service was disabled.');
  }

  var permission = await Geolocator.checkPermission();
  if (permission == LocationPermission.deniedForever) {
    if (userInteractContext != null) {
      var result = await showDialog(
          context: userInteractContext,
          builder: (context) => LocationPermissionDialog());
      if (result == true) {
        return await Geolocator.openAppSettings();
      }
    }
    throw PositionNotAvailableException(
        'Location permissions were permanently denied.');
  }

  if (permission == LocationPermission.denied) {
    if (userInteractContext != null) {
      permission = await Geolocator.requestPermission();
      if (permission != LocationPermission.whileInUse &&
          permission != LocationPermission.always) {
        throw PositionNotAvailableException(
            'Location permissions are denied (actual value: $permission).');
      }
    } else {
      throw PositionNotAvailableException("Location permissions were denied");
    }
  }
}

Future<bool> canDetermineLocation({BuildContext userInteractContext}) async {
  try {
    await requestPermissionToDeterminePosition(
        userInteractContext: userInteractContext);
    return true;
  } on PositionNotAvailableException catch (e) {
    debugPrint(e.reason);
    return false;
  }
}

Future<bool> checkQuietIfLocationIsEnabled() async {
  try {
    final locationPermission = await Geolocator.checkPermission();
    var isLocationEnabled = false;
    switch (locationPermission) {
      case LocationPermission.denied:
        isLocationEnabled = false;
        break;
      case LocationPermission.deniedForever:
        isLocationEnabled = false;
        break;
      case LocationPermission.whileInUse:
        isLocationEnabled = true;
        break;
      case LocationPermission.always:
        isLocationEnabled = true;
        break;
    }
    return isLocationEnabled;
  } on Exception catch (e) {
    print(e);
    return false;
  }
}

class PositionNotAvailableException implements Exception {
  final String reason;

  PositionNotAvailableException(this.reason);

  String toString() => "PositionNotAvailableException: $reason";
}
