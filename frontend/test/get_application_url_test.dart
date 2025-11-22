import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/util/get_application_url.dart';
import 'package:test/test.dart';

void main() {
  group('constructApplicationUrlForCardExtension', () {
    final koblenzCardInfo = CardInfo()
      ..fullName = 'Karla Koblenz'
      ..extensions = (CardExtensions()
        ..extensionBirthday =
            (BirthdayExtension()..birthday = -365 * 10) // 1960-01-04
        ..extensionKoblenzReferenceNumber = (KoblenzReferenceNumberExtension()..referenceNumber = '123K'));

    test('should add all query parameters when all keys and card data are present', () {
      final applicationUrlWithParameters = constructApplicationUrlForCardExtension(
        applicationUrl: 'https://koblenz.sozialpass.app/erstellen',
        cardInfo: koblenzCardInfo,
        applicationQueryKeyName: 'Name',
        applicationQueryKeyBirthday: 'Geburtsdatum',
        applicationQueryKeyReferenceNumber: 'Referenznummer',
      );
      expect(
        applicationUrlWithParameters,
        'https://koblenz.sozialpass.app/erstellen?Name=Karla+Koblenz&Geburtsdatum=04.01.1960&Referenznummer=123K',
      );
    });

    test('should return the original URL if one of query keys is not configured', () {
      final applicationUrlWithParameters = constructApplicationUrlForCardExtension(
        applicationUrl: 'https://koblenz.sozialpass.app/erstellen',
        cardInfo: koblenzCardInfo,
        applicationQueryKeyName: 'Name',
        applicationQueryKeyBirthday: 'Geburtsdatum',
        applicationQueryKeyReferenceNumber: null,
      );
      expect(applicationUrlWithParameters, 'https://koblenz.sozialpass.app/erstellen');
    });

    test('should return the original URL if no query keys are configured', () {
      final cardInfo = CardInfo()..fullName = 'Max Mustermann';
      final applicationUrlWithParameters = constructApplicationUrlForCardExtension(
        applicationUrl: 'https://bayern.ehrenamtskarte.app/beantragen',
        cardInfo: cardInfo,
        applicationQueryKeyName: null,
        applicationQueryKeyBirthday: null,
        applicationQueryKeyReferenceNumber: null,
      );
      expect(applicationUrlWithParameters, 'https://bayern.ehrenamtskarte.app/beantragen');
    });
  });
}
