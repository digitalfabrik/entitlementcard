import 'package:ehrenamtskarte/category_assets.dart';
import 'package:ehrenamtskarte/graphql_gen/schema.graphql.dart';
import 'package:ehrenamtskarte/search/results_loader.dart';
import 'package:ehrenamtskarte/search/scroll_to_top_button.dart';
import 'package:ehrenamtskarte/search/search_results_toolbar.dart';
import 'package:ehrenamtskarte/search/sorting_button.dart';
import 'package:ehrenamtskarte/widgets/app_bars.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

enum SortingMode { alphabetically, byDistance }

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<StatefulWidget> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _showScrollToTopButton = false;
  String? searchFieldText;
  final Set<int> _selectedCategoryIds = {};
  Input$CoordinatesInput? _coordinates;
  SortingMode _sortingMode = SortingMode.alphabetically;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      setState(() => _sortingMode = _coordinates == null ? SortingMode.alphabetically : SortingMode.byDistance);
    });
  }

  @override
  Widget build(BuildContext context) {
    // The scroll to top button is drawn above the results, but must be reached first by keyboard and screen reader
    // navigation. Otherwise, users would have to navigate through all search results to reach it.
    return FocusTraversalGroup(
      policy: OrderedTraversalPolicy(),
      child: Stack(
        children: [
          FocusTraversalOrder(
            order: const NumericFocusOrder(1),
            child: Semantics(container: true, sortKey: OrdinalSortKey(1), child: _buildResults()),
          ),
          PositionedDirectional(
            end: kFloatingActionButtonMargin,
            bottom: kFloatingActionButtonMargin,
            child: SafeArea(
              top: false,
              bottom: false,
              child: FocusTraversalOrder(
                order: const NumericFocusOrder(0),
                child: Semantics(
                  container: true,
                  sortKey: OrdinalSortKey(0),
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 200),
                    child: _showScrollToTopButton
                        ? ScrollToTopButton(onPressed: _scrollToTop)
                        : const SizedBox.shrink(),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResults() {
    return CustomScrollView(
      controller: _scrollController,
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

  void _onScroll() {
    final position = _scrollController.position;
    // Show the button as soon as the user scrolled down by more than two screen heights.
    final showScrollToTopButton = position.pixels > 2 * position.viewportDimension;
    if (showScrollToTopButton != _showScrollToTopButton) {
      setState(() => _showScrollToTopButton = showScrollToTopButton);
    }
  }

  void _scrollToTop() {
    _scrollController.animateTo(0, duration: const Duration(milliseconds: 300), curve: Curves.easeOut);
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
    _scrollController.dispose();
    super.dispose();
  }
}
