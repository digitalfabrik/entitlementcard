import 'package:maplibre_gl/mapbox_gl.dart';

abstract class MapController {
  Future<void> bringCameraToLocation(LatLng location, {double zoomLevel});

  Future<void> setSymbol(LatLng location, int categoryId);

  Future<void> removeSymbol();

  Future<void> bringCameraToUser();

  Future<void> setTelemetryEnabled({bool enabled});
}
