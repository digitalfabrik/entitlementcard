import 'dart:async' show Future;
import 'package:location_permissions/location_permissions.dart';

Future<PermissionStatus> requestLocationPermissionIfFirstTry(
    LocationPermissionLevel level) async {
  var status = await LocationPermissions().checkPermissionStatus(level: level);
  if (status == PermissionStatus.denied) {
    return await LocationPermissions()
        .requestPermissions(permissionLevel: level);
  }
  return status;
}
