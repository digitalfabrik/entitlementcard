import 'package:ehrenamtskarte/graphql_gen/graphql_queries/stores/accepting_stores_by_physical_store_ids.graphql.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('AcceptingStoreModel', () {
    setUp(() async {
      await LocaleSettings.setLocale(AppLocale.en);
    });

    test('fromGraphql parses complete data correctly', () {
      final storeMap = {
        'id': 1,
        'categoryId': 9,
        'name': 'Test Store',
        'physicalStore': {
          'id': 101,
          'address': {
            'location': 'Test City',
            'street': 'Test Street 1',
            'postalCode': '12345',
            '__typename': 'Address',
          },
          'coordinates': {'lat': 10.0, 'lng': 20.0, '__typename': 'Coordinates'},
          '__typename': 'PhysicalStore',
        },
        'contact': {
          'id': 1,
          'website': 'https://example.com',
          'telephone': '123456',
          'email': 'test@example.com',
          '__typename': 'Contact',
        },
        'descriptions': [
          {'locale': 'EN', 'text': 'English', '__typename': 'LocalizedDescription'},
          {'locale': 'DE', 'text': 'German', '__typename': 'LocalizedDescription'},
        ],
        '__typename': 'AcceptingStore',
      };
      final store = Query$AcceptingStoresByPhysicalStoreIds$stores.fromJson(storeMap);
      final model = AcceptingStoreModel.fromGraphql(store);

      expect(model.id, 1);
      expect(model.physicalStoreId, 101);
      expect(model.categoryId, 9);
      expect(model.name, 'Test Store');
      expect(model.location, 'Test City');
      expect(model.street, 'Test Street 1');
      expect(model.postalCode, '12345');
      expect(model.coordinates?.lat, 10.0);
      expect(model.coordinates?.lng, 20.0);
      expect(model.website, 'https://example.com');
      expect(model.telephone, '123456');
      expect(model.email, 'test@example.com');
      expect(model.description, 'English');
    });

    test('fromGraphql handles nulls and missing optional fields', () {
      final storeMap = {
        'id': 2,
        'categoryId': 10,
        'name': null,
        'physicalStore': null,
        'contact': {'id': 2, 'website': null, 'telephone': null, 'email': null, '__typename': 'Contact'},
        'descriptions': <Map<String, dynamic>>[],
        '__typename': 'AcceptingStore',
      };
      final store = Query$AcceptingStoresByPhysicalStoreIds$stores.fromJson(storeMap);
      final model = AcceptingStoreModel.fromGraphql(store);

      expect(model.id, 2);
      expect(model.categoryId, 10);
      expect(model.physicalStoreId, null);
      expect(model.name, null);
      expect(model.description, null);
      expect(model.coordinates, null);
      expect(model.location, null);
    });

    test('localization picks current locale', () {
      final storeMap = {
        'id': 1,
        'categoryId': 1,
        'name': 'Test',
        'physicalStore': {
          'id': 101,
          'address': {'location': null, 'street': null, 'postalCode': null, '__typename': 'Address'},
          'coordinates': {'lat': 0.0, 'lng': 0.0, '__typename': 'Coordinates'},
          '__typename': 'PhysicalStore',
        },
        'contact': {'id': 1, 'website': null, 'telephone': null, 'email': null, '__typename': 'Contact'},
        'descriptions': [
          {'locale': 'EN', 'text': 'English', '__typename': 'LocalizedDescription'},
          {'locale': 'DE', 'text': 'German', '__typename': 'LocalizedDescription'},
        ],
        '__typename': 'AcceptingStore',
      };
      final store = Query$AcceptingStoresByPhysicalStoreIds$stores.fromJson(storeMap);
      final model = AcceptingStoreModel.fromGraphql(store);

      expect(model.description, 'English');
    });

    test('localization falls back to German if current locale not found', () {
      final storeMap = {
        'id': 1,
        'categoryId': 1,
        'name': 'Test',
        'physicalStore': {
          'id': 101,
          'address': {'location': null, 'street': null, 'postalCode': null, '__typename': 'Address'},
          'coordinates': {'lat': 0.0, 'lng': 0.0, '__typename': 'Coordinates'},
          '__typename': 'PhysicalStore',
        },
        'contact': {'id': 1, 'website': null, 'telephone': null, 'email': null, '__typename': 'Contact'},
        'descriptions': [
          {'locale': 'FR', 'text': 'French', '__typename': 'LocalizedDescription'},
          {'locale': 'DE', 'text': 'German', '__typename': 'LocalizedDescription'},
        ],
        '__typename': 'AcceptingStore',
      };
      final store = Query$AcceptingStoresByPhysicalStoreIds$stores.fromJson(storeMap);
      final model = AcceptingStoreModel.fromGraphql(store);

      expect(model.description, 'German');
    });

    test('localization returns null if neither current nor fallback found', () {
      final storeMap = {
        'id': 1,
        'categoryId': 1,
        'name': 'Test',
        'physicalStore': {
          'id': 101,
          'address': {'location': null, 'street': null, 'postalCode': null, '__typename': 'Address'},
          'coordinates': {'lat': 0.0, 'lng': 0.0, '__typename': 'Coordinates'},
          '__typename': 'PhysicalStore',
        },
        'contact': {'id': 1, 'website': null, 'telephone': null, 'email': null, '__typename': 'Contact'},
        'descriptions': [
          {'locale': 'FR', 'text': 'French', '__typename': 'LocalizedDescription'},
        ],
        '__typename': 'AcceptingStore',
      };
      final store = Query$AcceptingStoresByPhysicalStoreIds$stores.fromJson(storeMap);
      final model = AcceptingStoreModel.fromGraphql(store);

      expect(model.description, null);
    });
  });
}
