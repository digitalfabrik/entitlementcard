import 'package:collection/collection.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/category_assets.dart';
import 'package:ehrenamtskarte/search/filter_bar_button.dart';
import 'package:flutter/material.dart';

import '../util/l10n.dart';

class FilterBar extends StatelessWidget {
  final Function(CategoryAsset, bool) onCategoryPress;

  const FilterBar({super.key, required this.onCategoryPress});

  @override
  Widget build(BuildContext context) {
    final sortedCategories = [...categoryAssets(context)];
    sortedCategories.removeWhere((category) => category.id == 9);
    sortedCategories.sort((a, b) => a.shortName.length.compareTo(b.shortName.length));
    final filteredCategories = sortedCategories.where((element) => buildConfig.categories.contains(element.id));

    return SliverToBoxAdapter(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              children: [
                Text(context.l10n.search_filterByCategories.toUpperCase(), maxLines: 1, style: const TextStyle(color: Colors.grey)),
                const Expanded(child: Padding(padding: EdgeInsets.only(left: 8), child: Divider(thickness: 0.7)))
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
              )
            ],
          )
        ],
      ),
    );
  }
}
