import 'package:ehrenamtskarte/environment.dart';
import 'package:ehrenamtskarte/location/dialogs.dart';
import 'package:ehrenamtskarte/location/location_ffi.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:maplibre_gl/maplibre_gl.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

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
      case LocationPermission.unableToDetermine:
        return LocationStatus.notSupported;
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
  LocationStatus? locationStatus;

  RequestedPosition(this.position, this.locationStatus);

  RequestedPosition.unknown()
      : position = null,
        locationStatus = null;

  bool isAvailable() {
    return position != null;
  }

  LatLng? toLatLng() {
    final currentPosition = position;
    return currentPosition != null ? LatLng(currentPosition.latitude, currentPosition.longitude) : null;
  }
}

/// Determine the current position of the device.
Future<RequestedPosition> determinePosition(
  BuildContext context, {
  bool requestIfNotGranted = false,
}) async {
  final permission = await checkAndRequestLocationPermission(
    context,
    requestIfNotGranted: requestIfNotGranted,
  );

  if (!permission.isPermissionGranted()) {
    return RequestedPosition(null, permission);
  }

  var position = await Geolocator.getLastKnownPosition(forceAndroidLocationManager: EnvironmentConfig.androidFloss);
  position ??= await Geolocator.getCurrentPosition(forceAndroidLocationManager: EnvironmentConfig.androidFloss);

  return RequestedPosition(position, permission);
}

/// Ensures all preconditions needed to determine the current position.
/// If needed, location permissions are requested.
///

Future<LocationStatus> checkAndRequestLocationPermission(
  BuildContext context, {
  bool requestIfNotGranted = true,
}) async {
  final t = context.t;
  final serviceEnabled = EnvironmentConfig.androidFloss
      ? await isNonGoogleLocationServiceEnabled()
      : await Geolocator.isLocationServiceEnabled();
  if (!serviceEnabled) {
    if (requestIfNotGranted) {
      final bool? result =
          await showDialog<bool>(context: context, builder: (context) => const LocationServiceDialog());
      if (result == true) {
        await Geolocator.openLocationSettings();
      }
    }

    if (!await Geolocator.isLocationServiceEnabled()) {
      return LocationStatus.notSupported;
    }
  }

  if (requestIfNotGranted) {
    final permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.deniedForever) {
      return LocationPermission.deniedForever.toLocationStatus();
    } else if (permission == LocationPermission.denied) {
      final requestResult = await Geolocator.requestPermission();

      if (requestResult == LocationPermission.denied) {
        // Permissions are denied, next time you could try
        // requesting permissions again (this is also where
        // Android's shouldShowRequestPermissionRationale
        // returned true. According to Android guidelines
        // your App should show an explanatory UI now.

        final result = await showDialog(
            context: context,
            builder: (context) => RationaleDialog(rationale: t.location.activateLocationAccessRationale));

        if (result == true) {
          return checkAndRequestLocationPermission(
            context,
            requestIfNotGranted: requestIfNotGranted,
          );
        }

        return LocationPermission.denied.toLocationStatus();
      } else if (requestResult == LocationPermission.deniedForever) {
        return LocationPermission.deniedForever.toLocationStatus();
      }

      return requestResult.toLocationStatus();
    }

    return permission.toLocationStatus();
  } else {
    final permission = await Geolocator.checkPermission();
    return permission.toLocationStatus();
  }
}

Future<void> openSettingsToGrantPermissions(BuildContext userInteractContext) async {
  await Geolocator.openAppSettings();
}
