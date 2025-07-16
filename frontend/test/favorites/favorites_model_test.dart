import 'package:ehrenamtskarte/favorites/favorite_store.dart';
import 'package:ehrenamtskarte/favorites/favorites_model.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  group('favorites model', () {
    test('init favorites without data', () async {
      SharedPreferences.setMockInitialValues({});
      final model = FavoritesModel();
      await model.initialize();

      expect(model.isInitialized, true);
      expect(model.favoriteStores.length, 0);
      expect(model.getFavoriteIds().length, 0);
    });

    test('init favorites with data', () async {
      SharedPreferences.setMockInitialValues(<String, List<String>>{
        'favorites': ['{"storeId":1,"storeName":"Test","categoryId":1}'],
      });
      final model = FavoritesModel();
      await model.initialize();

      expect(model.isInitialized, true);
      expect(model.isFavorite(1), true);
    });

    test('init favorites with exception', () async {
      SharedPreferences.setMockInitialValues(<String, List<String>>{
        'favorites': ['corrupted data'],
      });
      final model = FavoritesModel();
      await model.initialize();

      expect(model.isInitialized, false);
    });

    test('save favorite', () async {
      SharedPreferences.setMockInitialValues({});
      final model = FavoritesModel();
      await model.initialize();
      await model.saveFavorite(FavoriteStore(1, 'Test', 1));

      expect(model.favoriteStores.length, 1);
      expect(model.getFavoriteIds().length, 1);
      expect(model.isFavorite(1), true);
    });

    test('remove favorite', () async {
      SharedPreferences.setMockInitialValues(<String, List<String>>{
        'favorites': ['{"storeId":1,"storeName":"Test","categoryId":1}'],
      });
      final model = FavoritesModel();
      await model.initialize();
      await model.removeFavorite(1);

      expect(model.favoriteStores.length, 0);
      expect(model.getFavoriteIds().length, 0);
      expect(model.isFavorite(1), false);
    });
  });
}
