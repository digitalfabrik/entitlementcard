import 'package:collection/collection.dart';
import 'package:ehrenamtskarte/category_assets.dart' show CategoryAsset;
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/search/filter_bar_button.dart';
import 'package:flutter/material.dart';

/// Approximate the height of the CategoryFilterBar
double categoryFilterBarExpectedHeight(BuildContext context, int categoriesCount) {
  // Measure the height of one text line width the subheader style
  final textPainter = TextPainter(
    text: TextSpan(text: 'TEXT', style: Theme.of(context).textTheme.bodyMedium),
    maxLines: 1,
    textDirection: TextDirection.ltr,
  );
  textPainter.layout();

  final headerHeight = textPainter.size.height + 2 * 8;
  final double screenWidth = MediaQuery.of(context).size.width;
  final double horizontalSpacing = 4;
  final double verticalSpacing = 8;

  const double estimatedButtonWidth = 110;
  const double estimatedButtonHeight = 32;

  final int buttonsPerRow = ((screenWidth + horizontalSpacing) / (estimatedButtonWidth + horizontalSpacing)).floor();
  final int rowsCount = (categoriesCount / (buttonsPerRow > 0 ? buttonsPerRow : 1)).ceil();

  return MediaQuery.of(context).viewInsets.top +
      kToolbarHeight +
      headerHeight +
      (rowsCount * estimatedButtonHeight) +
      (rowsCount - 1) * verticalSpacing;
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
