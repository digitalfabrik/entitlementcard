import 'dart:ffi';

import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:maplibre_gl/mapbox_gl.dart';

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
      future: determinePosition(requestIfNotGranted: false).timeout(const Duration(milliseconds: 400), onTimeout: () => RequestedPosition(null))
          .onError((_,__) => null),
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const Center();
        }
        
        var position = snapshot.data.position;
        var userLocation = position == null
            ? null
            : LatLng(position.latitude, position.longitude);

        return Map(
          onFeatureClick: onFeatureClick,
          onNoFeatureClick: onNoFeatureClick,
          locationAvailable: userLocation != null,
          userLocation: userLocation,
          onFeatureClickLayerFilter: onFeatureClickLayerFilter,
          onMapCreated: onMapCreated,
        );
      },
    );
  }
}
