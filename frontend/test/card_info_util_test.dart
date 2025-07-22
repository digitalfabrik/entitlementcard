import 'dart:convert';

import 'package:ehrenamtskarte/identification/util/card_info_utils.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:test/test.dart';
import 'package:clock/clock.dart';
import 'package:timezone/data/latest.dart';
import 'package:timezone/timezone.dart';

void main() {
  setUpAll(() {
    initializeTimeZones();
  });

  group('hashCardInfo', () {
    // Equivalent tests exist in administration to ensure that the algorithms produce the same hashes.
    test('should be stable for a Bavarian Blue EAK', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay =
            365 *
            40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 16)
          ..extensionBavariaCardType = (BavariaCardTypeExtension()..cardType = BavariaCardType.STANDARD));
      final pepper = const Base64Decoder().convert('MvMjEqa0ulFDAgACElMjWA==');
      expect(cardInfo.hash(pepper), 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=');
    });

    test('should be stable for a Bavarian Golden EAK', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay =
            365 *
            40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 16)
          ..extensionBavariaCardType = (BavariaCardTypeExtension()..cardType = BavariaCardType.STANDARD));
      final pepper = const Base64Decoder().convert('MvMjEqa0ulFDAgACElMjWA==');
      expect(cardInfo.hash(pepper), 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=');
    });

    test('should be stable for a Nuernberg Pass', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay =
            365 *
            40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999));
      final pepper = const Base64Decoder().convert('MvMjEqa0ulFDAgACElMjWA==');
      expect(cardInfo.hash(pepper), 'zogEJOhnSSp//8qhym/DdorQYgL/763Kfq4slWduxMg=');
    });

    test('should be stable for a Nuernberg Pass with startDay', () {
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
      final pepper = const Base64Decoder().convert('MvMjEqa0ulFDAgACElMjWA==');
      expect(cardInfo.hash(pepper), '1ChHiAvWygwu+bH2yOZOk1zdmwTDZ4mkvu079cyuLjE=');
    });

    test('should be stable for a Nuernberg Pass with passId identifier', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay =
            365 *
            40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()
            ..passId = 99999999
            ..identifier = NuernergPassIdentifier.passId)
          ..extensionStartDay = (StartDayExtension()..startDay = 365 * 2));
      final pepper = const Base64Decoder().convert('MvMjEqa0ulFDAgACElMjWA==');
      expect(cardInfo.hash(pepper), '6BS3mnTtX1myCu9HSUD3e7KjaFBnX9Bkw7wgkrrWMZg=');
    });

    test('should be stable for a Nuernberg Pass with passNr identifier', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay =
            365 *
            40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()
            ..passId = 99999999
            ..identifier = NuernergPassIdentifier.passNr)
          ..extensionStartDay = (StartDayExtension()..startDay = 365 * 2));
      final pepper = const Base64Decoder().convert('MvMjEqa0ulFDAgACElMjWA==');
      expect(cardInfo.hash(pepper), 'A7KP1ypGngrmegXVmsyP9iMgheGHUDg9rnqbb9nlMWw=');
    });
  });

  /// Returns the number of days since the Unix epoch (1970-01-01 UTC)
  /// for the date that is [days] offset from today (UTC).
  ///
  /// Examples:
  /// ```dart
  /// getUtcDateWithOffset(0);  // today
  /// getUtcDateWithOffset(1);  // tomorrow
  /// getUtcDateWithOffset(-1); // yesterday
  /// ```
  int getEpochDaysFromUtcOffset(int days) {
    final now = DateTime.now().toUtc();
    final target = DateTime.utc(now.year, now.month, now.day + days);
    return target.difference(DateTime.utc(1970, 1, 1)).inDays;
  }

  group('isCardNotYetValid', () {
    test('should return true if startDay is tomorrow', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay =
            365 *
            40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999)
          ..extensionStartDay = (StartDayExtension()..startDay = getEpochDaysFromUtcOffset(1)));
      expect(isCardNotYetValid(cardInfo), true);
    });

    test('should return false if startDay is today', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay =
            365 *
            40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999)
          ..extensionStartDay = (StartDayExtension()..startDay = getEpochDaysFromUtcOffset(0)));
      expect(isCardNotYetValid(cardInfo), false);
    });

    test('should return false if startDay is yesterday', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay =
            365 *
            40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999)
          ..extensionStartDay = (StartDayExtension()..startDay = getEpochDaysFromUtcOffset(-1)));
      expect(isCardNotYetValid(cardInfo), false);
    });

    test('should return false if startDay is not set', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay =
            365 *
            40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999));
      expect(isCardNotYetValid(cardInfo), false);
    });

    test('should return false if startDay is today and current time is 00:01 (still previous day in UTC)', () {
      final berlinTimezone = getLocation('Europe/Berlin');

      // Fake current time: 2025-06-06 00:01 in Berlin (2025-06-05 22:01 UTC)
      withClock(Clock.fixed(TZDateTime(berlinTimezone, 2025, 6, 6, 0, 1)), () {
        final startDay = DateTime.utc(2025, 6, 6);
        final startDayEpoch = startDay.difference(DateTime.utc(1970, 1, 1)).inDays;

        final cardInfo = CardInfo()
          ..fullName = 'Max Mustermann'
          ..expirationDay = 365 * 40
          ..extensions = (CardExtensions()
            ..extensionRegion = (RegionExtension()..regionId = 93)
            ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
            ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999)
            ..extensionStartDay = (StartDayExtension()..startDay = startDayEpoch));

        expect(isCardNotYetValid(cardInfo), false);
      });
    });
  });

  group('isCardExpired', () {
    test('should return false if expirationDay is tomorrow', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay = getEpochDaysFromUtcOffset(1)
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999));
      expect(isCardExpired(cardInfo), false);
    });

    test('should return false if expirationDay is today', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay = getEpochDaysFromUtcOffset(0)
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999));
      expect(isCardExpired(cardInfo), false);
    });

    test('should return true if expirationDay is yesterday', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay = getEpochDaysFromUtcOffset(-1)
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999));
      expect(isCardExpired(cardInfo), true);
    });

    test('should return false if expirationDay is not set', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999));
      expect(isCardExpired(cardInfo), false);
    });

    test('should return true if expirationDay is yesterday and current time is 00:01 (still previous day in UTC)', () {
      final berlinTimezone = getLocation('Europe/Berlin');

      // Fake current time: 2025-06-07 00:01 in Berlin (2025-06-06 22:01 UTC)
      withClock(Clock.fixed(TZDateTime(berlinTimezone, 2025, 6, 7, 0, 1)), () {
        final expirationDay = DateTime.utc(2025, 6, 6);
        final expirationDayEpoch = expirationDay.difference(DateTime.utc(1970, 1, 1)).inDays;

        final cardInfo = CardInfo()
          ..fullName = 'Max Mustermann'
          ..expirationDay = expirationDayEpoch
          ..extensions = (CardExtensions()
            ..extensionRegion = (RegionExtension()..regionId = 93)
            ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
            ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999));
        expect(isCardExpired(cardInfo), true);
      });
    });
  });

  group('getFormattedBirthday', () {
    test('should return null if birthday is not set', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay = getEpochDaysFromUtcOffset(1)
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999));
      expect(getFormattedBirthday(cardInfo), null);
    });

    test('should return correctly formatted date if birthday is present', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay = getEpochDaysFromUtcOffset(1)
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999));
      expect(getFormattedBirthday(cardInfo), '04.01.1960');
    });
  });
}
