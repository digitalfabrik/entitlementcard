import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/util/get_application_url.dart';
import 'package:test/test.dart';

void main() {
  group('getApplicationUrlForCardExtension', () {
    test('results in url with queryParams for koblenz', () {
      final applicationUrl = 'https://koblenz.sozialpass.app/erstellen';
      final applicationUrlQueryKeyName = 'Name';
      final applicationUrlQueryKeyBirthday = 'Geburtsdatum';
      final applicationUrlQueryKeyReferenceNumber = 'Referenznummer';
      final cardInfo = CardInfo()
        ..fullName = 'Karla Koblenz'
        ..expirationDay = 365 * 40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionKoblenzReferenceNumber = (KoblenzReferenceNumberExtension()..referenceNumber = '123K'));
      final applicationUrlWithParameters = getApplicationUrlForCardExtension(applicationUrl, cardInfo,
          applicationUrlQueryKeyName, applicationUrlQueryKeyBirthday, applicationUrlQueryKeyReferenceNumber);
      expect(applicationUrlWithParameters,
          'https://koblenz.sozialpass.app/erstellen?Name=Karla+Koblenz&Geburtsdatum=04.01.1960&Referenznummer=123K');
    });

    test('results in url without queryParams if no keys were provided and card info bayern', () {
      final applicationUrl = 'https://bayern.ehrenamtskarte.app/beantragen';
      final String? applicationUrlQueryKeyName = null;
      final String? applicationUrlQueryKeyBirthday = null;
      final String? applicationUrlQueryKeyReferenceNumber = null;
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay = 365 * 40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 16)
          ..extensionBavariaCardType = (BavariaCardTypeExtension()..cardType = BavariaCardType.STANDARD));
      final applicationUrlWithParameters = getApplicationUrlForCardExtension(applicationUrl, cardInfo,
          applicationUrlQueryKeyName, applicationUrlQueryKeyBirthday, applicationUrlQueryKeyReferenceNumber);
      expect(applicationUrlWithParameters, 'https://bayern.ehrenamtskarte.app/beantragen');
    });

    test('results in url without queryParams if no keys were provided and card info nuernberg', () {
      final applicationUrl = 'https://beantragen.nuernberg.sozialpass.app';
      final String? applicationUrlQueryKeyName = null;
      final String? applicationUrlQueryKeyBirthday = null;
      final String? applicationUrlQueryKeyReferenceNumber = null;
      final cardInfo = CardInfo()
        ..fullName = 'Max Mustermann'
        ..expirationDay = 365 * 40 // Equals 14.600
        ..extensions = (CardExtensions()
          ..extensionRegion = (RegionExtension()..regionId = 93)
          ..extensionBirthday = (BirthdayExtension()..birthday = -365 * 10)
          ..extensionNuernbergPassId = (NuernbergPassIdExtension()..passId = 99999999)
          ..extensionStartDay = (StartDayExtension()..startDay = 365 * 2));
      final applicationUrlWithParameters = getApplicationUrlForCardExtension(applicationUrl, cardInfo,
          applicationUrlQueryKeyName, applicationUrlQueryKeyBirthday, applicationUrlQueryKeyReferenceNumber);
      expect(applicationUrlWithParameters, 'https://beantragen.nuernberg.sozialpass.app');
    });
  });
}
