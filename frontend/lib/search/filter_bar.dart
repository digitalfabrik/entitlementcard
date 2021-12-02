import 'package:flutter/material.dart';
import 'package:collection/collection.dart';

import '../category_assets.dart';
import 'filter_bar_button.dart';

class FilterBar extends StatelessWidget {
  final Function(CategoryAsset, bool) onCategoryPress;
  const FilterBar({Key? key, required this.onCategoryPress}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var sortedCategories = [...categoryAssets];
    sortedCategories.removeLast();
    sortedCategories.sort((a, b) => a.shortName.length.compareTo(b.shortName.length));
    return SliverToBoxAdapter(
        child: Column(children: [
      Padding(
          padding: const EdgeInsets.all(8),
          child: Row(children: [
            Text("Nach Kategorien filtern".toUpperCase(), maxLines: 1, style: const TextStyle(color: Colors.grey)),
            const Expanded(child: Padding(padding: EdgeInsets.only(left: 8), child: Divider(thickness: 0.7)))
          ])),
      Row(children: [
        Expanded(
            child: Wrap(
                alignment: WrapAlignment.spaceEvenly,
                runSpacing: 8,
                spacing: 4,
                children: sortedCategories
                    .mapIndexed((index, category) => FilterBarButton(
                        key: ValueKey(category.id), index: index, asset: category, onCategoryPress: onCategoryPress))
                    .toList()))
      ])
    ]));
  }
}
