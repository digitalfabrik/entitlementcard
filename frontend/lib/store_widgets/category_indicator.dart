import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/category_assets.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class CategoryIndicator extends StatelessWidget {
  final int categoryId;

  const CategoryIndicator({super.key, required this.categoryId});

  @override
  Widget build(BuildContext context) {
    final categories = categoryAssets(context);
    final itemCategoryAsset = categoryId < categories.length ? categories[categoryId] : null;
    final categoryName = itemCategoryAsset?.name ?? context.t.store.unknownCategory;
    final categoryColor = itemCategoryAsset?.color;

    final useWideDepiction = MediaQuery.of(context).size.width > 400;

    if (useWideDepiction) {
      return CategoryIconIndicator(
        icon: itemCategoryAsset?.icon,
        color: categoryColor,
        categoryName: categoryName,
      );
    } else {
      return CategoryColorIndicator(categoryColor: categoryColor);
    }
  }
}

class CategoryIconIndicator extends StatelessWidget {
  final IconData? icon;
  final Color? color;
  final String categoryName;
  final EdgeInsets padding;

  const CategoryIconIndicator({
    super.key,
    required this.icon,
    this.color,
    required this.categoryName,
    this.padding = const EdgeInsets.symmetric(horizontal: 16),
  });

  @override
  Widget build(BuildContext context) {
    final currentIcon = icon;
    return Padding(
      padding: padding,
      child: ClipOval(
        child: Container(
          width: 36,
          height: 36,
          color: color ?? Theme.of(context).colorScheme.primary,
          alignment: Alignment.center,
          child: currentIcon != null
              ? Icon(currentIcon, size: 24, semanticLabel: categoryName, color: Colors.white)
              : const Icon(Icons.info, size: 24, color: Colors.white),
        ),
      ),
    );
  }
}

class CategoryColorIndicator extends StatelessWidget {
  final Color? categoryColor;

  const CategoryColorIndicator({super.key, this.categoryColor});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: VerticalDivider(color: categoryColor ?? Theme.of(context).colorScheme.primary, thickness: 3),
    );
  }
}
