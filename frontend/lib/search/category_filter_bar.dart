import 'package:collection/collection.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/category_assets.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/search/filter_bar_button.dart';
import 'package:flutter/material.dart';

class CategoryFilterBar extends FlexibleSpaceBar {
  final Function(CategoryAsset, bool) onCategoryPress;

  CategoryFilterBar({super.key, required this.onCategoryPress})
    : super(
        collapseMode: CollapseMode.none,
        background: Builder(
          builder: (BuildContext context) {
            final t = context.t;
            final theme = Theme.of(context);
            final sortedCategories = [...categoryAssets(context).where((category) => category.id != 9)]
              ..sort((a, b) => a.shortName.length.compareTo(b.shortName.length))
              ..add(categoryAssets(context).where((category) => category.id == 9).single);
            final filteredCategories = sortedCategories.where((element) => buildConfig.categories.contains(element.id));

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
                            alignment: WrapAlignment.spaceEvenly,
                            runSpacing: 8,
                            spacing: 4,
                            children: filteredCategories
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
