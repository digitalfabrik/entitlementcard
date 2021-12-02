import 'dart:io';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:maplibre_gl/mapbox_gl.dart';

import '../../configuration/configuration.dart';
import 'attribution_dialog.dart';
import 'map_controller.dart';

typedef OnFeatureClickCallback = void Function(dynamic feature);
typedef OnNoFeatureClickCallback = void Function();
typedef OnMapCreatedCallback = void Function(MapController controller);

class Map extends StatefulWidget {
  static const double userLocationZoomLevel = 13;
  static const double bavariaZoomLevel = 6;
  static const LatLng centerOfBavaria = LatLng(48.949444, 11.395);
  final OnFeatureClickCallback? onFeatureClick;
  final OnNoFeatureClickCallback? onNoFeatureClick;
  final OnMapCreatedCallback? onMapCreated;
  final List<String> onFeatureClickLayerFilter;
  final bool locationAvailable;
  final LatLng? userLocation;

  const Map({
    Key? key,
    required this.onFeatureClick,
    required this.onNoFeatureClick,
    required this.onFeatureClickLayerFilter,
    required this.locationAvailable,
    required this.onMapCreated,
    this.userLocation,
  }) : super(key: key);

  @override
  State createState() => _MapState();
}

const mapboxColor = Color(0xFF979897);

class _MapState extends State<Map> implements MapController {
  MaplibreMapController? _controller;
  Symbol? _symbol;
  bool _permissionGiven = false;
  Stack? _mapboxView;
  bool _isAnimating = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _permissionGiven = widget.locationAvailable;
  }

  @override
  Widget build(BuildContext context) {
    final config = Configuration.of(context);
    final statusBarHeight = MediaQuery.of(context).padding.top;
    final pixelRatio = MediaQuery.of(context).devicePixelRatio;
    final compassMargin = Platform.isIOS ? statusBarHeight / pixelRatio : statusBarHeight * pixelRatio;

    if (_mapboxView == null || !_isAnimating) {
      final userLocation = widget.userLocation;
      final cameraPosition = userLocation != null
          ? CameraPosition(target: userLocation, zoom: Map.userLocationZoomLevel)
          : const CameraPosition(target: Map.centerOfBavaria, zoom: Map.bavariaZoomLevel);

      _mapboxView = Stack(
        children: [
          MaplibreMap(
            initialCameraPosition: cameraPosition,
            styleString: config.mapStyleUrl,
            // We provide our own attribution menu
            attributionButtonMargins: const math.Point(-100, -100),
            // The Mapbox wordmark must be shown because of legal weirdness
            logoViewMargins: Platform.isIOS ? const math.Point(30, 5) : math.Point(30 * pixelRatio, 5 * pixelRatio),
            myLocationEnabled: _permissionGiven,
            myLocationTrackingMode: _permissionGiven ? MyLocationTrackingMode.Tracking : MyLocationTrackingMode.None,
            // required to prevent mapbox iOS from requesting location
            // permissions on startup, as discussed in #249
            myLocationRenderMode: MyLocationRenderMode.NORMAL,
            onMapCreated: _onMapCreated,
            onMapClick: _onMapClick,
            compassViewMargins: math.Point(Platform.isIOS ? compassMargin : 0, compassMargin),
            compassViewPosition: CompassViewPosition.TopRight,
          ),
          Positioned(
            bottom: 0,
            left: 0,
            child: IconButton(
              color: mapboxColor,
              padding: const EdgeInsets.all(5),
              constraints: const BoxConstraints(),
              iconSize: 20,
              icon: const Icon(Icons.info_outline),
              tooltip: 'Zeige Infos über das Urheberrecht der Kartendaten',
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) {
                    return const AttributionDialog();
                  },
                );
              },
            ),
          ),
        ],
      );
    }
    return _mapboxView ?? Container();
  }

  void _onMapCreated(MaplibreMapController controller) {
    _controller = controller;
    if (widget.locationAvailable) {
      _controller?.updateMyLocationTrackingMode(MyLocationTrackingMode.Tracking);
    }
    final onMapCreated = widget.onMapCreated;
    if (onMapCreated != null) {
      onMapCreated(this);
    }
  }

  @override
  Future<void> setTelemetryEnabled({bool enabled = false}) async {
    await _controller?.setTelemetryEnabled(enabled);
  }

  @override
  Future<void> removeSymbol() async {
    final symbol = _symbol;
    if (symbol == null) return;
    await _controller?.removeSymbol(symbol);
    _symbol = null;
  }

  @override
  Future<void> setSymbol(LatLng location, int categoryId) async {
    removeSymbol();
    _symbol = await _controller
        ?.addSymbol(SymbolOptions(iconSize: 1.5, geometry: location, iconImage: categoryId.toString()));
  }

  Future<void> _onMapClick(math.Point<double> point, clickCoordinates) async {
    final controller = _controller;
    if (controller == null) {
      return;
    }

    final onFeatureClick = widget.onFeatureClick;
    final onNoFeatureClick = widget.onNoFeatureClick;

    final pixelRatio = MediaQuery.of(context).devicePixelRatio;

    final touchTargetSize = pixelRatio * 38.0; // corresponds to 1 cm roughly
    final rect = Rect.fromCenter(center: Offset(point.x, point.y), width: touchTargetSize, height: touchTargetSize);

    final jsonFeatures = await controller.queryRenderedFeaturesInRect(rect, widget.onFeatureClickLayerFilter, null);
    final features = jsonFeatures.where((x) => x["properties"] != null && x["properties"]["categoryId"] != null).toList();
    if (features.isNotEmpty) {
      final mapPoint = await controller.toLatLng(point);
      int distSort(a, b) {
        final cA = a["geometry"]["coordinates"];
        final cB = b["geometry"]["coordinates"];
        // ignore: argument_type_not_assignable
        final dA = math.sqrt(math.pow(cA[0] - mapPoint.longitude, 2) + math.pow(cA[1] - mapPoint.latitude, 2));
        // ignore: argument_type_not_assignable
        final dB = math.sqrt(math.pow(cB[0] - mapPoint.longitude, 2) + math.pow(cB[1] - mapPoint.latitude, 2));
        return dA < dB ? -1 : 1;
      }

      features.sort(distSort);
      final featureInfo = features[0];
      if (featureInfo != null) {
        if (onFeatureClick != null) {
          onFeatureClick(featureInfo);
        }
      }
    } else if (onNoFeatureClick != null) {
      onNoFeatureClick();
    }
  }

  Future<void> _animate(Future F) async {
    _isAnimating = true;
    await F;
    _isAnimating = false;
  }

  @override
  Future<void> bringCameraToLocation(LatLng location, {double? zoomLevel}) async {
    final controller = _controller;
    if (controller == null) {
      return;
    }

    final update =
        zoomLevel != null ? CameraUpdate.newLatLngZoom(location, zoomLevel) : CameraUpdate.newLatLng(location);
    await controller.updateMyLocationTrackingMode(MyLocationTrackingMode.None);
    await _animate(controller.animateCamera(update));
  }

  @override
  Future<void> bringCameraToUser(Position position) async {
    final controller = _controller;
    if (controller == null) {
      return;
    }

    final cameraUpdate = CameraUpdate.newCameraPosition(
      CameraPosition(
        target: LatLng(position.latitude, position.longitude),
        bearing: 0,
        tilt: 0,
        zoom: Map.userLocationZoomLevel,
      ),
    );
    await _animate(controller.animateCamera(cameraUpdate));

    await controller.updateMyLocationTrackingMode(MyLocationTrackingMode.Tracking);
    if (!_permissionGiven) {
      setState(() => _permissionGiven = true);
    }
  }
}
