import 'package:ehrenamtskarte/category_assets.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:ehrenamtskarte/search/filter_bar.dart';
import 'package:ehrenamtskarte/search/location_button.dart';
import 'package:ehrenamtskarte/search/results_loader.dart';
import 'package:ehrenamtskarte/widgets/app_bars.dart';
import 'package:flutter/material.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

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
            SearchSliverAppBar(
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
                      'Suchresultate'.toUpperCase(),
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
