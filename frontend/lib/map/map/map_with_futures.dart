import 'package:flutter/material.dart';
import 'package:maplibre_gl/mapbox_gl.dart';

import '../../location/determine_position.dart';
import 'map.dart';

class MapWithFutures extends StatelessWidget {
  final OnFeatureClickCallback onFeatureClick;
  final OnNoFeatureClickCallback onNoFeatureClick;
  final OnMapCreatedCallback onMapCreated;
  final List<String> onFeatureClickLayerFilter;

  MapWithFutures(
      {Key key,
      this.onNoFeatureClick,
      this.onFeatureClick,
      this.onFeatureClickLayerFilter,
      this.onMapCreated})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: Future.wait([
        canDetermineLocation(),
        determinePosition().timeout(Duration(milliseconds: 400))
            .onError((_,__) => null)
      ]),
      builder: (context, snapshot) {
        if (!snapshot.hasData && !snapshot.hasError) {
          return Center();
        }
        var userLocation = snapshot.hasData && snapshot.data[1] != null
         ? LatLng(snapshot.data[1].latitude, snapshot.data[1].longitude) : null;

        return Map(
          onFeatureClick: onFeatureClick,
          onNoFeatureClick: onNoFeatureClick,
          locationAvailable: snapshot.hasData && snapshot.data[0],
          userLocation: userLocation,
          onFeatureClickLayerFilter: onFeatureClickLayerFilter,
          onMapCreated: onMapCreated,
        );
      },
    );
  }
}
