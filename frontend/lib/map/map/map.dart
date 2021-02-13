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
  final bool locationAvailable;

  const Map(
      {this.onFeatureClick,
      this.onNoFeatureClick,
      this.onFeatureClickLayerFilter,
      this.locationAvailable,
      this.onMapCreated});

  @override
  State createState() => _MapState();
}

class _MapState extends State<Map> implements MapController {
  MapboxMapController _controller;
  Symbol _symbol;
  bool _permissionGiven;
  MapboxMap _mapboxMap;
  bool _isAnimating = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _permissionGiven = widget.locationAvailable;
  }

  @override
  Widget build(BuildContext context) {
    final config = Configuration.of(context);
    var statusBarHeight = MediaQuery.of(context).padding.top;
    var pixelRatio = MediaQuery.of(context).devicePixelRatio;
    var compassMargin = statusBarHeight * pixelRatio;
    if (_mapboxMap == null || !_isAnimating) {
      _mapboxMap = MapboxMap(
        initialCameraPosition: CameraPosition(
            target: Map.initialLocation,
            zoom: widget.locationAvailable
                ? Map.userLocationZoomLevel
                : Map.initialZoomLevel),
        styleString: config.mapStyleUrl,
        myLocationEnabled: _permissionGiven,
        myLocationTrackingMode: _permissionGiven
            ? MyLocationTrackingMode.Tracking
            : MyLocationTrackingMode.None,
        onMapCreated: _onMapCreated,
        onMapClick: _onMapClick,
        compassViewMargins: Point(0, compassMargin),
        compassViewPosition: CompassViewPosition.TopRight,
      );
    }
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

  Future<void> _animate(Future F) async {
    _isAnimating = true;
    await F;
    _isAnimating = false;
  }

  Future<void> bringCameraToLocation(LatLng location,
      {double zoomLevel}) async {
    final update = zoomLevel != null
        ? CameraUpdate.newLatLngZoom(location, zoomLevel)
        : CameraUpdate.newLatLng(location);
    await _animate(_controller.animateCamera(update));
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
        await _animate(_controller.animateCamera(cameraUpdate));
        await _controller
            .updateMyLocationTrackingMode(MyLocationTrackingMode.Tracking);
        if (!_permissionGiven) {
          setState(() => _permissionGiven = true);
        }
      }
    } on Exception catch (e) {
      print("Could not find position.");
      print(e);
    }
  }
}
