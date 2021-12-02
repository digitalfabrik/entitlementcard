import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../location/determine_position.dart';
import '../widgets/small_button_spinner.dart';

class LocationButton extends StatefulWidget {
  final Future<void> Function(RequestedPosition) bringCameraToUser;

  const LocationButton({Key? key, required this.bringCameraToUser}) : super(key: key);

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
    final settings = Provider.of<SettingsModel>(context);

    return Container(
        // Makes sure that the FAB has
        // has a padding to the right
        //screen edge
        padding: const EdgeInsets.only(right: 16),
        child: FloatingActionButton(
          heroTag: "fab_map_view",
          elevation: 1,
          backgroundColor: theme.backgroundColor,
          child: AnimatedSwitcher(
            child: _status == LocationPermissionStatus.requestFinished
                ? (settings.locationFeatureEnabled
                    ? Icon(Icons.my_location, color: theme.colorScheme.secondary)
                    : Icon(Icons.location_disabled, color: theme.colorScheme.error))
                : const SmallButtonSpinner(),
            duration: const Duration(milliseconds: 200),
          ),
          onPressed: _status == LocationPermissionStatus.requestFinished ? () => _determinePosition(settings) : null,
        ));
  }

  _showFeatureDisabled() async {
    var messengerState = ScaffoldMessenger.of(context);
    messengerState.showSnackBar(SnackBar(
      behavior: SnackBarBehavior.floating,
      content: const Text('Die Standortfreigabe ist deaktiviert.'),
      action: SnackBarAction(
          label: "Einstellungen",
          onPressed: () async {
            await openSettingsToGrantPermissions(context);
          }),
    ));
  }

  _determinePosition(SettingsModel settings) async {
    setState(() => _status = LocationPermissionStatus.requesting);
    final requestedPosition = await determinePosition(context, requestIfNotGranted: true, onDisableFeature: () async {
      await settings.setLocationFeatureEnabled(false);
      await _showFeatureDisabled();
    }, onEnableFeature: () async {
      await settings.setLocationFeatureEnabled(true);
    });

    await widget.bringCameraToUser(requestedPosition);

    setState(() => _status = LocationPermissionStatus.requestFinished);
  }
}
