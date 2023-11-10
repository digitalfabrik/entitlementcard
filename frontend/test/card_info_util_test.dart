import 'dart:convert';

import 'package:ehrenamtskarte/identification/util/card_info_utils.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:test/test.dart';

void main() {
  group('hashCardInfo', () {
    // Equivalent tests exist in administration to ensure that the algorithms produce the same hashes.
    test('should be stable for a Bavarian Blue EAK', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay = 365 * 40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 16)
          ..extensionBavariaCardType = (BavariaCardTypeExtension()..cardType = BavariaCardType.STANDARD));
      final pepper = const Base64Decoder().convert('MvMjEqa0ulFDAgACElMjWA==');
      expect(cardInfo.hash(pepper), 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=');
    });

    test('should be stable for a Bavarian Golden EAK', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay = 365 * 40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 16)
          ..extensionBavariaCardType = (BavariaCardTypeExtension()..cardType = BavariaCardType.STANDARD));
      final pepper = const Base64Decoder().convert('MvMjEqa0ulFDAgACElMjWA==');
      expect(cardInfo.hash(pepper), 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=');
    });

    test('should be stable for a Nuernberg Pass', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay = 365 * 40 // Equals 14.600
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
        ..expirationDay = 365 * 40 // Equals 14.600
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
        ..expirationDay = 365 * 40 // Equals 14.600
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
        ..expirationDay = 365 * 40 // Equals 14.600
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

  group('isCardNotYetValid', () {
    test('should return true if startDay is in the future', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay = 365 * 40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999)
          ..extensionStartDay = (StartDayExtension()..startDay = 365 * 70));
      expect(isCardNotYetValid(cardInfo), true);
    });

    test('should return false if startDay is in the past', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay = 365 * 40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999)
          ..extensionStartDay = (StartDayExtension()..startDay = 365 * 30));
      expect(isCardNotYetValid(cardInfo), false);
    });

    test('should be return false if no startDay was set', () {
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay = 365 * 40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999));
      expect(isCardNotYetValid(cardInfo), false);
    });
  });
}
