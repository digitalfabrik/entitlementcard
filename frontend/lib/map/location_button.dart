import 'package:flutter/material.dart';

import '../location/determine_position.dart';
import '../widgets/small_button_spinner.dart';
import 'map/map_controller.dart';

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
              backgroundColor: theme.backgroundColor,
              child: AnimatedSwitcher(
                child: _status == LocationPermissionStatus.requestFinished
                    ? Icon(Icons.my_location,
                        color: theme.colorScheme.secondary)
                    : SmallButtonSpinner(),
                duration: Duration(milliseconds: 200),
              ),
              onPressed: _status == LocationPermissionStatus.requestFinished
                  ? _onPressed
                  : null,
            )));
  }

  _onPressed() async {
    setState(() => _status = LocationPermissionStatus.requesting);
    try {
      await determinePosition(userInteractContext: context);
      setState(() => _status = LocationPermissionStatus.requestFinished);
      await widget.mapController.bringCameraToUser();
    } on Exception catch (e) {
      print(e);
    } finally {
      setState(() => _status = LocationPermissionStatus.requestFinished);
    }
  }
}
