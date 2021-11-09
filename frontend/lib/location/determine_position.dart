import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:geolocator/geolocator.dart';
import 'package:maplibre_gl/mapbox_gl.dart';

import 'dialogs.dart';

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

  if (requestIfNotGranted) {
    var permission = await Geolocator.checkPermission();
    
    if (permission == LocationPermission.deniedForever) {
      // denied forever -> open UI
      if (await openSettingsToGrantPermissions(context)) {
        // get new result after the dialog is flo
        var permission = await Geolocator.checkPermission();
        return permission.toLocationStatus();
      }
    
      return permission.toLocationStatus();
    } else if (permission == LocationPermission.denied) {
      // The result of the permission dialog was to deny the permission
      // Usually the next check says that it it denied forever
      final requestResult = await Geolocator.requestPermission();
      // if requestResult == LocationPermission.deniedForever, then the dialog
      // was closed without a result.
      if (permission == LocationPermission.denied) {
        // in this case the user clicked "Deny" in the UI. We could display here an explanatory UI.
      }

      return requestResult.toLocationStatus();
    }

    return permission.toLocationStatus();
  } else {
    var permission = await Geolocator.checkPermission();
    return permission.toLocationStatus();
  }
}

Future<bool> openSettingsToGrantPermissions(BuildContext context) async {
  var result = await showDialog(
      context: context, builder: (context) => const LocationPermissionDialog()) ?? false;
  if (result) {
    return await Geolocator.openAppSettings();
  }
  
  return false;
}

