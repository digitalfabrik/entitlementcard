import 'package:ehrenamtskarte/location/request_location_permission.dart'
    show requestLocationPermissionIfNotYetGranted;
import 'package:flutter/material.dart';
import 'package:location_permissions/location_permissions.dart';
import 'map.dart';

class MapWithFutures extends StatelessWidget {
  final OnFeatureClickCallback onFeatureClick;
  final OnNoFeatureClickCallback onNoFeatureClick;
  final List<String> onFeatureClickLayerFilter;

  MapWithFutures(
      {Key key,
      this.onNoFeatureClick,
      this.onFeatureClick,
      this.onFeatureClickLayerFilter})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<PermissionStatus>(
      future: requestLocationPermissionIfNotYetGranted(
          LocationPermissionLevel.locationWhenInUse),
      builder:
          (BuildContext context, AsyncSnapshot<PermissionStatus> snapshot) {
        if (!snapshot.hasData && !snapshot.hasError) {
          return Center(
            child: Text("Erlaubnis zur Standortbestimmung wird abgerufen …"),
          );
        }
        return Map(
          onFeatureClick: this.onFeatureClick,
          onNoFeatureClick: this.onNoFeatureClick,
          myLocationEnabled:
              snapshot.hasData && snapshot.data == PermissionStatus.granted,
          onFeatureClickLayerFilter: this.onFeatureClickLayerFilter,
        );
      },
    );
  }
}
