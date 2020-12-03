import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

typedef void OnFeatureClickCallback(dynamic feature);

class FullMapState extends State<FullMap> {
  static const double userLocationZoomLevel = 13;
  static const double initialZoomLevel = 6;
  static const LatLng initialLocation = LatLng(48.949444, 11.395);
  final OnFeatureClickCallback _onFeatureClick;
  final bool myLocationEnabled;
  MapboxMapController _controller;

  FullMapState(this._onFeatureClick, this.myLocationEnabled);

  @override
  Widget build(BuildContext context) {
    return new MapboxMap(
      accessToken: null,
      initialCameraPosition:
          const CameraPosition(target: initialLocation, zoom: initialZoomLevel),
      styleString: "https://vector.ehrenamtskarte.app/style.json",
      myLocationEnabled: this.myLocationEnabled,
      onMapCreated: (controller) {
        this._controller = controller;
        Future.delayed(Duration(milliseconds: 500), bringCameraToUserLocation)
            .timeout(Duration(seconds: 1));
      },
      onMapClick: this.onMapClick,
    );
  }

  void onMapClick(Point<double> point, LatLng coordinates) {
    this._controller.queryRenderedFeatures(point, [], null).then((features) => {
          if (features?.isNotEmpty)
            {this._onFeatureClick(json.decode(features[0]))}
        });
  }

  void bringCameraToUserLocation() async =>
      _controller.requestMyLocationLatLng().then(bringCameraToLocation);

  void bringCameraToLocation(LatLng location) async =>
      _controller.animateCamera(
          CameraUpdate.newLatLngZoom(location, userLocationZoomLevel));
}

class FullMap extends StatefulWidget {
  final OnFeatureClickCallback onFeatureClick;
  final bool myLocationEnabled;

  const FullMap(
      {this.onFeatureClick, this.myLocationEnabled});

  @override
  State createState() => FullMapState(
      this.onFeatureClick, this.myLocationEnabled);
}
