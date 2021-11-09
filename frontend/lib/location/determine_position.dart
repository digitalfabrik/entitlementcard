import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:geolocator/geolocator.dart';
import 'package:maplibre_gl/mapbox_gl.dart';

import 'location_permission_dialog.dart';
import 'location_service_dialog.dart';

enum LocationStatus {
  /// This is the initial state on both Android and iOS, but on Android the
  /// user can still choose to deny permissions, meaning the App can still
  /// request for permission another time.
  denied,

  /// Permission to access the device's location is permenantly denied. When
  /// requestiong permissions the permission dialog will not been shown until
  /// the user updates the permission in the App settings.
  deniedForever,

  /// Permission to access the device's location is allowed only while
  /// the App is in use.
  whileInUse,

  /// Permission to access the device's location is allowed even when the
  /// App is running in the background.
  always,
  
  /// Requesting the location is not supported by this device. On Android
  /// the reason for this could be that the location service is not
  /// enabled.
  notSupported
}

extension GeolocatorExtension on LocationPermission {
  LocationStatus toLocationStatus() {
    switch (this) {
      case LocationPermission.denied:
        return LocationStatus.denied;
      case LocationPermission.deniedForever:
        return LocationStatus.deniedForever;
      case LocationPermission.whileInUse:
        return LocationStatus.whileInUse;
      case LocationPermission.always:
        return LocationStatus.always;
    }
  }
}

extension GrantedExtension on LocationStatus {
  bool isPermissionGranted() {
    return this == LocationStatus.always ||
        this == LocationStatus.whileInUse;
  }
}


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

  if (!permission.isPermissionGranted()) {
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
Future<LocationStatus> checkAndRequestLocationPermission(
    BuildContext context,
    {bool requestIfNotGranted = true}) async {
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
    
    if (!await Geolocator.isLocationServiceEnabled()) {
      return LocationStatus.notSupported;
    }
  }

  var permission = await Geolocator.checkPermission();

  if (requestIfNotGranted) {
    if (permission == LocationPermission.denied) {
      final requestedPermission = await Geolocator.requestPermission();

      if (requestedPermission == LocationPermission.deniedForever) {
        await openSettingsToGrantPermissions(context);
      }
      return requestedPermission.toLocationStatus();
    } else if (permission == LocationPermission.deniedForever) {
      await openSettingsToGrantPermissions(context);
      return permission.toLocationStatus();
    }
  }

  return permission.toLocationStatus();
}

Future<void> openSettingsToGrantPermissions(BuildContext context) async {
  var result = await showDialog(
      context: context, builder: (context) => const LocationPermissionDialog());
  if (result) {
    await Geolocator.openAppSettings();
  }
}

