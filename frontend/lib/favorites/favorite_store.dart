import 'package:ehrenamtskarte/map/preview/models.dart';

class FavoriteStore {
  final int storeId;
  final String storeName;
  final int categoryId;

  AcceptingStoreModel? acceptingStore;

  FavoriteStore(this.storeId, this.storeName, this.categoryId);

  FavoriteStore.fromJson(Map<String, dynamic> json)
    : storeId = json['storeId'] as int,
      storeName = json['storeName'] as String,
      categoryId = json['categoryId'] as int;

  Map<String, dynamic> toJson() => {'storeId': storeId, 'storeName': storeName, 'categoryId': categoryId};
}
