import 'package:ehrenamtskarte/map/request_location_permission.dart'
    show requestLocationPermissionIfNotYetGranted;
import 'package:flutter/material.dart';
import 'package:location_permissions/location_permissions.dart';
import 'full_map.dart';

class _FutureResult {
  PermissionStatus permissionStatus;
  _FutureResult(this.permissionStatus);
}

class MapPage extends StatelessWidget {
  MapPage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<_FutureResult>(
      future: () async {
        var futurePermissionState = requestLocationPermissionIfNotYetGranted(
            LocationPermissionLevel.locationWhenInUse);
        return _FutureResult(await futurePermissionState);
      }(),
      builder: (BuildContext context, AsyncSnapshot<_FutureResult> snapshot) {
        if (!snapshot.hasData) {
          return Center(
            child: Text(snapshot.hasError
                ? "Failed to request location permission"
                : "Requesting location permission …"),
          );
        }
        return FullMap(
          onFeatureClick: (feature) => {
            Scaffold.of(context).showSnackBar(SnackBar(
              content: Text(
                // TODO change loading of properties, as we no longer use the old fat geojson
                  feature["properties"]["k_name"].toString() ?? "Name missing"),
            ))
          },
          myLocationEnabled:
              snapshot.data.permissionStatus == PermissionStatus.granted,
        );
      },
    );
  }
}
