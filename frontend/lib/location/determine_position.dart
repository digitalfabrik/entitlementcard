import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:geolocator/geolocator.dart';
import 'package:maplibre_gl/mapbox_gl.dart';

import 'location_permission_dialog.dart';
import 'location_service_dialog.dart';

class RequestedPosition {
  Position? position;

  RequestedPosition(this.position);

  RequestedPosition.unknown() : position = null;

  bool isAvailable() {
    return position != null;
  }

  LatLng? toLatLng() {
    final currentPosition = position;
    return currentPosition != null
        ? LatLng(currentPosition.latitude, currentPosition.longitude)
        : null;
  }
}

/// Determine the current position of the device.
Future<RequestedPosition> determinePosition(BuildContext context,
    {bool requestIfNotGranted = false}) async {
  final permission = await checkAndRequestLocationPermission(context,
      requestIfNotGranted: requestIfNotGranted);

  if (!_isPermissionGranted(permission)) {
    return RequestedPosition.unknown();
  }

  var position = await Geolocator.getLastKnownPosition();
  position ??= await Geolocator.getCurrentPosition();

  return RequestedPosition(position);
}

/// Ensures all preconditions needed to determine the current position.
/// If needed, location permissions are requested.
///
/// When the location services are not enabled then it will return
/// LocationPermission.deniedForever
Future<LocationPermission> checkAndRequestLocationPermission(
    BuildContext context,
    {bool requestIfNotGranted = false}) async {
  var serviceEnabled = await Geolocator.isLocationServiceEnabled();
  if (!serviceEnabled) {
    if (requestIfNotGranted) {
      final result = await showDialog(
          context: context,
          builder: (context) => const LocationServiceDialog());
      if (result) {
        await Geolocator.openLocationSettings();
      }
    }
    return LocationPermission.deniedForever;
  }

  var permission = await Geolocator.checkPermission();

  if (requestIfNotGranted != null && requestIfNotGranted) {
    if (permission == LocationPermission.denied) {
      final requestedPermission = await Geolocator.requestPermission();

      if (requestedPermission == LocationPermission.deniedForever) {
        await openSettingsToGrantPermissions(context);
      }
      return requestedPermission;
    } else if (permission == LocationPermission.deniedForever) {
      await openSettingsToGrantPermissions(context);
      return permission;
    }
  }

  return permission;
}

Future<void> openSettingsToGrantPermissions(BuildContext context) async {
  var result = await showDialog(
      context: context, builder: (context) => const LocationPermissionDialog());
  if (result) {
    await Geolocator.openAppSettings();
  }
}

bool _isPermissionGranted(LocationPermission permission) {
  return permission == LocationPermission.always ||
      permission == LocationPermission.whileInUse;
}
