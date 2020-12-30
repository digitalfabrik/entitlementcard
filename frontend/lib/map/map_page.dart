import 'package:ehrenamtskarte/map/map/map_controller.dart';
import 'package:ehrenamtskarte/map/map/map_with_futures.dart';
import 'package:ehrenamtskarte/map/preview/accepting_store_summary.dart';
import 'package:flutter/material.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

class PhysicalStoreFeatureData {
  final int id;
  final LatLng coordinates;
  final int categoryId;
  PhysicalStoreFeatureData(this.id, this.coordinates, this.categoryId);
}

typedef void OnMapCreatedCallback(MapPageController controller);

class MapPage extends StatefulWidget {
  final OnMapCreatedCallback onMapCreated;

  const MapPage({Key key, this.onMapCreated}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _MapPageState();
  }
}

abstract class MapPageController {
  Future<void> showAcceptingStore(PhysicalStoreFeatureData data);
  Future<void> stopShowingAcceptingStore();
}

class _MapPageState extends State<MapPage> implements MapPageController {
  int selectedAcceptingStoreId;
  bool selectedAcceptingStoreInMap;
  MapController controller;

  @override
  Widget build(BuildContext context) {
    return Stack(
        children: [
      MapWithFutures(
        onFeatureClick: _onFeatureClick,
        onNoFeatureClick: stopShowingAcceptingStore,
        onFeatureClickLayerFilter: ["physical_stores"],
        onMapCreated: (controller) {
          setState(() => this.controller = controller);
          if (widget.onMapCreated != null) widget.onMapCreated(this);
        },
      ),
      AnimatedSwitcher(
          duration: Duration(milliseconds: 200),
          transitionBuilder: (child, animation) =>
              FadeTransition(opacity: animation, child: child),
          child: selectedAcceptingStoreId != null
              ? AcceptingStoreSummary(
                  selectedAcceptingStoreId,
                  key: ValueKey(selectedAcceptingStoreId),
                  hideShowOnMapButton: this.selectedAcceptingStoreInMap,
                )
              : null),
    ].where((element) => element != null).toList(growable: false));
  }

  Future<void> showAcceptingStore(PhysicalStoreFeatureData data,
      {bool selectedAcceptingStoreInMap = false}) async {
    setState(() {
      this.selectedAcceptingStoreId = data.id;
      this.selectedAcceptingStoreInMap = selectedAcceptingStoreInMap;
    });
    if (data.coordinates != null) {
      if (data.categoryId != null) {
        await controller.setSymbol(data.coordinates, data.categoryId);
      }
      await controller.bringCameraToLocation(data.coordinates);
    }
  }

  Future<void> stopShowingAcceptingStore() async {
    setState(() => this.selectedAcceptingStoreId = null);
    await controller.removeSymbol();
  }

  Future<void> _onFeatureClick(dynamic feature) async =>
      showAcceptingStore(_extractPhysicalStoreData(feature),
          selectedAcceptingStoreInMap: true);

  PhysicalStoreFeatureData _extractPhysicalStoreData(dynamic feature) =>
      PhysicalStoreFeatureData(
        _getIntOrNull(feature["properties"]["id"]),
        _getLatLngOrNull(feature["geometry"]["coordinates"]),
        _getIntOrNull(feature["properties"]["categoryId"]),
      );

  int _getIntOrNull(dynamic maybeInt) => (maybeInt is int) ? maybeInt : null;

  LatLng _getLatLngOrNull(dynamic coordinates) {
    if (!(coordinates is List)) return null;
    if (!(coordinates[0] is double && coordinates[1] is double)) return null;
    return LatLng(coordinates[1], coordinates[0]);
  }
}
