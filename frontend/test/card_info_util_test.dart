import 'dart:convert';

import 'package:ehrenamtskarte/identification/util/card_info_utils.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:test/test.dart';

void main() {
  group("hashCardInfo", () {
    // Equivalent tests exist in administration to ensure that the algorithms produce the same hashes.

    test("should be stable for a Bavarian Blue EAK", () {
      final cardInfo = CardInfo(
        fullName: 'Max Mustermann',
        expirationDay: 365 * 40, // Equals 14.600
        extensions: CardExtensions(
          extensionRegion: RegionExtension(
            regionId: 16,
          ),
          extensionBavariaCardType: BavariaCardTypeExtension(
            cardType: BavariaCardType.STANDARD,
          ),
        ),
      );
      final pepper = const Base64Decoder().convert("MvMjEqa0ulFDAgACElMjWA==");
      expect(cardInfo.hash(pepper), 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=');
    });

    test("should be stable for a Bavarian Golden EAK", () {
      final cardInfo = CardInfo(
        fullName: 'Max Mustermann',
        expirationDay: 365 * 40, // Equals 14.600
        extensions: CardExtensions(
          extensionRegion: RegionExtension(
            regionId: 16,
          ),
          extensionBavariaCardType: BavariaCardTypeExtension(
            cardType: BavariaCardType.STANDARD,
          ),
        ),
      );
      final pepper = const Base64Decoder().convert("MvMjEqa0ulFDAgACElMjWA==");
      expect(cardInfo.hash(pepper), 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=');
    });

    test("should be stable for a Nuernberg Pass", () {
      final cardInfo = CardInfo(
        fullName: 'Max Mustermann',
        expirationDay: 365 * 40, // Equals 14.600
        extensions: CardExtensions(
          extensionRegion: RegionExtension(
            regionId: 93,
          ),
          extensionBirthday: BirthdayExtension(
            birthday: -365 * 10,
          ),
          extensionNuernbergPassNumber: NuernbergPassNumberExtension(
            passNumber: 99999999,
          ),
        ),
      );
      final pepper = const Base64Decoder().convert("MvMjEqa0ulFDAgACElMjWA==");
      expect(cardInfo.hash(pepper), 'zogEJOhnSSp//8qhym/DdorQYgL/763Kfq4slWduxMg=');
    });
  });
}
