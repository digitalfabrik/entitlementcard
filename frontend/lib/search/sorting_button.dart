import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/location/determine_position.dart';
import 'package:ehrenamtskarte/search/search_page.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';

class SortingButton extends StatefulWidget {
  final void Function(Position position) setCoordinates;
  final void Function(SortingMode sortingMode) setSortingMode;
  final SortingMode sortingMode;

  const SortingButton({
    super.key,
    required this.setCoordinates,
    required this.setSortingMode,
    required this.sortingMode,
  });

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

  String _label(BuildContext context, SortingMode sortingMode) {
    final t = context.t;
    return switch (sortingMode) {
      SortingMode.byDistance => t.search.sortNearby,
      SortingMode.alphabetically => t.search.sortAlphabetically,
    };
  }

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final theme = Theme.of(context);
    final foregroundColor = theme.hintColor;
    final isRequesting = _locationStatus == LocationRequestStatus.requesting;
    final currentLabel = _label(context, widget.sortingMode);

    return PopupMenuButton<SortingMode>(
      enabled: !isRequesting,
      initialValue: widget.sortingMode,
      tooltip: t.search.sortBy,
      position: PopupMenuPosition.under,
      onSelected: _onSelected,
      itemBuilder: (context) => SortingMode.values
          .map(
            (mode) => CheckedPopupMenuItem<SortingMode>(
              value: mode,
              checked: mode == widget.sortingMode,
              child: Text(_label(context, mode)),
            ),
          )
          .toList(),
      child: ConstrainedBox(
        constraints: const BoxConstraints(minHeight: kMinInteractiveDimension),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox.square(
              dimension: 24,
              child: isRequesting
                  ? Padding(
                      padding: const EdgeInsets.all(4),
                      child: CircularProgressIndicator(strokeWidth: 2, color: foregroundColor),
                    )
                  : Icon(Icons.filter_list, color: foregroundColor),
            ),
            const SizedBox(width: 12),
            Text(currentLabel, style: theme.textTheme.bodyLarge?.copyWith(color: foregroundColor, height: 1)),
            const SizedBox(width: 4),
            Icon(Icons.keyboard_arrow_down, color: foregroundColor),
          ],
        ),
      ),
    );
  }

  void _onSelected(SortingMode sortingMode) {
    switch (sortingMode) {
      case SortingMode.alphabetically:
        widget.setSortingMode(SortingMode.alphabetically);
      case SortingMode.byDistance:
        _determinePosition(true);
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

  Future<void> _determinePosition(bool userInteract) async {
    setState(() => _locationStatus = LocationRequestStatus.requesting);
    final RequestedPosition requestedPosition;
    if (userInteract) {
      requestedPosition = await determinePosition(context, requestIfNotGranted: true);
    } else {
      requestedPosition = await determinePosition(
        context,
        requestIfNotGranted: false,
      ).timeout(const Duration(milliseconds: 2000), onTimeout: () => RequestedPosition.unknown());
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
