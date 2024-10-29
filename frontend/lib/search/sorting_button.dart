import 'package:ehrenamtskarte/location/determine_position.dart';
import 'package:ehrenamtskarte/search/search_page.dart';
import 'package:ehrenamtskarte/widgets/extended_floating_action_button.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';

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
      _determinePosition(false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    if (widget.sortingMode == SortingMode.alphabetically) {
      return Container(
        alignment: Alignment.bottomCenter,
        padding: const EdgeInsets.all(10),
        child: ExtendedFloatingActionButton(
          onPressed: () => _sortByDistance(),
          icon: Icons.my_location,
          loading: _locationStatus == LocationRequestStatus.requesting,
          label: t.search.findCloseBy,
        ),
      );
    } else {
      return Container(
        alignment: Alignment.bottomCenter,
        padding: const EdgeInsets.all(10),
        child: ExtendedFloatingActionButton(
          onPressed: () => _sortAlphabetically(),
          label: t.search.findAlphabetically,
          icon: Icons.sort_by_alpha,
        ),
      );
    }
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

  void _sortAlphabetically() async {
    widget.setSortingMode(SortingMode.alphabetically);
  }

  Future<void> _sortByDistance() async {
    await _determinePosition(true);
  }

  Future<void> _determinePosition(bool userInteract) async {
    setState(() => _locationStatus = LocationRequestStatus.requesting);
    final RequestedPosition requestedPosition;
    if (userInteract) {
      requestedPosition = await determinePosition(context, requestIfNotGranted: true);
    } else {
      requestedPosition = await determinePosition(context, requestIfNotGranted: false)
          .timeout(const Duration(milliseconds: 2000), onTimeout: () => RequestedPosition.unknown());
    }
    if (!mounted) return;

    if (userInteract && requestedPosition.locationStatus == LocationStatus.deniedForever) {
      _showFeatureDisabled();
    }

    final position = requestedPosition.position;
    if (position != null) {
      widget.setCoordinates(position);
      setState(() => _locationStatus = LocationRequestStatus.requestSuccessful);
    } else {
      setState(() => _locationStatus = LocationRequestStatus.requestFailed);
    }
  }
}
