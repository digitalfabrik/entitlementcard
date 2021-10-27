import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:geolocator/geolocator.dart';

import 'location_permission_dialog.dart';
import 'location_service_dialog.dart';

class RequestedPosition {
  Position position;

  RequestedPosition(this.position);

  bool isAvailable() {
    return position != null;
  }
}

/// Determine the current position of the device.
///
Future<RequestedPosition> determinePosition(
    {BuildContext userInteractContext, bool requestIfNotGranted}) async {
  if (requestIfNotGranted) {
    final permission = await checkAndRequestLocationPermission(
        userInteractContext: userInteractContext);

    if (!isPermissionGranted(permission)) {
      return RequestedPosition(null);
    }
  }

  if (!isPermissionGranted(await checkQuietLocationPermission())) {
    return RequestedPosition(null);
  }

  var position = await Geolocator.getLastKnownPosition();
  position ??= await Geolocator.getCurrentPosition();
  if (position == null) {
    return RequestedPosition(null);
  }
  return RequestedPosition(position);
}

/// Ensures all preconditions needed to determine the current position.
/// If needed, location permissions are requested.
///
/// When the location services are not enabled or permissions
/// are denied the `Future` will return with an `PositionNotAvailableException`.
/// Else it will complete without a value.
Future<LocationPermission> checkAndRequestLocationPermission(
    {BuildContext userInteractContext, bool askIfDeniedForever}) async {
  var serviceEnabled = await Geolocator.isLocationServiceEnabled();
  if (!serviceEnabled) {
    if (userInteractContext != null) {
      var result = await showDialog(
          context: userInteractContext,
          builder: (context) => const LocationServiceDialog());
      if (result) {
        await Geolocator.openLocationSettings();
      }
    }
    return LocationPermission.deniedForever;
  }

  var permission = await Geolocator.checkPermission();
  if (permission == LocationPermission.denied) {
    final requestedPermission = await Geolocator.requestPermission();

    if (requestedPermission == LocationPermission.deniedForever) {
      await openSettingsToGrantPermissions(userInteractContext); 
    }
    return requestedPermission;
  } else if (permission == LocationPermission.deniedForever) {
    await openSettingsToGrantPermissions(userInteractContext);
    return permission;
  }
  return permission;
}

Future<void> openSettingsToGrantPermissions(
    BuildContext userInteractContext) async {
  if (userInteractContext != null) {
    var result = await showDialog(
        context: userInteractContext,
        builder: (context) => const LocationPermissionDialog());
    if (result) {
      await Geolocator.openAppSettings();
    }
  }
}

bool isPermissionGranted(LocationPermission permission) {
  return permission == LocationPermission.always ||
      permission == LocationPermission.whileInUse;
}

Future<LocationPermission> checkQuietLocationPermission() async {
  final permission = await Geolocator.checkPermission();
  return permission;
}

class PositionNotAvailableException implements Exception {
  final String reason;

  PositionNotAvailableException(this.reason);

  @override
  String toString() => "PositionNotAvailableException: $reason";
}
