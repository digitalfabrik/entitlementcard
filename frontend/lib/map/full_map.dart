import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

typedef void OnFeatureClickCallback(dynamic feature);

class FullMapState extends State<FullMap> {
  final OnFeatureClickCallback onFeatureClick;
  final String _mapboxToken;
  MapboxMapController _controller;

  FullMapState(this._mapboxToken, this.onFeatureClick);

  @override
  Widget build(BuildContext context) {
    return new MapboxMap(
      accessToken: this._mapboxToken,
      initialCameraPosition: const CameraPosition(target: LatLng(0.0, 0.0)),
      styleString: "mapbox://styles/elkei24/ckhyn5h2l1yq519r9g3fbsogj",
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
  final String mapboxToken;
  final OnFeatureClickCallback onFeatureClick;

  const FullMap(this.mapboxToken, this.onFeatureClick);

  @override
  State createState() => FullMapState(this.mapboxToken, this.onFeatureClick);
}
