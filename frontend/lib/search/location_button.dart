import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/location/determine_position.dart';
import 'package:ehrenamtskarte/search/search_page.dart';
import 'package:ehrenamtskarte/widgets/small_button_spinner.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:provider/provider.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class SortingButton extends StatefulWidget {
  final void Function(Position position) setCoordinates;
  final void Function(SortingMode sortingMode) setSortingMode;
  final SortingMode sortingMode;

  const SortingButton(
      {super.key, required this.setCoordinates, required this.setSortingMode, required this.sortingMode});

  @override
  State<StatefulWidget> createState() => _SortingButtonState();
}

enum LocationRequestStatus { requesting, requestSuccessful, requestFailed }

class _SortingButtonState extends State<SortingButton> {
  LocationRequestStatus _locationStatus = LocationRequestStatus.requestSuccessful;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      final settings = context.read<SettingsModel>();
      _determinePosition(false, settings);
    });
  }

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsModel>(context);
    final t = context.t;
    if (widget.sortingMode == SortingMode.alphabetically) {
      return Container(
        alignment: Alignment.bottomCenter,
        padding: const EdgeInsets.all(10),
        child: FloatingActionButton.extended(
          heroTag: 'fab_search_view',
          backgroundColor: Theme.of(context).colorScheme.surfaceVariant,
          elevation: 1,
          onPressed: () => _sortByDistance(settings),
          icon: AnimatedSwitcher(
            duration: const Duration(milliseconds: 200),
            child: _locationStatus == LocationRequestStatus.requesting
                ? const SmallButtonSpinner()
                : Icon(
                    Icons.my_location,
                    size: 24,
                    color: Theme.of(context).colorScheme.secondary,
                  ),
          ),
          label: Text(
            t.search.findCloseBy,
            style: TextStyle(color: Theme.of(context).hintColor),
          ),
        ),
      );
    } else {
      return Container(
        alignment: Alignment.bottomCenter,
        padding: const EdgeInsets.all(10),
        child: FloatingActionButton.extended(
          heroTag: 'fab_search_view',
          backgroundColor: Theme.of(context).colorScheme.surfaceVariant,
          elevation: 1,
          onPressed: () => _sortAlphabetically(settings),
          label: Text(
            t.search.findAlphabetically,
            style: TextStyle(color: Theme.of(context).hintColor),
          ),
        ),
      );
    }
  }

  Future<void> _showFeatureDisabled() async {
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

  Future<void> _sortAlphabetically(SettingsModel settings) async {
    widget.setSortingMode(SortingMode.alphabetically);
  }

  Future<void> _sortByDistance(SettingsModel settings) async {
    await _determinePosition(true, settings);
  }

  Future<void> _determinePosition(bool userInteract, SettingsModel settings) async {
    setState(() => _locationStatus = LocationRequestStatus.requesting);
    final requiredPosition = userInteract
        ? await determinePosition(
            context,
            requestIfNotGranted: true,
            onDisableFeature: () async {
              settings.setLocationFeatureEnabled(enabled: false);
              _showFeatureDisabled();
            },
            onEnableFeature: () async => settings.setLocationFeatureEnabled(enabled: true),
          )
        : await determinePosition(
            context,
            requestIfNotGranted: false,
            onDisableFeature: () async => settings.setLocationFeatureEnabled(enabled: false),
            onEnableFeature: () async => settings.setLocationFeatureEnabled(enabled: true),
          ).timeout(const Duration(milliseconds: 2000), onTimeout: () => RequestedPosition.unknown());

    final position = requiredPosition.position;
    if (position != null) {
      widget.setCoordinates(position);
      setState(() => _locationStatus = LocationRequestStatus.requestSuccessful);
    } else {
      setState(() => _locationStatus = LocationRequestStatus.requestFailed);
    }
  }
}
