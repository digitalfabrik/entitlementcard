import 'package:flutter/material.dart';

import '../category_assets.dart';
import 'filter_bar_button.dart';

class FilterBar extends StatelessWidget {
  final Function(CategoryAsset, bool) onCategoryPress;
  FilterBar({Key key, this.onCategoryPress}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var sortedCategories = [...categoryAssets];
    sortedCategories.sort((a, b) => a.id.compareTo(b.id));
    return SliverToBoxAdapter(
        child: Column(children: [
      Padding(
          padding: EdgeInsets.all(8),
          child: Row(children: [
            Text("Nach Kategorien filtern".toUpperCase(),
                maxLines: 1, style: TextStyle(color: Colors.grey)),
            Expanded(
                child: Padding(
                    padding: EdgeInsets.only(left: 8),
                    child: Divider(thickness: 0.7)))
          ])),
      Row(children: [
        Expanded(
            child: Wrap(
                alignment: WrapAlignment.spaceEvenly,
                runSpacing: 8,
                spacing: 4,
                children: sortedCategories
                    .map((e) => FilterBarButton(
                        key: ValueKey(e.id),
                        asset: e,
                        onCategoryPress: onCategoryPress))
                    .toList()))
      ])
    ]));
  }
}
