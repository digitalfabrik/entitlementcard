import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

import '../../configuration.dart';
import 'map_controller.dart';

typedef OnFeatureClickCallback = void Function(dynamic feature);
typedef OnNoFeatureClickCallback = void Function();
typedef OnMapCreatedCallback = void Function(MapController controller);

class Map extends StatefulWidget {
  static const double userLocationZoomLevel = 13;
  static const double initialZoomLevel = 6;
  static const LatLng initialLocation = LatLng(48.949444, 11.395);
  final OnFeatureClickCallback onFeatureClick;
  final OnNoFeatureClickCallback onNoFeatureClick;
  final OnMapCreatedCallback onMapCreated;
  final List<String> onFeatureClickLayerFilter;
  final bool myLocationEnabled;

  const Map(
      {this.onFeatureClick,
      this.onNoFeatureClick,
      this.onFeatureClickLayerFilter,
      this.myLocationEnabled = true,
      this.onMapCreated});

  @override
  State createState() => _MapState();
}

class _MapState extends State<Map> implements MapController {
  MapboxMapController _controller;
  MapboxMap _mapboxMap;
  Symbol _symbol;

  @override
  void didChangeDependencies() {
    final config = Configuration.of(context);
    var statusBarHeight = MediaQuery.of(context).padding.top;
    var pixelRatio = MediaQuery.of(context).devicePixelRatio;
    var compassMargin = statusBarHeight * pixelRatio;
    _mapboxMap = MapboxMap(
      initialCameraPosition: CameraPosition(
          target: Map.initialLocation,
          zoom: widget.myLocationEnabled
              ? Map.userLocationZoomLevel
              : Map.initialZoomLevel),
      styleString: config.mapStyleUrl,
      myLocationEnabled: true,
      myLocationTrackingMode: widget.myLocationEnabled
          ? MyLocationTrackingMode.Tracking
          : MyLocationTrackingMode.None,
      onMapCreated: _onMapCreated,
      onMapClick: _onMapClick,
      compassViewMargins: Point(0, compassMargin),
      compassViewPosition: CompassViewPosition.TopRight,
    );
    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    return _mapboxMap;
  }

  void _onMapCreated(MapboxMapController controller) {
    _controller = controller;
    if (widget.onMapCreated != null) {
      widget.onMapCreated(this);
    }
  }

  Future<void> removeSymbol() async {
    if (_symbol == null) return;
    await _controller.removeSymbol(_symbol);
    _symbol = null;
  }

  Future<void> setSymbol(LatLng location, int categoryId) async {
    removeSymbol();
    _symbol = await _controller.addSymbol(SymbolOptions(
        iconSize: 1.5, geometry: location, iconImage: categoryId.toString()));
  }

  void _onMapClick(Point<double> point, clickCoordinates) async {
    var features = await _controller.queryRenderedFeatures(
        point, widget.onFeatureClickLayerFilter ?? [], null);
    if (features.isNotEmpty) {
      var featureInfo = json.decode(features[0]);
      if (featureInfo != null) {
        if (widget.onFeatureClick != null) widget.onFeatureClick(featureInfo);
      }
    } else if (widget.onNoFeatureClick != null) {
      widget.onNoFeatureClick();
    }
  }

  Future<void> bringCameraToLocation(LatLng location,
      {double zoomLevel}) async {
    final update = zoomLevel != null
        ? CameraUpdate.newLatLngZoom(location, zoomLevel)
        : CameraUpdate.newLatLng(location);
    await _controller.animateCamera(update);
  }

  @override
  Future<void> bringCameraToUser() async {
    try {
      var position = await Geolocator.getLastKnownPosition();
      if (position == null) position = await Geolocator.getCurrentPosition();
      if (position != null) {
        var cameraUpdate = CameraUpdate.newCameraPosition(CameraPosition(
            target: LatLng(position.latitude, position.longitude),
            bearing: 0,
            tilt: 0,
            zoom: Map.userLocationZoomLevel));
        await _controller.animateCamera(cameraUpdate);
      }
    } on Exception catch (e) {
      print("Could not find position.");
      print(e);
    }
    await _controller
        .updateMyLocationTrackingMode(MyLocationTrackingMode.Tracking);
  }
}
