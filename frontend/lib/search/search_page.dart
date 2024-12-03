import 'package:ehrenamtskarte/category_assets.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:ehrenamtskarte/search/filter_bar.dart';
import 'package:ehrenamtskarte/search/sorting_button.dart';
import 'package:ehrenamtskarte/search/results_loader.dart';
import 'package:ehrenamtskarte/widgets/app_bars.dart';
import 'package:flutter/material.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';

enum SortingMode { alphabetically, byDistance }

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<StatefulWidget> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  String? searchFieldText;
  final List<CategoryAsset> _selectedCategories = [];
  CoordinatesInput? _coordinates;
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
    final t = context.t;
    final theme = Theme.of(context);
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
                      '${t.search.searchResults.toUpperCase()} ${_sortingMode == SortingMode.byDistance ? t.search.nearby : t.search.alphabetically}',
                      style: theme.textTheme.bodyMedium?.apply(color: theme.hintColor),
                    ),
                    const Expanded(child: Padding(padding: EdgeInsets.only(left: 8), child: Divider()))
                  ],
                ),
              ),
            ),
            ResultsLoader(
              searchText: searchFieldText,
              categoryIds: _selectedCategories.map((e) => e.id).toList(),
              coordinates: _sortingMode == SortingMode.byDistance ? _coordinates : null,
            )
          ],
        ),
        SortingButton(
          setCoordinates: (position) => setState(() {
            _coordinates = CoordinatesInput(lat: position.latitude, lng: position.longitude);
            _sortingMode = SortingMode.byDistance;
          }),
          setSortingMode: (sortingMode) {
            if (sortingMode == SortingMode.alphabetically || _coordinates != null) {
              setState(() => _sortingMode = sortingMode);
            }
          },
          sortingMode: _sortingMode,
        ),
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
