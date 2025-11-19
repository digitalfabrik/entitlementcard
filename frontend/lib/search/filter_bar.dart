import 'package:collection/collection.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/category_assets.dart';
import 'package:ehrenamtskarte/search/filter_bar_button.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class SliverFilterBarDelegate extends SliverPersistentHeaderDelegate {
  final double expandedHeight;
  SliverFilterBarDelegate(this.expandedHeight);

  @override
  double get minExtent => kToolbarHeight;

  @override
  double get maxExtent => expandedHeight;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlaps) {
    final percent = shrinkOffset / (maxExtent - minExtent);
    final currentSize = maxExtent - shrinkOffset;
    return Container(
      height: currentSize,
      color: Colors.blue,
      alignment: Alignment.lerp(Alignment.bottomCenter, Alignment.center, percent),
      child: Opacity(
        opacity: clampDouble(1 - percent, 0.0, 1.0),
        child: Text('Sticky Header', style: TextStyle(color: Colors.white, fontSize: 24)),
      ),
    );
  }

  @override
  bool shouldRebuild(covariant SliverPersistentHeaderDelegate old) => true;
}

class SliverFilterBar extends StatelessWidget {
  final Function(CategoryAsset, bool) onCategoryPress;

  const SliverFilterBar({super.key, required this.onCategoryPress});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final theme = Theme.of(context);
    final sortedCategories = [...categoryAssets(context).where((category) => category.id != 9)]
      ..sort((a, b) => a.shortName.length.compareTo(b.shortName.length))
      ..add(categoryAssets(context).where((category) => category.id == 9).single);

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
