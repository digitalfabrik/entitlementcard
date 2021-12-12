import 'package:ehrenamtskarte/widgets/navigation_bars.dart';
import 'package:flutter/material.dart';
import '../category_assets.dart';
import '../graphql/graphql_api.graphql.dart';
import 'filter_bar.dart';
import 'location_button.dart';
import 'results_loader.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  String? searchFieldText;
  final List<CategoryAsset> _selectedCategories = [];
  CoordinatesInput? _coordinates;

  @override
  Widget build(BuildContext context) {
    final currentCoordinatesInput = _coordinates;
    return Stack(
      children: [
        CustomScrollView(
          slivers: [
            SliverSearchNavigationBar(
              onChanged: (text) => setState(() {
                searchFieldText = text;
              }),
            ),
            FilterBar(onCategoryPress: _onCategoryPress),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(8),
                child: Row(
                  children: [
                    Text(
                      "Suchresultate".toUpperCase(),
                      style: const TextStyle(color: Colors.grey),
                    ),
                    const Expanded(child: Padding(padding: EdgeInsets.only(left: 8), child: Divider()))
                  ],
                ),
              ),
            ),
            ResultsLoader(
              searchText: searchFieldText,
              categoryIds: _selectedCategories.map((e) => e.id).toList(),
              coordinates: currentCoordinatesInput,
            )
          ],
        ),
        LocationButton(
          setCoordinates: (position) =>
              setState(() => _coordinates = CoordinatesInput(lat: position.latitude, lng: position.longitude)),
        )
      ],
    );
  }

  _onCategoryPress(CategoryAsset asset, bool isSelected) {
    setState(() {
      if (isSelected) {
        _selectedCategories.add(asset);
      } else {
        _selectedCategories.remove(asset);
      }
    });
  }
}
