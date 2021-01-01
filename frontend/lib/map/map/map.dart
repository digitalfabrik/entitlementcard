import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

import '../../configuration.dart';

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
      this.myLocationEnabled = true});

  @override
  State createState() => _MapState();
}

class _MapState extends State<Map> {
  MapboxMapController _controller;
  MapboxMap _mapboxMap;

  @override
  void didChangeDependencies() {
    final config = Configuration.of(context);
    _mapboxMap = new MapboxMap(
      initialCameraPosition: CameraPosition(
          target: Map.initialLocation,
          zoom: widget.myLocationEnabled
              ? Map.userLocationZoomLevel
              : Map.initialZoomLevel),
      styleString: config.mapStyleUrl,
      myLocationEnabled: widget.myLocationEnabled,
      myLocationTrackingMode: widget.myLocationEnabled
          ? MyLocationTrackingMode.Tracking
          : MyLocationTrackingMode.None,
      onMapCreated: _onMapCreated,
      onMapClick: _onMapClick,
      compassViewPosition: CompassViewPosition.BottomRight,
    );
    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    return _mapboxMap;
  }

  Future<void> _onMapCreated(MapboxMapController controller) async {
    this._controller = controller;
    if (widget.myLocationEnabled) {
      // zoom out to initial zoom level if can not get location
      await _controller
          .requestMyLocationLatLng()
          .then((_) {}, // like catchError, but do not enforce return type
              onError: (_) async {
        await _controller.moveCamera(CameraUpdate.zoomTo(Map.initialZoomLevel));
      });
    }
  }

  Symbol _symbol;

  Future<void> _removeSymbol() async {
    if (_symbol != null) {
      await _controller.removeSymbol(_symbol);
      _symbol = null;
    }
  }

  Future<void> _addSymbol(LatLng location, int categoryId) async {
    _symbol = await _controller.addSymbol(new SymbolOptions(
        iconSize: 1.5, geometry: location, iconImage: categoryId.toString()));
  }

  void _onMapClick(Point<double> point, clickCoordinates) async {
    var features = await this._controller.queryRenderedFeatures(
        point, widget.onFeatureClickLayerFilter ?? [], null);
    if (features.isNotEmpty) {
      var featureInfo = json.decode(features[0]);
      if (featureInfo != null) {
        if (widget.onFeatureClick != null) widget.onFeatureClick(featureInfo);
        var coordinates = featureInfo["geometry"]["coordinates"];
        var location = new LatLng(coordinates[1], coordinates[0]);
        await _removeSymbol();
        await _addSymbol(location, featureInfo["properties"]["categoryId"]);
        await _bringCameraToLocation(location);
      }
    } else if (widget.onNoFeatureClick != null) {
      await _removeSymbol();
      widget.onNoFeatureClick();
    }
  }

  Future<void> _bringCameraToLocation(LatLng location,
      {double zoomLevel}) async {
    final update = zoomLevel != null
        ? CameraUpdate.newLatLngZoom(location, zoomLevel)
        : CameraUpdate.newLatLng(location);
    await _controller.animateCamera(update);
  }
}
