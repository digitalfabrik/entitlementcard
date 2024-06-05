import 'dart:developer';

import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/favorites/favorites_model.dart';
import 'package:ehrenamtskarte/routing.dart';
import 'package:ehrenamtskarte/store_widgets/category_indicator.dart';
import 'package:ehrenamtskarte/store_widgets/detail/detail_app_bar.dart';
import 'package:ehrenamtskarte/util/messenger_utils.dart';
import 'package:provider/provider.dart';

class RemovedStoreSummary extends StatelessWidget {
  final int storeId;
  final String storeName;
  final int categoryId;

  const RemovedStoreSummary({
    super.key,
    required this.storeId,
    required this.storeName,
    required this.categoryId,
  });

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    return SafeArea(
      bottom: false,
      top: false,
      child: InkWell(
        onTap: () {
          _openDetailView(context);
        },
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Row(
            children: [
              CategoryIndicator(categoryId: categoryId),
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      storeName,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      t.store.acceptingStoreNotAvailable,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.redAccent),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                child: SizedBox(
                  height: double.infinity,
                  child: Icon(Icons.keyboard_arrow_right, size: 30.0, color: Theme.of(context).disabledColor),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _openDetailView(BuildContext context) {
    Navigator.of(context, rootNavigator: true).push(
      AppRoute(
        builder: (context) => Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            DetailAppBar(
              storeId: storeId,
              storeName: storeName,
              categoryId: categoryId,
              showFavoriteButton: false,
            ),
            RemovedStoreContent(
              storeId: storeId,
            ),
          ],
        ),
      ),
    );
  }
}

class RemovedStoreContent extends StatelessWidget {
  final int storeId;

  const RemovedStoreContent({super.key, required this.storeId});

  @override
  Widget build(BuildContext context) {
    final favoritesProvider = Provider.of<FavoritesModel>(context);
    return Expanded(
        child: Scaffold(
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                t.store.acceptingStoreNotAvailable,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              Text(
                t.store.removeDescription,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              Divider(thickness: 0.7, height: 48, color: Theme.of(context).primaryColorLight),
              ButtonBar(
                alignment: MainAxisAlignment.center,
                children: [
                  OutlinedButton(
                      child: Text(t.store.removeButtonText),
                      onPressed: () async {
                        await _removeFavorite(context, favoritesProvider);
                      }),
                ],
              ),
            ],
          ),
        ),
      ),
    ));
  }

  Future<void> _removeFavorite(BuildContext context, FavoritesModel model) async {
    try {
      await model.removeFavorite(storeId);
      showSnackBar(context, t.favorites.favoriteHasBeenRemoved);
      Navigator.of(context).maybePop();
    } catch (error) {
      log('Failed to update favorites', error: error);
      showSnackBar(context, t.favorites.updateFailed, Theme.of(context).colorScheme.error);
    }
  }
}
