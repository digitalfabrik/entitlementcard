import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';

import '../location/determine_position.dart';
import '../widgets/small_button_spinner.dart';

class LocationButton extends StatefulWidget {
  final void Function(Position position) setCoordinates;

  const LocationButton({Key key, this.setCoordinates}) : super(key: key);

  @override
  State<StatefulWidget> createState() => _LocationButtonState();
}

enum LocationRequestStatus { requesting, requestSuccessful, requestFailed }

class _LocationButtonState extends State<LocationButton> {
  LocationRequestStatus _locationStatus = LocationRequestStatus.requesting;

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    if (_locationStatus == LocationRequestStatus.requestSuccessful) {
      return Container();
    }
    var onPressed = _locationStatus == LocationRequestStatus.requesting
        ? null
        : () => _initCoordinates(true);
    var icon = _locationStatus == LocationRequestStatus.requesting
        ? SmallButtonSpinner()
        : Icon(
            Icons.my_location,
            size: 24,
            color: theme.accentColor,
          );
    return Container(
        alignment: Alignment.bottomCenter,
        padding: EdgeInsets.all(10),
        child: FloatingActionButton.extended(
            backgroundColor: Theme.of(context).backgroundColor,
            elevation: 1,
            onPressed: onPressed,
            icon: AnimatedSwitcher(
                child: icon, duration: Duration(milliseconds: 200)),
            label: Text(
              "In meiner Nähe suchen",
              style: TextStyle(color: theme.hintColor),
            )));
  }

  Future<void> _initCoordinates(bool userInteract) async {
    try {
      setState(() => _locationStatus = LocationRequestStatus.requesting);
      var position = await determinePosition(
          userInteractContext: userInteract ? context : null);
      widget.setCoordinates(position);
      setState(() => _locationStatus = LocationRequestStatus.requestSuccessful);
    } on Exception catch (e) {
      debugPrint(e.toString());
      setState(() => _locationStatus = LocationRequestStatus.requestFailed);
    }
  }

  @override
  void initState() {
    _initCoordinates(false);
    super.initState();
  }
}
