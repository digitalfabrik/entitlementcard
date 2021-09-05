import 'package:flutter/material.dart';

import '../location/determine_position.dart';

class LocationRequestButton extends StatefulWidget {
  const LocationRequestButton({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() => _LocationRequestButtonState();
}

class _LocationRequestButtonState extends State<LocationRequestButton> {
  _LocationStatus _locationStatus = _LocationStatus.loading;

  _LocationRequestButtonState() {
    checkQuietIfLocationIsEnabled().then(_setInitialLocationStatus);
  }

  void _setInitialLocationStatus(bool isLocationEnabled) {
    setState(() {
      if (isLocationEnabled) {
        _locationStatus = _LocationStatus.approved;
      } else {
        _locationStatus = _LocationStatus.notApproved;
      }
    });
  }

  void _onLocationButtonClicked() async {
    _LocationStatus newStatus;
    try {
      await requestPermissionToDeterminePosition(userInteractContext: context);
      newStatus = _LocationStatus.approved;
    } on PositionNotAvailableException {
      newStatus = _LocationStatus.denied;
    }
    setState(() {
      _locationStatus = newStatus;
    });
  }

  @override
  Widget build(BuildContext context) {
    switch (_locationStatus) {
      case _LocationStatus.loading:
        return ElevatedButton(
          onPressed: null,
          child: Text("Prüfe Einstellungen..."),
        );
        break;
      case _LocationStatus.notApproved:
        return ElevatedButton(
          onPressed: _onLocationButtonClicked,
          child: Text("Ich möchte meinen Standort freigeben."),
        );
        break;
      case _LocationStatus.approved:
        return ElevatedButton(
          onPressed: null,
          child: Text("Standort ist bereits freigegeben."),
        );
        break;
      case _LocationStatus.denied:
        return ElevatedButton(
          onPressed: null,
          child: Text("Standort ist nicht freigegeben."),
        );
        break;
      case _LocationStatus.error:
        return Text("Ein unerwarteter Fehler ist aufgetreten.");
        break;
    }
    return Text("Ein unerwarteter Fehler ist aufgetreten.");
  }
}

enum _LocationStatus { loading, notApproved, approved, denied, error }
