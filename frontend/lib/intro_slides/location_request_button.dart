import 'package:flutter/material.dart';
import '../location/determine_position.dart';

class LocationRequestButton extends StatefulWidget {
  const LocationRequestButton({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() => _LocationRequestButtonState();
}

class _LocationRequestButtonState extends State<LocationRequestButton> {
  LocationStatus? _locationPermissionStatus;

  @override
  void initState() {
    super.initState();
    checkAndRequestLocationPermission(context, requestIfNotGranted: false)
        .then((LocationStatus permission) => setState(() {
              _locationPermissionStatus = permission;
            }));
  }

  void _onLocationButtonClicked() async {
    final permission = await checkAndRequestLocationPermission(context,
        requestIfNotGranted: true);
    setState(() {
      _locationPermissionStatus = permission;
    });
  }

  @override
  Widget build(BuildContext context) {
    var status = _locationPermissionStatus;
    if (status == null) {
      return const ElevatedButton(
        onPressed: null,
        child: Text("Prüfe Einstellungen..."),
      );
    }
    switch (status) {
      case LocationStatus.denied:
      case LocationStatus.deniedForever:
      case LocationStatus.notSupported:
        return ElevatedButton(
          onPressed: _onLocationButtonClicked,
          child: const Text("Ich möchte meinen Standort freigeben."),
        );
      case LocationStatus.whileInUse:
      case LocationStatus.always:
        return const ElevatedButton(
          onPressed: null,
          child: Text("Standort ist bereits freigegeben."),
        );
    }
  }
}
