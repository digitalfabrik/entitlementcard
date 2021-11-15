import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
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

    WidgetsBinding.instance?.addPostFrameCallback((timeStamp) {
      final settings = context.read<SettingsModel>();

      checkAndRequestLocationPermission(context,
              requestIfNotGranted: false,
              onDisableFeature: () => settings.setLocationFeatureEnabled(false))
          .then((LocationStatus permission) => setState(() {
                _locationPermissionStatus = permission;
              }));
    });
  }

  void _onLocationButtonClicked(SettingsModel settings) async {
    final permission = await checkAndRequestLocationPermission(context,
        requestIfNotGranted: true,
        onDisableFeature: () async =>
            await settings.setLocationFeatureEnabled(false));
    setState(() {
      _locationPermissionStatus = permission;
    });
  }

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsModel>(context);
    var status = _locationPermissionStatus;
    if (status == null) {
      return const ElevatedButton(
        onPressed: null,
        child: Text("Prüfe Einstellungen..."),
      );
    }
    switch (status) {
      case LocationStatus.denied:
      case LocationStatus.notSupported:
        return ElevatedButton(
          onPressed: () => _onLocationButtonClicked(settings),
          child: const Text("Ich möchte meinen Standort freigeben."),
        );
      case LocationStatus.whileInUse:
      case LocationStatus.always:
        return const ElevatedButton(
          onPressed: null,
          child: Text("Standort ist freigegeben."),
        );
      case LocationStatus.deniedForever:
        return const ElevatedButton(
          onPressed: null,
          child: Text("Standortfreigabe ist deaktiviert."),
        );
    }
  }
}
