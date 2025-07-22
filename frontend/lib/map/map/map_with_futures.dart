import 'package:ehrenamtskarte/location/determine_position.dart';
import 'package:ehrenamtskarte/map/map/map.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class MapWithFutures extends StatefulWidget {
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
  State<MapWithFutures> createState() => _MapWithFuturesState();
}

class _MapWithFuturesState extends State<MapWithFutures> {
  late Future<RequestedPosition> positionFuture;

  @override
  void initState() {
    super.initState();
    positionFuture = determinePosition(
      context,
      requestIfNotGranted: false,
    ).timeout(const Duration(milliseconds: 400), onTimeout: () => RequestedPosition.unknown());
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: positionFuture,
      builder: (context, AsyncSnapshot<RequestedPosition> snapshot) {
        if (!snapshot.hasData && !snapshot.hasError) {
          return const Center();
        }

        final position = snapshot.data;

        return MapContainer(
          onFeatureClick: widget.onFeatureClick,
          onNoFeatureClick: widget.onNoFeatureClick,
          locationAvailable: position?.isAvailable() ?? false,
          userLocation: position?.toLatLng(),
          onFeatureClickLayerFilter: widget.onFeatureClickLayerFilter,
          onMapCreated: widget.onMapCreated,
          setFollowUserLocation: widget.setFollowUserLocation,
        );
      },
    );
  }
}
