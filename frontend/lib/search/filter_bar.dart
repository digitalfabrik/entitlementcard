import 'package:ehrenamtskarte/search/filter_bar_button.dart';
import 'package:flutter/material.dart';
import '../category_assets.dart';

class FilterBar extends StatelessWidget {
  final Function(int, bool) onCategoryPress;

  FilterBar({Key key, this.onCategoryPress}) : super(key: key);

  List<int> selectedCategories = new List();

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
                index: index,
                onCategoryPress: this.onCategoryPress);
          },
        ),
      ),
    );
  }
}
