import 'package:ehrenamtskarte/location/determine_position.dart';
import 'package:ehrenamtskarte/map/map/map_controller.dart';
import 'package:flutter/material.dart';

class LocationButton extends StatefulWidget {
  final MapController mapController;

  const LocationButton({Key key, this.mapController}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _LocationButtonState();
  }
}

enum LocationPermissionStatus { requesting, requestFinished }

class _LocationButtonState extends State<LocationButton> {
  LocationPermissionStatus _status = LocationPermissionStatus.requestFinished;

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    return Align(
        alignment: Alignment.bottomRight,
        child: Padding(
            padding: EdgeInsets.all(10),
            child: FloatingActionButton(
              elevation: 1,
              backgroundColor: Colors.white,
              child: _status == LocationPermissionStatus.requestFinished
                  ? Icon(Icons.my_location, color: theme.accentColor)
                  : CircularProgressIndicator(),
              onPressed: _status == LocationPermissionStatus.requestFinished
                  ? _onPressed
                  : null,
            )));
  }

  _onPressed() async {
    setState(() => _status = LocationPermissionStatus.requesting);
    try {
      await determinePosition(userInteract: true);
      setState(() => _status = LocationPermissionStatus.requestFinished);
      await widget.mapController.bringCameraToUser();
    } finally {
      setState(() => _status = LocationPermissionStatus.requestFinished);
    }
  }
}
