import 'package:ehrenamtskarte/map/map/request_location_permission.dart'
    show requestLocationPermissionIfNotYetGranted;
import 'package:flutter/material.dart';
import 'package:location_permissions/location_permissions.dart';
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
      builder:
          (BuildContext context, AsyncSnapshot<PermissionStatus> snapshot) {
        if (!snapshot.hasData) {
          return Center(
            child: Text(snapshot.hasError
                ? "Failed to fetch MapBox API key"
                : "Fetching MapBox API key …"),
          );
        }
        return Map(
          onFeatureClick: this.onFeatureClick,
          onNoFeatureClick: this.onNoFeatureClick,
          myLocationEnabled: snapshot.data == PermissionStatus.granted,
          onFeatureClickLayerFilter: this.onFeatureClickLayerFilter,
          onMapCreated: this.onMapCreated,
        );
      },
    );
  }
}
