import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

typedef void OnFeatureClickCallback(dynamic feature);

class FullMapState extends State<FullMap> {
  final OnFeatureClickCallback onFeatureClick;
  MapboxMapController _controller;

  FullMapState(this.onFeatureClick);

  @override
  Widget build(BuildContext context) {
    return new MapboxMap(
      accessToken: null,
      initialCameraPosition: const CameraPosition(target: LatLng(0.0, 0.0)),
      styleString: "https://vector.ehrenamtskarte.app/style.json",
      onMapCreated: (controller) => {this._controller = controller},
      onMapClick: this.onMapClick,
    );
  }

  void onMapClick(Point<double> point, LatLng coordinates) {
    this._controller.queryRenderedFeatures(point, [], null).then((features) => {
          if (features?.isNotEmpty)
            {this.onFeatureClick(json.decode(features[0]))}
        });
  }
}

class FullMap extends StatefulWidget {
  final OnFeatureClickCallback onFeatureClick;

  const FullMap(this.onFeatureClick);

  @override
  State createState() => FullMapState(this.onFeatureClick);
}
