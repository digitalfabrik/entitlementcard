import 'package:ehrenamtskarte/identification/util/canonical_json.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:test/test.dart';

void main() {
  group('toCanonicalJsonObject', () {
    test('should map an empty cardInfo correctly', () {
      final cardInfo = CardInfo();
      expect(cardInfo.toCanonicalJsonObject(), <String, dynamic>{});
    });

    test('should map a cardInfo for a Bavarian Blue EAK correctly', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay =
            365 *
            40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 16)
          ..extensionBavariaCardType = (BavariaCardTypeExtension()..cardType = BavariaCardType.STANDARD));
      expect(cardInfo.toCanonicalJsonObject(), {
        '1': 'Max Mustermann',
        '2': '14600',
        '3': {
          '1': {'1': '16'}, // extensionRegion
          '4': {'1': '0'}, // extensionBavariaCardType
        },
      });
    });

    test('should map a cardInfo for a Bavarian Golden EAK correctly', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 16)
          ..extensionBavariaCardType = (BavariaCardTypeExtension()..cardType = BavariaCardType.GOLD));
      expect(cardInfo.toCanonicalJsonObject(), {
        '1': 'Max Mustermann',
        '3': {
          '1': {'1': '16'}, // extensionRegion
          '4': {'1': '1'}, // extensionBavariaCardType
        },
      });
    });

    test('should map a cardInfo for a Nuernberg Pass correctly', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay =
            365 *
            40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999));
      expect(cardInfo.toCanonicalJsonObject(), {
        '1': 'Max Mustermann',
        '2': '14600',
        '3': {
          '1': {'1': '93'}, // extensionRegion
          '2': {'1': '-3650'}, // extensionBirthday
          '3': {'1': '99999999'}, // extensionNuernbergPassId
        },
      });
    });

    test('should map a cardInfo for a Nuernberg Pass wit startDay correctly', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay =
            365 *
            40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999)
          ..extensionStartDay = (StartDayExtension()..startDay = 365 * 2));
      expect(cardInfo.toCanonicalJsonObject(), {
        '1': 'Max Mustermann',
        '2': '14600',
        '3': {
          '1': {'1': '93'}, // extensionRegion
          '2': {'1': '-3650'}, // extensionBirthday
          '3': {'1': '99999999'}, // extensionNuernbergPassId
          '5': {'1': '730'}, // startDay extension
        },
      });
    });
  });
}
