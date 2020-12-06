import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

typedef void OnFeatureClickCallback(dynamic feature);
typedef void OnNoFeatureClickCallback();

class _MapState extends State<Map> {
  static const double userLocationZoomLevel = 13;
  static const double initialZoomLevel = 6;
  static const LatLng initialLocation = LatLng(48.949444, 11.395);
  final String _mapboxToken;
  final bool myLocationEnabled;
  MapboxMapController _controller;

  _MapState(this._mapboxToken, this.myLocationEnabled);

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
    this._controller.queryRenderedFeatures(point, [], null).then((features) {
      if (features.isNotEmpty) {
        var featureInfo = json.decode(features[0]);
        if (featureInfo != null) {
          if (widget.onFeatureClick != null) widget.onFeatureClick(featureInfo);
          return;
        }
      }
      if (widget.onNoFeatureClick != null) widget.onNoFeatureClick();
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
  final OnNoFeatureClickCallback onNoFeatureClick;
  final bool myLocationEnabled;

  const Map(
      {Key key,
      this.mapboxToken,
      this.onFeatureClick,
      this.onNoFeatureClick,
      this.myLocationEnabled})
      : super(key: key);

  @override
  State createState() => _MapState(this.mapboxToken, this.myLocationEnabled);
}
