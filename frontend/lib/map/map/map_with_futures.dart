import 'package:ehrenamtskarte/location/determine_position.dart';
import 'package:ehrenamtskarte/map/map/map.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class MapWithFutures extends StatelessWidget {
  final OnFeatureClickCallback onFeatureClick;
  final OnNoFeatureClickCallback onNoFeatureClick;
  final OnMapCreatedCallback onMapCreated;
  final void Function(bool followUserLocation) setFollowUserLocation;
  final List<String> onFeatureClickLayerFilter;

  const MapWithFutures({
    super.key,
    required this.onNoFeatureClick,
    required this.onFeatureClick,
    required this.onFeatureClickLayerFilter,
    required this.onMapCreated,
    required this.setFollowUserLocation,
  });

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: determinePosition(context, requestIfNotGranted: false)
          .timeout(const Duration(milliseconds: 400), onTimeout: () => RequestedPosition.unknown()),
      builder: (context, AsyncSnapshot<RequestedPosition> snapshot) {
        if (!snapshot.hasData && !snapshot.hasError) {
          return const Center();
        }

        final position = snapshot.data;

        return MapContainer(
            onFeatureClick: onFeatureClick,
            onNoFeatureClick: onNoFeatureClick,
            locationAvailable: position?.isAvailable() ?? false,
            userLocation: position?.toLatLng(),
            onFeatureClickLayerFilter: onFeatureClickLayerFilter,
            onMapCreated: onMapCreated,
            setFollowUserLocation: setFollowUserLocation);
      },
    );
  }
}
