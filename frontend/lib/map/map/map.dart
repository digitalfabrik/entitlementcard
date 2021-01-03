import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

import '../../configuration.dart';
import 'map_controller.dart';

typedef OnFeatureClickCallback = void Function(dynamic feature);
typedef OnNoFeatureClickCallback = void Function();
typedef void OnMapCreatedCallback(MapController controller);

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
  bool _initialLocationUpdateStillPending = true;

  @override
  void didChangeDependencies() {
    final config = Configuration.of(context);
    _mapboxMap = MapboxMap(
      initialCameraPosition: CameraPosition(
          target: Map.initialLocation, zoom: Map.initialZoomLevel),
      styleString: config.mapStyleUrl,
      myLocationEnabled: widget.myLocationEnabled,
      myLocationTrackingMode: widget.myLocationEnabled
          ? MyLocationTrackingMode.Tracking
          : MyLocationTrackingMode.None,
      onMapCreated: _onMapCreated,
      onMapClick: _onMapClick,
      onUserLocationUpdated: (location) => _onUserLocationUpdated(),
      onCameraTrackingDismissed: _onCameraTrackingDismissed,
    );
    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    return _mapboxMap;
  }

  _onMapCreated(controller) async {
    _controller = controller;
    var updateLocation = _controller
        .requestMyLocationLatLng()
        .then((_) => _onUserLocationUpdated());
    if (widget.onMapCreated != null) {
      widget.onMapCreated(this);
    }
    await updateLocation;
  }

  removeSymbol() async {
    if (_symbol == null) return;
    await _controller.removeSymbol(_symbol);
    _symbol = null;
  }

  setSymbol(LatLng location, int categoryId) async {
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

  Future<void> _onUserLocationUpdated() async {
    if (_initialLocationUpdateStillPending) {
      setState(() => _initialLocationUpdateStillPending = false);
      await _controller
          .animateCamera(CameraUpdate.zoomTo(Map.userLocationZoomLevel));
    }
  }

  void _onCameraTrackingDismissed() {
    if (_initialLocationUpdateStillPending) {
      setState(() => _initialLocationUpdateStillPending = false);
    }
  }
}
