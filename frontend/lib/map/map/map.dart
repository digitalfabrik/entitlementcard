import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

typedef void OnFeatureClickCallback(dynamic feature);
typedef void OnNoFeatureClickCallback();

class Map extends StatefulWidget {
  static const double userLocationZoomLevel = 13;
  static const double initialZoomLevel = 6;
  static const LatLng initialLocation = LatLng(48.949444, 11.395);
  final OnFeatureClickCallback onFeatureClick;
  final OnNoFeatureClickCallback onNoFeatureClick;
  final List<String> onFeatureClickLayerFilter;
  final bool myLocationEnabled;

  const Map(
      {this.onFeatureClick,
      this.onNoFeatureClick,
      this.onFeatureClickLayerFilter,
      this.myLocationEnabled = false});

  @override
  State createState() => _MapState();
}

class _MapState extends State<Map> {
  MapboxMapController _controller;

  @override
  Widget build(BuildContext context) {
    return new MapboxMap(
      initialCameraPosition: const CameraPosition(
          target: Map.initialLocation, zoom: Map.initialZoomLevel),
      styleString: "https://vector.ehrenamtskarte.app/style.json",
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
    this
        ._controller
        .queryRenderedFeatures(
            point, widget.onFeatureClickLayerFilter ?? [], null)
        .then((features) {
      if (features.isNotEmpty) {
        var featureInfo = json.decode(features[0]);
        if (featureInfo != null) {
          _bringCameraToLocation(coordinates);
          if (widget.onFeatureClick != null) widget.onFeatureClick(featureInfo);
          return;
        }
      }
      if (widget.onNoFeatureClick != null) widget.onNoFeatureClick();
    });
  }

  void _bringCameraToUserLocation() async =>
      _controller.requestMyLocationLatLng().then((location) =>
          _bringCameraToLocation(location, Map.userLocationZoomLevel));

  void _bringCameraToLocation(LatLng location, [double zoomLevel]) async =>
      _controller.animateCamera(zoomLevel != null
          ? CameraUpdate.newLatLngZoom(location, zoomLevel)
          : CameraUpdate.newLatLng(location));
}
