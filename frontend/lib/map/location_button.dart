import 'package:ehrenamtskarte/location/determine_position.dart';
import 'package:ehrenamtskarte/widgets/small_button_spinner.dart';
import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class LocationIcon extends StatelessWidget {
  final LocationStatus? locationStatus;
  final bool followUserLocation;

  const LocationIcon({super.key, required this.locationStatus, required this.followUserLocation});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (locationStatus == null) {
      return const SmallButtonSpinner();
    }

    final bool hasLocationPermission =
        locationStatus == LocationStatus.always || locationStatus == LocationStatus.whileInUse;
    if (hasLocationPermission) {
      return Icon(
        followUserLocation ? Icons.my_location : Icons.location_searching,
        color: theme.colorScheme.secondary,
      );
    }

    return Icon(Icons.location_disabled, color: theme.colorScheme.error);
  }
}

class LocationButton extends StatefulWidget {
  final Future<void> Function(RequestedPosition) bringCameraToUser;
  final bool followUserLocation;

  const LocationButton({super.key, required this.bringCameraToUser, required this.followUserLocation});

  @override
  State<StatefulWidget> createState() {
    return _LocationButtonState();
  }
}

class _LocationButtonState extends State<LocationButton> {
  LocationStatus? _locationStatus;

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      initializeLocationStatus();
    });
  }

  Future<void> initializeLocationStatus() async {
    LocationStatus status = await checkAndRequestLocationPermission(context, requestIfNotGranted: false);
    if (context.mounted) {
      setState(() {
        _locationStatus = status;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      // Makes sure that the FAB has
      // has a padding to the right
      //screen edge
      padding: const EdgeInsets.only(right: 16),
      child: FloatingActionButton(
        heroTag: 'fab_map_view',
        elevation: 1,
        backgroundColor: theme.colorScheme.surfaceContainerHighest,
        onPressed: _locationStatus != null ? () => _determinePosition() : null,
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 200),
          child: LocationIcon(locationStatus: _locationStatus, followUserLocation: widget.followUserLocation),
        ),
      ),
    );
  }

  void _showFeatureDisabled() {
    final messengerState = ScaffoldMessenger.of(context);
    final t = context.t;
    messengerState.showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        content: Text(t.location.locationAccessDeactivated),
        action: SnackBarAction(
          label: t.common.settings,
          onPressed: () async {
            await openSettingsToGrantPermissions(context);
          },
        ),
      ),
    );
  }

  Future<void> _determinePosition() async {
    setState(() => _locationStatus = null);
    final requestedPosition = await determinePosition(context, requestIfNotGranted: true);
    if (!mounted) return;

    if (requestedPosition.locationStatus == LocationStatus.deniedForever) {
      _showFeatureDisabled();
    }

    await widget.bringCameraToUser(requestedPosition);
    if (!mounted) return;

    setState(() => _locationStatus = requestedPosition.locationStatus);
  }
}
