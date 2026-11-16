import 'package:ehrenamtskarte/category_assets.dart';
import 'package:ehrenamtskarte/graphql_gen/schema.graphql.dart';
import 'package:ehrenamtskarte/search/results_loader.dart';
import 'package:ehrenamtskarte/search/sorting_button.dart';
import 'package:ehrenamtskarte/widgets/app_bars.dart';
import 'package:flutter/material.dart';

enum SortingMode { alphabetically, byDistance }

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<StatefulWidget> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  String? searchFieldText;
  final List<CategoryAsset> _selectedCategories = [];
  Input$CoordinatesInput? _coordinates;
  SortingMode _sortingMode = SortingMode.alphabetically;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      setState(() => _sortingMode = _coordinates == null ? SortingMode.alphabetically : SortingMode.byDistance);
    });
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverSearchAppBar(
          onChanged: (text) => setState(() {
            searchFieldText = text;
          }),
          onCategoryPress: _onCategoryPress,
          bottom: SortingBar(
            child: SortingButton(
              setCoordinates: (position) => setState(() {
                _coordinates = Input$CoordinatesInput(lat: position.latitude, lng: position.longitude);
                _sortingMode = SortingMode.byDistance;
              }),
              setSortingMode: (sortingMode) {
                if (sortingMode == SortingMode.alphabetically || _coordinates != null) {
                  setState(() => _sortingMode = sortingMode);
                }
              },
              sortingMode: _sortingMode,
            ),
          ),
        ),
        SliverResultsLoader(
          searchText: searchFieldText,
          categoryIds: _selectedCategories.map((e) => e.id).toList(),
          coordinates: _sortingMode == SortingMode.byDistance ? _coordinates : null,
        ),
      ],
    );
  }

  void _onCategoryPress(CategoryAsset asset, bool isSelected) {
    setState(() {
      if (isSelected) {
        _selectedCategories.add(asset);
      } else {
        _selectedCategories.remove(asset);
      }
    });
  }
}
