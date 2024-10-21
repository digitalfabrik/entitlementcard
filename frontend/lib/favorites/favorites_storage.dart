import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import 'package:ehrenamtskarte/favorites/favorite_store.dart';

class FavoritesStorage {
  const FavoritesStorage();

  static const _favoritesKey = 'favorites';

  Future<List<FavoriteStore>> readFavorites() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final List<String>? data = prefs.getStringList(_favoritesKey);
    if (data == null) {
      return List<FavoriteStore>.empty(growable: true);
    }
    return data.map((item) => FavoriteStore.fromJson(jsonDecode(item) as Map<String, dynamic>)).toList();
  }

  Future<void> writeFavorites(List<FavoriteStore> favorites) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final List<String> data = favorites.map((item) => jsonEncode(item.toJson())).toList();
    await prefs.setStringList(_favoritesKey, data);
  }
}
