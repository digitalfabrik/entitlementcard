import 'package:flutter/material.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

class FullMapState extends State<FullMap> {
  final String mapboxToken;

  FullMapState(this.mapboxToken);

  @override
  Widget build(BuildContext context) {
    return new MapboxMap(
      accessToken: this.mapboxToken,
      initialCameraPosition: const CameraPosition(target: LatLng(0.0, 0.0)),
      styleString: "mapbox://styles/elkei24/ckhyn5h2l1yq519r9g3fbsogj",
    );
  }
}

class FullMap extends StatefulWidget {
  final String mapboxToken;

  const FullMap(this.mapboxToken);

  @override
  State createState() => FullMapState(this.mapboxToken);
}
