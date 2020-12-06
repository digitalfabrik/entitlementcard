import 'package:ehrenamtskarte/map/map/request_location_permission.dart'
    show requestLocationPermissionIfNotYetGranted;
import 'package:flutter/material.dart';
import 'package:location_permissions/location_permissions.dart';
import '../../util/secrets/secret.dart';
import '../../util/secrets/secretLoader.dart';
import 'map.dart';

class _FutureResult {
  Secret secret;
  PermissionStatus permissionStatus;
  _FutureResult(this.secret, this.permissionStatus);
}

class MapWithFutures extends StatelessWidget {
  final OnFeatureClickCallback onFeatureClick;
  final OnNoFeatureClickCallback onNoFeatureClick;

  MapWithFutures({Key key, this.onNoFeatureClick, this.onFeatureClick})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<_FutureResult>(
      future: () async {
        var futureSecrets = SecretLoader(secretPath: "secrets.json").load();
        var futurePermissionState = requestLocationPermissionIfNotYetGranted(
            LocationPermissionLevel.locationWhenInUse);
        return _FutureResult(await futureSecrets, await futurePermissionState);
      }(),
      builder: (BuildContext context, AsyncSnapshot<_FutureResult> snapshot) {
        if (!snapshot.hasData) {
          return Center(
            child: Text(snapshot.hasError
                ? "Failed to fetch MapBox API key"
                : "Fetching MapBox API key …"),
          );
        }
        return Map(
          mapboxToken: snapshot.data.secret.mapboxKey,
          onFeatureClick: this.onFeatureClick,
          onNoFeatureClick: this.onNoFeatureClick,
          myLocationEnabled:
              snapshot.data.permissionStatus == PermissionStatus.granted,
        );
      },
    );
  }
}
