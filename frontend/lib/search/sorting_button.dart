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
  bool _isMenuOpen = false;

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
    final colorScheme = theme.colorScheme;
    final foregroundColor = colorScheme.onSurface;
    final isRequesting = _locationStatus == LocationRequestStatus.requesting;
    final currentLabel = _label(context, widget.sortingMode);

    return MenuAnchor(
      onOpen: () => setState(() => _isMenuOpen = true),
      onClose: () => setState(() => _isMenuOpen = false),
      style: MenuStyle(
        backgroundColor: WidgetStatePropertyAll(colorScheme.surfaceContainer),
        shape: WidgetStatePropertyAll(RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
        padding: const WidgetStatePropertyAll(EdgeInsets.all(8)),
      ),
      menuChildren: SortingMode.values.map((mode) {
        final isSelected = mode == widget.sortingMode;
        return MenuItemButton(
          onPressed: () => _onSelected(mode),
          style: MenuItemButton.styleFrom(
            backgroundColor: isSelected ? colorScheme.surfaceContainerHighest : null,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            textStyle: theme.textTheme.bodyLarge,
          ),
          leadingIcon: Visibility.maintain(
            visible: isSelected,
            child: Icon(Icons.check, color: colorScheme.onSurface),
          ),
          child: Text(_label(context, mode), style: TextStyle(color: colorScheme.onSurface)),
        );
      }).toList(),
      builder: (context, controller, _) => Tooltip(
        message: t.search.sortBy,
        child: InkWell(
          onTap: isRequesting ? null : () => controller.isOpen ? controller.close() : controller.open(),
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
                      : Icon(Icons.sort, color: foregroundColor),
                ),
                const SizedBox(width: 12),
                Text(currentLabel, style: theme.textTheme.bodyLarge?.copyWith(color: foregroundColor, height: 1)),
                const SizedBox(width: 4),
                Icon(_isMenuOpen ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down, color: foregroundColor),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _onSelected(SortingMode sortingMode) {
    setState(() => _isMenuOpen = false);
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
