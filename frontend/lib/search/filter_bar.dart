import 'package:collection/collection.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/category_assets.dart';
import 'package:ehrenamtskarte/search/filter_bar_button.dart';
import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class FilterBar extends StatelessWidget {
  final void Function(CategoryAsset, bool) onCategoryPress;

  const FilterBar({super.key, required this.onCategoryPress});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final theme = Theme.of(context);
    final sortedCategories = [...categoryAssets(context).where((category) => category.id != 9)];
    sortedCategories.sort((a, b) => a.shortName.length.compareTo(b.shortName.length));
    sortedCategories.add(categoryAssets(context).where((category) => category.id == 9).single);

    final filteredCategories = sortedCategories.where((element) => buildConfig.categories.contains(element.id));

    return SliverToBoxAdapter(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              children: [
                Text(
                  t.search.filterByCategories.toUpperCase(),
                  maxLines: 1,
                  style: theme.textTheme.bodyMedium?.apply(color: theme.hintColor),
                ),
                const Expanded(
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
    );
  }
}
