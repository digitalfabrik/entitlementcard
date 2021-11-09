import 'package:ehrenamtskarte/widgets/small_button_spinner.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import '../../location/determine_position.dart';
import 'map.dart';

class MapWithFutures extends StatelessWidget {
  final OnFeatureClickCallback onFeatureClick;
  final OnNoFeatureClickCallback onNoFeatureClick;
  final OnMapCreatedCallback onMapCreated;
  final List<String> onFeatureClickLayerFilter;

  const MapWithFutures(
      {Key key,
      this.onNoFeatureClick,
      this.onFeatureClick,
      this.onFeatureClickLayerFilter,
      this.onMapCreated})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: determinePosition(context, requestIfNotGranted: false).timeout(
          const Duration(milliseconds: 400),
          onTimeout: () => RequestedPosition.unknown()),
      builder: (context, AsyncSnapshot<RequestedPosition> snapshot) {
        if (!snapshot.hasData) {
          return const SmallButtonSpinner();
        }

        var position = snapshot.data;

        return Map(
          onFeatureClick: onFeatureClick,
          onNoFeatureClick: onNoFeatureClick,
          locationAvailable: position.isAvailable(),
          userLocation: position.toLatLng(),
          onFeatureClickLayerFilter: onFeatureClickLayerFilter,
          onMapCreated: onMapCreated,
        );
      },
    );
  }
}
