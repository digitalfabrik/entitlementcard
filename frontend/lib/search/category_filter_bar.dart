import 'package:collection/collection.dart';
import 'package:ehrenamtskarte/category_assets.dart' show CategoryAsset;
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/search/filter_bar_button.dart';
import 'package:flutter/material.dart';

/// Approximate the height of the CategoryFilterBar
double categoryFilterBarExpectedHeight(BuildContext context, int categoriesCount) {
  final double screenWidth = MediaQuery.of(context).size.width;
  final double buttonWidth = 80;
  final double buttonHeight = 74;
  final double horizontalSpacing = 4;
  final double verticalSpacing = 8;

  // Technically, this isn't 100% correct, since the last button has no spacing, but it is close enough
  int buttonsPerRow = (screenWidth / (buttonWidth + horizontalSpacing)).floor();
  int rowsCount = (categoriesCount / buttonsPerRow).ceil();

  return (kToolbarHeight +
      MediaQuery.of(context).padding.top +
      (rowsCount * buttonHeight) +
      (rowsCount - 1) * verticalSpacing);
}

class CategoryFilterBar extends FlexibleSpaceBar {
  final Function(CategoryAsset, bool) onCategoryPress;
  final List<CategoryAsset> categoryAssets;

  CategoryFilterBar({super.key, required this.categoryAssets, required this.onCategoryPress})
    : super(
        collapseMode: CollapseMode.none,
        background: Builder(
          builder: (BuildContext context) {
            final t = context.t;
            final theme = Theme.of(context);

            return Container(
              padding: EdgeInsets.fromLTRB(0, kToolbarHeight + MediaQuery.of(context).padding.top, 0, 0),
              child: Container(
                color: theme.colorScheme.surface,
                child: Column(
                  children: [
                    Padding(
                      padding: EdgeInsets.all(8),
                      child: Row(
                        children: [
                          Text(
                            t.search.filterByCategories.toUpperCase(),
                            maxLines: 1,
                            style: theme.textTheme.bodyMedium?.apply(color: theme.hintColor),
                          ),
                          Expanded(
                            child: Padding(padding: EdgeInsets.only(left: 8), child: Divider(thickness: 0.7)),
                          ),
                        ],
                      ),
                    ),
                    Row(
                      children: [
                        Expanded(
                          child: Wrap(
                            alignment: WrapAlignment.center,
                            runSpacing: 8,
                            spacing: 4,
                            children: categoryAssets
                                .mapIndexed(
                                  (index, category) => FilterBarButton(
                                    key: ValueKey(category.id),
                                    index: index,
                                    asset: category,
                                    onCategoryPress: onCategoryPress,
                                  ),
                                )
                                .toList(),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      );
}
