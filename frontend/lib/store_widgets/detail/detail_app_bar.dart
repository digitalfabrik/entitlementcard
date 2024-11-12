import 'dart:developer';

import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/category_assets.dart';
import 'package:ehrenamtskarte/favorites/favorites_model.dart';
import 'package:ehrenamtskarte/favorites/favorite_store.dart';
import 'package:ehrenamtskarte/util/color_utils.dart';
import 'package:ehrenamtskarte/util/messenger_utils.dart';
import 'package:ehrenamtskarte/widgets/app_bars.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:provider/provider.dart';

const double bottomSize = 100;

class DetailAppBarHeaderImage extends StatelessWidget {
  final int? categoryId;

  const DetailAppBarHeaderImage({super.key, this.categoryId});

  @override
  Widget build(BuildContext context) {
    final currentCategoryId = categoryId;
    final categories = categoryAssets(context);

    if (currentCategoryId != null && currentCategoryId <= categories.length) {
      final currentDetailIcon = categories[currentCategoryId].detailIcon;
      if (currentDetailIcon != null) {
        return SvgPicture.asset(
          currentDetailIcon,
          width: double.infinity,
          semanticsLabel: 'Header',
          alignment: Alignment.bottomRight,
        );
      }
    }
    return Container();
  }
}

class DetailAppBarBottom extends StatelessWidget {
  final Color textColorGrey;
  final Color textColor;
  final String? title;
  final int? categoryId;
  final String? categoryName;
  final Color? accentColor;

  const DetailAppBarBottom({
    super.key,
    this.title,
    this.categoryId,
    this.categoryName,
    this.accentColor,
    required this.textColorGrey,
    required this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      alignment: Alignment.bottomLeft,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            categoryName ?? '',
            style: textTheme.bodyLarge?.apply(color: textColorGrey),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          Text(
            title ?? '',
            style: textTheme.titleLarge?.apply(color: textColor),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          )
        ],
      ),
    );
  }
}

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

    final accentColor = getDarkenedColorForCategory(context, categoryId);
    final theme = Theme.of(context);
    final foregroundColor = theme.appBarTheme.foregroundColor;
    final backgroundColor = accentColor ?? theme.colorScheme.primary;
    final textColor = getReadableOnColor(backgroundColor);
    final textColorGrey = getReadableOnColorSecondary(backgroundColor);

    return AppBarWithBottom(
      flexibleSpace: DetailAppBarHeaderImage(categoryId: categoryId),
      color: accentColor,
      actions: [
        if (buildConfig.featureFlags.favorites && showFavoriteButton)
          IconButton(
              color: foregroundColor,
              icon: isFavorite ? Icon(Icons.favorite) : Icon(Icons.favorite_border_outlined),
              iconSize: 36,
              onPressed: () async {
                await _toggleFavorites(context, favoritesProvider);
              }),
      ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(bottomSize),
        // The SizedBox makes sure that the text does not move above the
        // AppBar, but is truncated at the bottom of the "bottom" component.
        child: SizedBox(
          height: bottomSize,
          child: DetailAppBarBottom(
            title: storeName,
            categoryId: categoryId,
            categoryName: category.name,
            accentColor: accentColor,
            textColorGrey: textColorGrey,
            textColor: textColor,
          ),
        ),
      ),
    );
  }

  Future<void> _toggleFavorites(BuildContext context, FavoritesModel model) async {
    final categoryColor = getDarkenedColorForCategory(context, categoryId);
    final errorColor = Theme.of(context).colorScheme.error;

    try {
      if (model.isFavorite(storeId)) {
        await model.removeFavorite(storeId);
        if (!context.mounted) return;
        showSnackBar(context, t.favorites.favoriteHasBeenRemoved, categoryColor);
      } else {
        await model.saveFavorite(FavoriteStore(storeId, storeName, categoryId));
        if (!context.mounted) return;
        showSnackBar(context, t.favorites.favoriteHasBeenAdded, categoryColor);
      }
    } catch (error) {
      log('Failed to update favorites', error: error);
      if (!context.mounted) return;
      showSnackBar(context, t.favorites.updateFailed, errorColor);
    }
  }
}
