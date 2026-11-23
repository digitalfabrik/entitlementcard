import 'dart:developer';

import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/category_assets.dart';
import 'package:ehrenamtskarte/favorites/favorites_model.dart';
import 'package:ehrenamtskarte/favorites/favorite_store.dart';
import 'package:ehrenamtskarte/util/color_utils.dart';
import 'package:ehrenamtskarte/util/messenger_utils.dart';
import 'package:ehrenamtskarte/widgets/app_bars.dart';
import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:provider/provider.dart';

class DetailAppBar extends StatelessWidget {
  final int storeId;
  final String storeName;
  final int categoryId;
  final bool showFavoriteButton;

  const DetailAppBar({
    super.key,
    required this.storeId,
    required this.storeName,
    required this.categoryId,
    required this.showFavoriteButton,
  });

  @override
  Widget build(BuildContext context) {
    final favoritesProvider = Provider.of<FavoritesModel>(context);

    final category = categoryAssets(context)[categoryId];
    final isFavorite = favoritesProvider.isFavorite(storeId);

    final theme = Theme.of(context);
    final foregroundColor = theme.appBarTheme.foregroundColor;
    final backgroundColor = theme.colorScheme.primary;
    final textColor = getReadableOnColor(backgroundColor);
    final textColorGrey = getReadableOnColorSecondary(backgroundColor);

    return SizedBox(
      height: MediaQuery.paddingOf(context).top + appBarToolbarHeight,
      child: AppBar(
        toolbarHeight: appBarToolbarHeight,
        leading: BackButton(color: foregroundColor),
        // On iOS the title would be centered by default
        centerTitle: false,
        titleSpacing: 0,
        title: Padding(
          padding: const EdgeInsetsDirectional.only(end: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                storeName,
                style: theme.textTheme.titleLarge?.apply(color: textColor),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              Text(
                category.shortName.toUpperCase(),
                style: theme.textTheme.bodySmall?.apply(color: textColorGrey),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
        actions: [
          if (buildConfig.featureFlags.favorites && showFavoriteButton)
            IconButton(
              color: foregroundColor,
              icon: isFavorite ? Icon(Icons.favorite) : Icon(Icons.favorite_border_outlined),
              iconSize: 36,
              onPressed: () async {
                await _toggleFavorites(context, favoritesProvider);
              },
            ),
        ],
      ),
    );
  }

  Future<void> _toggleFavorites(BuildContext context, FavoritesModel model) async {
    final errorColor = Theme.of(context).colorScheme.error;

    try {
      if (model.isFavorite(storeId)) {
        await model.removeFavorite(storeId);
        if (!context.mounted) return;
        showSnackBar(context, t.favorites.favoriteHasBeenRemoved);
      } else {
        await model.saveFavorite(FavoriteStore(storeId, storeName, categoryId));
        if (!context.mounted) return;
        showSnackBar(context, t.favorites.favoriteHasBeenAdded);
      }
    } catch (error) {
      log('Failed to update favorites', error: error);
      if (!context.mounted) return;
      showSnackBar(context, t.favorites.updateFailed, errorColor);
    }
  }
}
