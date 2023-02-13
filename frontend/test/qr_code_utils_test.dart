import 'dart:convert';

import 'package:ehrenamtskarte/identification/qr_code_utils.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:test/test.dart';

void main() {
  group("messageToJsonObject", () {
    test("should map an empty cardInfo correctly", () {
      final cardInfo = CardInfo();
      expect(
        const QrCodeUtils().messageToJsonObject(cardInfo),
        {},
      );
    });

    test("should map a cardInfo for a Bavarian Blue EAK correctly", () {
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
      expect(const QrCodeUtils().messageToJsonObject(cardInfo), {
        '1': 'Max Mustermann',
        '2': '14600',
        '3': {
          '1': {'1': '16'}, // extensionRegion
          '4': {'1': '0'}, // extensionBavariaCardType
        },
      });
    });

    test("should map a cardInfo for a Bavarian Golden EAK correctly", () {
      final cardInfo = CardInfo(
        fullName: 'Max Mustermann',
        extensions: CardExtensions(
          extensionRegion: RegionExtension(
            regionId: 16,
          ),
          extensionBavariaCardType: BavariaCardTypeExtension(
            cardType: BavariaCardType.GOLD,
          ),
        ),
      );
      expect(const QrCodeUtils().messageToJsonObject(cardInfo), {
        '1': 'Max Mustermann',
        '3': {
          '1': {'1': '16'}, // extensionRegion
          '4': {'1': '1'}, // extensionBavariaCardType
        },
      });
    });

    test("should map a cardInfo for a Nuernberg Pass correctly", () {
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
      expect(const QrCodeUtils().messageToJsonObject(cardInfo), {
        '1': 'Max Mustermann',
        '2': '14600',
        '3': {
          '1': {'1': '93'}, // extensionRegion
          '2': {'1': '-3650'}, // extensionBirthday
          '3': {'1': '99999999'}, // extensionNuernbergPassNumber
        },
      });
    });
  });

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
      expect(const QrCodeUtils().hashCardInfo(cardInfo, pepper), 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=');
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
      expect(const QrCodeUtils().hashCardInfo(cardInfo, pepper), 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=');
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
      expect(const QrCodeUtils().hashCardInfo(cardInfo, pepper), 'zogEJOhnSSp//8qhym/DdorQYgL/763Kfq4slWduxMg=');
    });
  });
}
