import 'dart:async' show Future;
import 'package:location_permissions/location_permissions.dart';

Future<PermissionStatus> requestLocationPermissionIfNotYetGranted(
    LocationPermissionLevel level) async {
  var status = await LocationPermissions().checkPermissionStatus(level: level);
  if (status == PermissionStatus.denied || status != PermissionStatus.unknown) {
    return await LocationPermissions()
        .requestPermissions(permissionLevel: level);
  }
  return status;
}
