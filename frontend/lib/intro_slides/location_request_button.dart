import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/location/determine_position.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class LocationRequestButton extends StatefulWidget {
  const LocationRequestButton({super.key});

  @override
  State<StatefulWidget> createState() => _LocationRequestButtonState();
}

class _LocationRequestButtonState extends State<LocationRequestButton> {
  LocationStatus? _locationPermissionStatus;

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      checkAndRequestLocationPermission(context, requestIfNotGranted: false).then(
        (LocationStatus permission) => setState(() {
          _locationPermissionStatus = permission;
        }),
      );
    });
  }

  Future<void> _onLocationButtonClicked(SettingsModel settings) async {
    final permission = await checkAndRequestLocationPermission(
      context,
      requestIfNotGranted: true,
    );
    setState(() {
      _locationPermissionStatus = permission;
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final settings = Provider.of<SettingsModel>(context);
    final status = _locationPermissionStatus;
    if (status == null) {
      return ElevatedButton(
        onPressed: null,
        child: Text(t.location.checkSettings),
      );
    }
    switch (status) {
      case LocationStatus.denied:
      case LocationStatus.notSupported:
        return ElevatedButton(
          onPressed: () => _onLocationButtonClicked(settings),
          child: Text(t.location.grantLocation),
        );
      case LocationStatus.whileInUse:
      case LocationStatus.always:
        return ElevatedButton(
          onPressed: null,
          child: Text(t.location.locationGranted),
        );
      case LocationStatus.deniedForever:
        return ElevatedButton(
          onPressed: null,
          child: Text(t.location.locationAccessDeactivated),
        );
    }
  }
}
