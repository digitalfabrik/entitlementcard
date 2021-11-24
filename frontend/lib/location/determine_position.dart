import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:geolocator/geolocator.dart';
import 'package:maplibre_gl/mapbox_gl.dart';
import 'package:provider/provider.dart';

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
    return this == LocationStatus.always || this == LocationStatus.whileInUse;
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
    {bool requestIfNotGranted = false,
    Future<void> Function()? onDisableFeature}) async {
  final permission = await checkAndRequestLocationPermission(context,
      requestIfNotGranted: requestIfNotGranted,
      onDisableFeature: onDisableFeature);

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
Future<LocationStatus> checkAndRequestLocationPermission(BuildContext context,
    {bool requestIfNotGranted = true,
    rationale =
        "Erlauben Sie der App Ihren Standort zu benutzen, um Akzeptanzstellen in Ihrer Umgebung anzuzeigen.",
    Future<void> Function()? onDisableFeature}) async {
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
      // Permissions are denied forever, handle appropriately.
      return LocationPermission.deniedForever.toLocationStatus();
    } else if (permission == LocationPermission.denied) {
      final requestResult = await Geolocator.requestPermission();

      if (requestResult == LocationPermission.denied) {
        // Permissions are denied, next time you could try
        // requesting permissions again (this is also where
        // Android's shouldShowRequestPermissionRationale
        // returned true. According to Android guidelines
        // your App should show an explanatory UI now.

        if (rationale != null) {
          final result = await showDialog(
              context: context,
              builder: (context) => RationaleDialog(rationale: rationale));

          if (result ?? false) {
            return await checkAndRequestLocationPermission(context,
                requestIfNotGranted: requestIfNotGranted, rationale: rationale);
          }
        }

        return LocationPermission.denied.toLocationStatus();
      } else if (requestResult == LocationPermission.deniedForever) {
        // Permissions are denied forever, handle appropriately.
        // If requestResult == LocationPermission.deniedForever, then the dialog
        // was closed without a result or the permission was denied
        if (onDisableFeature != null) {
          await onDisableFeature();
        }
        return LocationPermission.deniedForever.toLocationStatus();
      }

      return requestResult.toLocationStatus();
    }

    return permission.toLocationStatus();
  } else {
    var permission = await Geolocator.checkPermission();
    return permission.toLocationStatus();
  }
}

Future<void> openSettingsToGrantPermissions(
    BuildContext userInteractContext) async {
  await Geolocator.openAppSettings();
}
