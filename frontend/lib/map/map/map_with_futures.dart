import 'package:flutter/material.dart';
import 'package:location_permissions/location_permissions.dart';

import '../../location/request_location_permission.dart'
    show requestLocationPermissionIfNotYetGranted;
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
    return FutureBuilder<PermissionStatus>(
      future: requestLocationPermissionIfNotYetGranted(
          LocationPermissionLevel.locationWhenInUse),
      builder: (context, snapshot) {
        if (!snapshot.hasData && !snapshot.hasError) {
          return Center(
            child: Text("Erlaubnis zur Standortbestimmung wird abgerufen …"),
          );
        }
        return Map(
          onFeatureClick: onFeatureClick,
          onNoFeatureClick: onNoFeatureClick,
          myLocationEnabled:
              snapshot.hasData && snapshot.data == PermissionStatus.granted,
          onFeatureClickLayerFilter: onFeatureClickLayerFilter,
          onMapCreated: this.onMapCreated,
        );
      },
    );
  }
}
