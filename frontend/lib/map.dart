import 'dart:convert';
import 'dart:typed_data';

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
    loadData();
  }

  void loadData() async {
    String data = await DefaultAssetBundle.of(context)
        .loadString("verguenstigungen.json");
    ByteData marker = await DefaultAssetBundle.of(context)
        .load("custom_marker.png");
    mapController.addImage('custom-marker', marker.buffer.asUint8List());
    mapController.addSource("sourceId", data);
    mapController.addSymbolLayer("sourceId", "layer", {
      'icon-image': '["image", "custom-marker"]',
    });
  }

  @override
  Widget build(BuildContext context) {
    return new MapboxMap(
      accessToken: this.mapboxToken,
      onMapCreated: _onMapCreated,
      initialCameraPosition: const CameraPosition(target: LatLng(0.0, 0.0)),
    );
  }
}
