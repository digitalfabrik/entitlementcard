import 'package:flutter/material.dart';

class FilterBar extends StatelessWidget {
  final Function(List<int>) onSelectedCategoriesChange;

  FilterBar({this.onSelectedCategoriesChange});

  @override
  Widget build(BuildContext context) {
    return SliverGrid.count(
        crossAxisCount: 5,
        children: Iterable.generate(5)
            .map((i) => Container(
                color: Theme.of(context).accentColor,
                child: IconButton(
                  icon: Icon(Icons.category),
                  onPressed: () => {},
                )))
            .toList());
  }
}
