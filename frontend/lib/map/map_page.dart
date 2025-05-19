import 'package:ehrenamtskarte/location/determine_position.dart';
import 'package:ehrenamtskarte/map/map/map_controller.dart';
import 'package:ehrenamtskarte/map/map/map_with_futures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:maplibre_gl/maplibre_gl.dart';

class PhysicalStoreFeatureData {
  final int? id;
  final LatLng? coordinates;
  final int? categoryId;

  PhysicalStoreFeatureData(this.id, this.coordinates, this.categoryId);
}

typedef OnMapCreatedCallback = void Function(MapPageController controller);

class MapPage extends StatefulWidget {
  final OnMapCreatedCallback onMapCreated;
  final void Function(int? id) selectAcceptingStore;
  final void Function(bool followUserLocation) setFollowUserLocation;

  const MapPage(
      {super.key, required this.onMapCreated, required this.selectAcceptingStore, required this.setFollowUserLocation});

  @override
  State<StatefulWidget> createState() {
    return _MapPageState();
  }
}

abstract class MapPageController {
  Future<void> showAcceptingStore(PhysicalStoreFeatureData data);

  Future<void> bringCameraToUser(RequestedPosition data);

  Future<void> stopShowingAcceptingStore();
}

class _MapPageState extends State<MapPage> implements MapPageController {
  MapController? _controller;

  @override
  Widget build(BuildContext context) {
    // Until we have a (dark) map style for dark theme, the system overlay should always use dark fonts
    // on the bright map. See #613.
    // Just as Google Maps, we do NOT protect the system status bar with a gradient.
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark,
      child: MapWithFutures(
        onFeatureClick: _onFeatureClick,
        onNoFeatureClick: stopShowingAcceptingStore,
        onFeatureClickLayerFilter: const ['physical_stores'],
        setFollowUserLocation: widget.setFollowUserLocation,
        onMapCreated: (controller) {
          controller.setTelemetryEnabled(enabled: false);
          setState(() => _controller = controller);
          widget.onMapCreated(this);
        },
      ),
    );
  }

  @override
  Future<void> showAcceptingStore(PhysicalStoreFeatureData data, {bool selectedAcceptingStoreInMap = false}) async {
    final controller = _controller;

    if (controller == null) {
      return;
    }

    widget.selectAcceptingStore(data.id);

    final coordinates = data.coordinates;
    if (coordinates != null) {
      final categoryId = data.categoryId;
      if (categoryId != null) {
        await controller.setSymbol(coordinates, categoryId);
      }
      if (selectedAcceptingStoreInMap) {
        await controller.bringCameraToLocation(coordinates);
      } else {
        await controller.bringCameraToLocation(coordinates, zoomLevel: 13);
      }
    }
  }

  @override
  Future<void> stopShowingAcceptingStore() async {
    final controller = _controller;

    if (controller == null) {
      return;
    }

    widget.selectAcceptingStore(null);
    await controller.removeSymbol();
  }

  Future<void> _onFeatureClick(dynamic feature) async =>
      showAcceptingStore(_extractPhysicalStoreData(feature), selectedAcceptingStoreInMap: true);

  PhysicalStoreFeatureData _extractPhysicalStoreData(dynamic rawFeature) {
    final feature = rawFeature as Map<String, dynamic>;
    final properties = feature['properties'] as Map<String, dynamic>;
    final geometry = feature['geometry'] as Map<String, dynamic>;

    return PhysicalStoreFeatureData(
      _getIntOrNull(properties['id']),
      _getLatLngOrNull(geometry['coordinates']),
      _getIntOrNull(properties['categoryId']),
    );
  }

  int? _getIntOrNull(dynamic maybeInt) => (maybeInt is int) ? maybeInt : null;

  LatLng? _getLatLngOrNull(dynamic coordinates) {
    if (coordinates is! List) return null;
    final lat = coordinates[1];
    final lng = coordinates[0];
    if (lat is! double || lng is! double) return null;

    return LatLng(lat, lng);
  }

  @override
  Future<void> bringCameraToUser(RequestedPosition data) async {
    final controller = _controller;

    if (controller == null) {
      return;
    }

    final position = data.position;
    if (position != null) {
      await controller.bringCameraToUser(position);
    }
  }
}
