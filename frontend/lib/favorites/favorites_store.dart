import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class FavoritesStore {
  const FavoritesStore();

  static const _storage = FlutterSecureStorage();
  static const _favoritesKey = 'favorites';

  Future<List<int>> getFavorites() async {
    List<int> favorites = [];
    String? stringOfIds = await _storage.read(key: _favoritesKey);
    if (stringOfIds != null) {
      favorites = (jsonDecode(stringOfIds) as List).cast<int>();
    }
    return favorites;
  }

  Future<void> addFavorite(int storeId) async {
    List<int> favorites = await getFavorites();
    if (!favorites.contains(storeId)) {
      favorites.add(storeId);
      await _writeFavorites(favorites);
    }
  }

  Future<void> removeFavorite(int storeId) async {
    List<int> favorites = await getFavorites();
    if (favorites.remove(storeId)) {
      await _writeFavorites(favorites);
    }
  }

  Future<void> _writeFavorites(List<int> favorites) async {
    await _storage.write(key: _favoritesKey, value: jsonEncode(favorites));
  }
}
