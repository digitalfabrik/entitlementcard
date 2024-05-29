import 'package:geolocator/geolocator.dart';
import 'package:maplibre_gl/maplibre_gl.dart';

abstract class MapController {
  Future<void> bringCameraToLocation(LatLng location, {double zoomLevel});

  Future<void> setSymbol(LatLng location, int symbolId);

  Future<void> removeSymbol();

  Future<void> bringCameraToUser(Position position);

  Future<void> setTelemetryEnabled({bool enabled});
}
