import 'dart:developer';

import 'package:flutter/cupertino.dart';

import 'package:ehrenamtskarte/favorites/favorites_storage.dart';
import 'package:ehrenamtskarte/favorites/favorite_store.dart';

class FavoritesModel extends ChangeNotifier {
  List<FavoriteStore> _favoriteStores = [];
  bool _isInitialized = false;

  Future<void> initialize() async {
    if (_isInitialized) {
      return;
    }
    try {
      _favoriteStores = await FavoritesStorage().readFavorites();
      _isInitialized = true;
    } catch (error) {
      log('Failed to load favorites from secure storage', error: error);
    } finally {
      notifyListeners();
    }
  }

  bool get isInitialized {
    return _isInitialized;
  }

  List<FavoriteStore> get favoriteStores {
    return _favoriteStores;
  }

  List<int> getFavoriteIds() {
    return _favoriteStores.map((item) => item.storeId).toList();
  }

  FavoriteStore getFavoriteStore(int storeId) {
    return _favoriteStores.where((item) => item.storeId == storeId).first;
  }

  bool isFavorite(int storeId) {
    return getFavoriteIds().contains(storeId);
  }

  Future<void> saveFavorite(FavoriteStore newFavoriteStore) async {
    if (isFavorite(newFavoriteStore.storeId)) {
      return;
    }
    final favoriteStores = [..._favoriteStores, newFavoriteStore];
    await FavoritesStorage().writeFavorites(favoriteStores);
    _favoriteStores = favoriteStores;
    notifyListeners();
  }

  Future<void> removeFavorite(int storeId) async {
    if (!isFavorite(storeId)) {
      return;
    }
    final favoriteStores = [..._favoriteStores]..removeWhere((item) => item.storeId == storeId);
    await FavoritesStorage().writeFavorites(favoriteStores);
    _favoriteStores = favoriteStores;
    notifyListeners();
  }
}
