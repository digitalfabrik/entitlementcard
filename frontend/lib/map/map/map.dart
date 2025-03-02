import 'dart:io';
import 'dart:math' as math;

import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/map/map/attribution_dialog.dart';
import 'package:ehrenamtskarte/map/map/map_controller.dart';
import 'package:ehrenamtskarte/map/map/screen_parent_resizer.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:maplibre_gl/maplibre_gl.dart';
import 'package:tuple/tuple.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

typedef OnFeatureClickCallback = void Function(dynamic feature);
typedef OnNoFeatureClickCallback = void Function();
typedef OnMapCreatedCallback = void Function(MapController controller);

class MapContainer extends StatefulWidget {
  static const double zoomLevelUserLocation = 13;
  static final double zoomLevelOverview = buildConfig.mapInitialZoomLevel.toDouble();
  static final LatLng centerOfProject =
      LatLng(buildConfig.mapInitialCoordinatesLat, buildConfig.mapInitialCoordinatesLng);
  final OnFeatureClickCallback? onFeatureClick;
  final OnNoFeatureClickCallback? onNoFeatureClick;
  final OnMapCreatedCallback? onMapCreated;
  final void Function(bool followUserLocation) setFollowUserLocation;
  final List<String> onFeatureClickLayerFilter;
  final bool locationAvailable;
  final LatLng? userLocation;

  const MapContainer({
    super.key,
    required this.onFeatureClick,
    required this.onNoFeatureClick,
    required this.onFeatureClickLayerFilter,
    required this.locationAvailable,
    required this.onMapCreated,
    required this.setFollowUserLocation,
    this.userLocation,
  });

  @override
  State createState() => _MapContainerState();
}

const mapboxColor = Color(0xFF979897);

class _MapContainerState extends State<MapContainer> implements MapController {
  MapLibreMapController? _controller;
  Symbol? _symbol;
  bool _permissionGiven = false;
  bool _isMapInitialized = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _permissionGiven = widget.locationAvailable;
  }

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final config = Configuration.of(context);
    final statusBarHeight = MediaQuery.of(context).padding.top;
    final pixelRatio = MediaQuery.of(context).devicePixelRatio;
    final compassMargin = Platform.isIOS ? statusBarHeight / pixelRatio : statusBarHeight * pixelRatio;

    final userLocation = widget.userLocation;
    final cameraPosition = userLocation != null
        ? CameraPosition(target: userLocation, zoom: MapContainer.zoomLevelUserLocation)
        : CameraPosition(target: MapContainer.centerOfProject, zoom: MapContainer.zoomLevelOverview);

    final mapLibreView = Stack(
      children: [
        MapLibreMap(
          initialCameraPosition: cameraPosition,
          styleString: config.mapStyleUrl,
          // We provide our own attribution menu
          attributionButtonMargins: const math.Point(-100, -100),
          // There is no way to remove the logo, so set the margins to a really large value to hide it
          logoViewMargins: const math.Point(double.maxFinite, double.maxFinite),
          myLocationEnabled: _permissionGiven,
          myLocationTrackingMode: _permissionGiven ? MyLocationTrackingMode.tracking : MyLocationTrackingMode.none,
          // required to prevent mapbox iOS from requesting location
          // permissions on startup, as discussed in #249
          myLocationRenderMode: MyLocationRenderMode.normal,
          onMapCreated: _onMapCreated,
          onMapClick: _onMapClick,
          onStyleLoadedCallback: () {},
          compassViewMargins: math.Point(Platform.isIOS ? compassMargin : 0, compassMargin),
          compassViewPosition: CompassViewPosition.topRight,
          minMaxZoomPreference: const MinMaxZoomPreference(4.0, 18.0),
          onCameraTrackingDismissed: () => widget.setFollowUserLocation(false),
        ),
        Positioned(
          bottom: 3,
          left: 3,
          child: IconButton(
            color: mapboxColor,
            iconSize: 20,
            icon: const Icon(Icons.info_outline),
            tooltip: t.map.showMapCopyright,
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => const AttributionDialog(),
              );
            },
          ),
        ),
      ],
    );

    // Apply ScreenParentResizer only on android
    // https://github.com/flutter-mapbox-gl/maps/issues/195
    return defaultTargetPlatform == TargetPlatform.android
        ? ScreenParentResizer(
            childInitialized: _isMapInitialized,
            child: mapLibreView,
          )
        : mapLibreView;
  }

  void _onMapCreated(MapLibreMapController controller) {
    if (!mounted) return;

    setState(() {
      _controller = controller;
      _isMapInitialized = true;
    });

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
    final targetLatLng = await controller.toLatLng(point);
    if (!mounted) return;

    final onFeatureClick = widget.onFeatureClick;
    final onNoFeatureClick = widget.onNoFeatureClick;

    final pixelRatio = MediaQuery.of(context).devicePixelRatio;

    final touchTargetSize = pixelRatio * 38.0; // corresponds to 1 cm roughly
    final rect = Rect.fromCenter(center: Offset(point.x, point.y), width: touchTargetSize, height: touchTargetSize);

    final jsonFeatures = await controller.queryRenderedFeaturesInRect(rect, widget.onFeatureClickLayerFilter, null);
    final features = jsonFeatures.map((e) => e as Map<String, dynamic>).where((x) {
      if (x['properties'] == null) return false;
      final properties = x['properties'] as Map<String, dynamic>;
      if (properties['categoryId'] == null) return false;
      return true;
    }).toList();

    if (features.isNotEmpty && onFeatureClick != null) {
      final feature = _getClosestFeature(features, targetLatLng);
      onFeatureClick(feature);
    } else if (onNoFeatureClick != null) {
      onNoFeatureClick();
    }
  }

  dynamic _getClosestFeature(List<dynamic> features, LatLng target) {
    LatLng extractLatLngFromFeature(dynamic rawFeature) {
      final feature = rawFeature as Map<String, dynamic>;
      final geometry = feature['geometry'] as Map<String, dynamic>;
      final coordinates = geometry['coordinates'] as List<dynamic>;
      final latitude = coordinates[1] as double;
      final longitude = coordinates[0] as double;
      return LatLng(latitude, longitude);
    }

    double calculateDistance(LatLng point1, LatLng point2) {
      // We use the equirectangular distance approximation for a very fast comparison.
      // LatLng encodes degrees, so we need to convert to radians.
      const double degreeToRadians = 180.0 / math.pi;
      const double earthRadius = 6371; // radius of the earth in km
      final double x = (point2.longitude - point1.longitude) *
          degreeToRadians *
          math.cos(0.5 * (point2.latitude + point1.latitude) * degreeToRadians);
      final double y = (point2.latitude - point1.latitude) * degreeToRadians;
      return earthRadius * math.sqrt(x * x + y * y);
    }

    final minimalDistanceFeature =
        features.fold(null, (Tuple2<dynamic, double>? currentFeatureWithDistance, dynamic nextFeature) {
      final nextFeatureLatLng = extractLatLngFromFeature(nextFeature);
      final nextFeatureDistance = calculateDistance(nextFeatureLatLng, target);
      if (currentFeatureWithDistance != null && currentFeatureWithDistance.item2 < nextFeatureDistance) {
        return currentFeatureWithDistance;
      }
      return Tuple2(nextFeature, nextFeatureDistance);
    });

    return minimalDistanceFeature?.item1;
  }

  @override
  Future<void> bringCameraToLocation(LatLng location, {double? zoomLevel}) async {
    final controller = _controller;
    if (controller == null) {
      return;
    }

    final update =
        zoomLevel != null ? CameraUpdate.newLatLngZoom(location, zoomLevel) : CameraUpdate.newLatLng(location);
    await controller.updateMyLocationTrackingMode(MyLocationTrackingMode.none);
    await controller.animateCamera(update);
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
        zoom: MapContainer.zoomLevelUserLocation,
      ),
    );
    await controller.animateCamera(cameraUpdate);
    if (!mounted) return;

    await controller.updateMyLocationTrackingMode(MyLocationTrackingMode.tracking);
    if (!mounted) return;
    if (!_permissionGiven) {
      setState(() => _permissionGiven = true);
    }
  }
}
