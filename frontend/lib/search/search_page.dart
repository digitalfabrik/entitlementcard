import 'package:ehrenamtskarte/category_assets.dart';
import 'package:ehrenamtskarte/graphql_gen/schema.graphql.dart';
import 'package:ehrenamtskarte/search/results_loader.dart';
import 'package:ehrenamtskarte/search/search_results_toolbar.dart';
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
  final TextEditingController _searchController = TextEditingController();
  String? searchFieldText;
  final Set<int> _selectedCategoryIds = {};
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
          textEditingController: _searchController,
          selectedCategoryIds: _selectedCategoryIds,
          footer: SearchResultsToolbar(
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
          categoryIds: _selectedCategoryIds.toList(),
          coordinates: _sortingMode == SortingMode.byDistance ? _coordinates : null,
          hasActiveFilters: _hasActiveFilters,
          onResetFilters: _resetFilters,
        ),
      ],
    );
  }

  bool get _hasActiveFilters => (searchFieldText?.isNotEmpty ?? false) || _selectedCategoryIds.isNotEmpty;

  void _onCategoryPress(CategoryAsset asset, bool isSelected) {
    setState(() {
      if (isSelected) {
        _selectedCategoryIds.add(asset.id);
      } else {
        _selectedCategoryIds.remove(asset.id);
      }
    });
  }

  void _resetFilters() {
    _searchController.clear();
    setState(() {
      searchFieldText = null;
      _selectedCategoryIds.clear();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}
