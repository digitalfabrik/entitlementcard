import 'package:flutter/material.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

class FullMap extends StatefulWidget {
  final String mapboxToken;
  const FullMap(this.mapboxToken);

  @override
  State createState() => FullMapState(this.mapboxToken);
}

class FullMapState extends State<FullMap> {
  final String mapboxToken;
  MapboxMapController mapController;

  FullMapState(this.mapboxToken);

  void _onMapCreated(MapboxMapController controller) {
    mapController = controller;
  }

  @override
  Widget build(BuildContext context) {
    return new MapboxMap(
        accessToken: this.mapboxToken,
        onMapCreated: _onMapCreated,
        initialCameraPosition:
        const CameraPosition(target: LatLng(0.0, 0.0)),
    );
  }
}