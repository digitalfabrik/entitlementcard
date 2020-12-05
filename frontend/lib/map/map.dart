import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

typedef void OnFeatureClickCallback(dynamic feature);

class _MapState extends State<Map> {
  static const double userLocationZoomLevel = 13;
  static const double initialZoomLevel = 6;
  static const LatLng initialLocation = LatLng(48.949444, 11.395);
  final String _mapboxToken;
  final OnFeatureClickCallback _onFeatureClick;
  final bool myLocationEnabled;
  MapboxMapController _controller;

  _MapState(this._mapboxToken, this._onFeatureClick, this.myLocationEnabled);

  @override
  Widget build(BuildContext context) {
    return new MapboxMap(
      accessToken: this._mapboxToken,
      initialCameraPosition:
          const CameraPosition(target: initialLocation, zoom: initialZoomLevel),
      styleString: "mapbox://styles/elkei24/ckhyn5h2l1yq519r9g3fbsogj",
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

class Map extends StatefulWidget {
  final String mapboxToken;
  final OnFeatureClickCallback onFeatureClick;
  final bool myLocationEnabled;

  const Map({this.mapboxToken, this.onFeatureClick, this.myLocationEnabled});

  @override
  State createState() =>
      _MapState(this.mapboxToken, this.onFeatureClick, this.myLocationEnabled);
}
