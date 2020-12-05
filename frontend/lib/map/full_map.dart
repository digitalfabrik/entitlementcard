import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

typedef void OnFeatureClickCallback(dynamic feature);

class FullMap extends StatefulWidget {
  static const double userLocationZoomLevel = 13;
  static const double initialZoomLevel = 6;
  static const LatLng initialLocation = LatLng(48.949444, 11.395);
  final String mapboxToken;
  final OnFeatureClickCallback onFeatureClick;
  final bool myLocationEnabled;

  const FullMap(this.mapboxToken,
      {this.onFeatureClick, this.myLocationEnabled = false});

  @override
  State createState() => _FullMapState();
}

class _FullMapState extends State<FullMap> {
  MapboxMapController _controller;

  @override
  Widget build(BuildContext context) {
    return new MapboxMap(
      accessToken: widget.mapboxToken,
      initialCameraPosition: const CameraPosition(
          target: FullMap.initialLocation, zoom: FullMap.initialZoomLevel),
      styleString: "mapbox://styles/elkei24/ckhyn5h2l1yq519r9g3fbsogj",
      myLocationEnabled: widget.myLocationEnabled,
      onMapCreated: (controller) {
        setState(() {
          this._controller = controller;
        });
        Future.delayed(Duration(milliseconds: 500), _bringCameraToUserLocation)
            .timeout(Duration(seconds: 1));
      },
      onMapClick: this._onMapClick,
    );
  }

  void _onMapClick(Point<double> point, LatLng coordinates) {
    this._controller.queryRenderedFeatures(point, [], null).then((features) => {
          if (features?.isNotEmpty)
            {widget.onFeatureClick(json.decode(features[0]))}
        });
  }

  void _bringCameraToUserLocation() async =>
      _controller.requestMyLocationLatLng().then(_bringCameraToLocation);

  void _bringCameraToLocation(LatLng location) async =>
      _controller.animateCamera(
          CameraUpdate.newLatLngZoom(location, FullMap.userLocationZoomLevel));
}
