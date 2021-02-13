import 'package:flutter/material.dart';

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
    return FutureBuilder<bool>(
      future: canDetermineLocation(userInteract: false),
      builder: (context, snapshot) {
        if (!snapshot.hasData && !snapshot.hasError) {
          return Center();
        }
        return Map(
          onFeatureClick: onFeatureClick,
          onNoFeatureClick: onNoFeatureClick,
          locationAvailable: snapshot.hasData && snapshot.data,
          onFeatureClickLayerFilter: onFeatureClickLayerFilter,
          onMapCreated: onMapCreated,
        );
      },
    );
  }
}
