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

  Future<bool> _canDetermineLocation() async {
    try {
      await requestPermissionToDeterminePosition();
      return true;
    } on PositionNotAvailableException catch (e) {
      debugPrint(e.reason);
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
      future: _canDetermineLocation(),
      builder: (context, snapshot) {
        if (!snapshot.hasData && !snapshot.hasError) {
          return Center(
            child: Text("Erlaubnis zur Standortbestimmung wird abgerufen …"),
          );
        }
        return Map(
          onFeatureClick: onFeatureClick,
          onNoFeatureClick: onNoFeatureClick,
          myLocationEnabled: snapshot.hasData && snapshot.data,
          onFeatureClickLayerFilter: onFeatureClickLayerFilter,
          onMapCreated: onMapCreated,
        );
      },
    );
  }
}
