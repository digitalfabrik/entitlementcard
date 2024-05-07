import 'package:flutter/cupertino.dart';

import 'package:ehrenamtskarte/favorites/favorites_store.dart';

class FavoritesModel extends ChangeNotifier {
  List<int> _favoriteStoreIds = [];
  bool _isInitialized = false;

  Future<void> initialize() async {
    if (_isInitialized) {
      return;
    }
    _favoriteStoreIds = await FavoritesStore().getFavorites();
    _isInitialized = true;
    notifyListeners();
  }

  List<int> get favoriteStoreIds {
    return _favoriteStoreIds;
  }

  Future<bool> toggleFavorites(int storeId) async {
    final isFavorite = _favoriteStoreIds.contains(storeId);
    final favoritesStore = FavoritesStore();

    if (isFavorite) {
      await favoritesStore.removeFavorite(storeId);
      _favoriteStoreIds.remove(storeId);
    } else {
      await favoritesStore.addFavorite(storeId);
      _favoriteStoreIds.add(storeId);
    }

    notifyListeners();
    return !isFavorite;
  }
}
