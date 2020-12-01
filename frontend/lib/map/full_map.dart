import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

typedef void OnFeatureClickCallback(dynamic feature);

class FullMapState extends State<FullMap> {
  final String _mapboxToken;
  final OnFeatureClickCallback _onFeatureClick;
  final bool myLocationEnabled;
  MapboxMapController _controller;

  FullMapState(this._mapboxToken, this._onFeatureClick, this.myLocationEnabled);

  @override
  Widget build(BuildContext context) {
    return new MapboxMap(
        accessToken: this._mapboxToken,
        initialCameraPosition: const CameraPosition(target: LatLng(0.0, 0.0)),
        styleString: "mapbox://styles/elkei24/ckhyn5h2l1yq519r9g3fbsogj",
        onMapCreated: (controller) => {this._controller = controller},
        onMapClick: this.onMapClick,
        myLocationEnabled: this.myLocationEnabled);
  }

  void onMapClick(Point<double> point, LatLng coordinates) {
    this._controller.queryRenderedFeatures(point, [], null).then((features) => {
          if (features?.isNotEmpty)
            {this._onFeatureClick(json.decode(features[0]))}
        });
  }
}

class FullMap extends StatefulWidget {
  final String mapboxToken;
  final OnFeatureClickCallback onFeatureClick;
  final bool myLocationEnabled;

  const FullMap(
      {this.mapboxToken, this.onFeatureClick, this.myLocationEnabled});

  @override
  State createState() => FullMapState(
      this.mapboxToken, this.onFeatureClick, this.myLocationEnabled);
}
