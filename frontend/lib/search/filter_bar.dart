import 'package:ehrenamtskarte/search/filter_bar_button.dart';
import 'package:flutter/material.dart';
import '../category_assets.dart';

class FilterBar extends StatelessWidget {
  final Function(CategoryAsset, bool) onCategoryPress;
  FilterBar({Key key, this.onCategoryPress}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SliverToBoxAdapter(
      child: Container(
        height: 70.0,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          itemCount: categoryAssets.length,
          itemBuilder: (context, index) {
            return FilterBarButton(
                asset: categoryAssets[index],
                onCategoryPress: this.onCategoryPress);
          },
        ),
      ),
    );
  }
}
