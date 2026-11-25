import 'dart:math';

import 'package:intl/intl.dart';

/// Returns the distance in kilometers between two coordinates.
// from https://www.movable-type.co.uk/scripts/latlong.html
double calcDistance(double lat1, double lng1, double lat2, double lng2) {
  const R = 6371; // kilometers
  final phi1 = lat1 * pi / 180; // φ, λ in radians
  final phi2 = lat2 * pi / 180;
  final deltaPhi = (lat2 - lat1) * pi / 180;
  final deltaLambda = (lng2 - lng1) * pi / 180;

  final a = sin(deltaPhi / 2) * sin(deltaPhi / 2) + cos(phi1) * cos(phi2) * sin(deltaLambda / 2) * sin(deltaLambda / 2);
  final c = 2 * atan2(sqrt(a), sqrt(1 - a));

  return R * c;
}

/// Formats a distance given in kilometers, e.g. "450 m", "2,5 km" or "1.250 km".
String formatDistance(double distance) {
  if (distance < 1) {
    return '${(distance * 100).round() * 10} m';
  } else if (distance < 10) {
    return '${NumberFormat('##.0', 'de').format(distance)} km';
  } else {
    return '${NumberFormat('###,###', 'de').format(distance)} km';
  }
}
