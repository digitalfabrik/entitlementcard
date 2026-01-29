import 'package:collection/collection.dart';
import 'package:ehrenamtskarte/category_assets.dart' show CategoryAsset;
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/search/filter_bar_button.dart';
import 'package:flutter/material.dart';

const verticalSpacing = 8.0;
const horizontalSpacing = 4.0;

/// Approximate the height of the CategoryFilterBar
double categoryFilterBarExpectedHeight(BuildContext context, int categoriesCount) {
  const headerHeight = 36.0; // "filter by categories" label
  const estimatedButtonWidth = 90.0;
  const estimatedButtonHeight = 28.0;

  final screenWidth = MediaQuery.of(context).size.width;
  final buttonsPerRow = ((screenWidth + horizontalSpacing) / (estimatedButtonWidth + horizontalSpacing)).floor();
  final safeButtonsPerRow = buttonsPerRow > 0 ? buttonsPerRow : 1;
  final rowsCount = (categoriesCount / safeButtonsPerRow).ceil();

  return MediaQuery.of(context).padding.top + kToolbarHeight + headerHeight + rowsCount * estimatedButtonHeight;
}

class CategoryFilterBar extends FlexibleSpaceBar {
  final void Function(CategoryAsset, bool) onCategoryPress;
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
                            child: Padding(padding: EdgeInsets.only(left: 8), child: Divider()),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: verticalSpacing),
                    Row(
                      children: [
                        Expanded(
                          child: Wrap(
                            alignment: WrapAlignment.center,
                            runSpacing: verticalSpacing,
                            spacing: horizontalSpacing,
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
