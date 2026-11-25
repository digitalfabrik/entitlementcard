import 'package:ehrenamtskarte/util/distance_utils.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('formatDistance', () {
    test('formats distances below 1 km in meters rounded to 10 m', () {
      expect(formatDistance(0.444), '440 m');
    });

    test('formats distances below 10 km with one decimal', () {
      expect(formatDistance(2.54), '2,5 km');
    });

    test('formats distances from 10 km without decimals and with thousands separator', () {
      expect(formatDistance(1250.4), '1.250 km');
    });
  });

  group('calcDistance', () {
    test('returns 0 for identical coordinates', () {
      expect(calcDistance(48.37, 10.89, 48.37, 10.89), 0);
    });

    test('returns the distance in kilometers', () {
      // Augsburg to Munich is about 57 km as the crow flies
      expect(calcDistance(48.3705, 10.8978, 48.1351, 11.5820), closeTo(57, 1));
    });
  });
}
