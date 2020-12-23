import 'package:ehrenamtskarte/search/filter_bar_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

import '../category_assets.dart';

class FilterBar extends StatefulWidget {
  final Function(List<int>) onSelectedCategoriesChange;

  FilterBar({Key key, this.onSelectedCategoriesChange}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _FilterBarState(onSelectedCategoriesChange: this.onSelectedCategoriesChange);
  }
}

class _FilterBarState extends State<FilterBar> {
  final Function(List<int>) onSelectedCategoriesChange;

  _FilterBarState({this.onSelectedCategoriesChange});

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
                onPress: (index, select) {
                  setState(() {
                    if (select) {
                      this.selectedCategories.add(index);
                    } else {
                      this.selectedCategories.remove(index);
                    }
                  });
                  this.onSelectedCategoriesChange(this.selectedCategories);
                });
          },
        ),
      ),
    );
  }
}
