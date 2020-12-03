import 'package:flutter/material.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

class FullMapState extends State<FullMap> {

  @override
  Widget build(BuildContext context) {
    return new MapboxMap(
      accessToken: null,
      initialCameraPosition: const CameraPosition(target: LatLng(0.0, 0.0)),
      styleString: "https://vector.ehrenamtskarte.app/style.json",
    );
  }
}

class FullMap extends StatefulWidget {

  const FullMap();

  @override
  State createState() => FullMapState();
}
