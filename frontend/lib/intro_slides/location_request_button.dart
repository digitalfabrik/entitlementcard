import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';

import '../location/determine_position.dart';

class LocationRequestButton extends StatefulWidget {
  const LocationRequestButton({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() => _LocationRequestButtonState();
}

class _LocationRequestButtonState extends State<LocationRequestButton> {
  LocationPermission? _locationPermissionStatus;

  _LocationRequestButtonState() {
    checkAndRequestLocationPermission(context, requestIfNotGranted: false)
        .then(_setInitialLocationStatus);
  }

  void _setInitialLocationStatus(LocationPermission permission) {
    setState(() {
      _locationPermissionStatus = permission;
    });
  }

  void _onLocationButtonClicked() async {
    final permission = await checkAndRequestLocationPermission(context);
    setState(() {
      _locationPermissionStatus = permission;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_locationPermissionStatus == null) {
      return const ElevatedButton(
        onPressed: null,
        child: Text("Prüfe Einstellungen..."),
      );
    }
    switch (_locationPermissionStatus) {
      case LocationPermission.denied:
        return ElevatedButton(
          onPressed: _onLocationButtonClicked,
          child: const Text("Ich möchte meinen Standort freigeben."),
        );
      case LocationPermission.whileInUse:
      case LocationPermission.always:
        return const ElevatedButton(
          onPressed: null,
          child: Text("Standort ist bereits freigegeben."),
        );
      case LocationPermission.deniedForever:
        return const ElevatedButton(
          onPressed: null,
          child: Text("Standort ist nicht freigegeben."),
        );
      default:
        return const Text("Ein unerwarteter Fehler ist aufgetreten.");
    }
  }
}
