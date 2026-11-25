import 'package:collection/collection.dart';
import 'package:ehrenamtskarte/app_lifecycle_observer.dart';
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql_gen/schema.graphql.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:ehrenamtskarte/search/no_results_found.dart';
import 'package:ehrenamtskarte/search/scroll_to_top_button.dart';
import 'package:ehrenamtskarte/search/search_result_card.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';
import 'package:ehrenamtskarte/graphql_gen/graphql_queries/stores/accepting_stores_search.graphql.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';

import 'package:ehrenamtskarte/home/home_page.dart';
import 'package:provider/provider.dart';

class SliverResultsLoader extends StatefulWidget {
  final Input$CoordinatesInput? coordinates;
  final String? searchText;
  final List<int> categoryIds;
  final bool hasActiveFilters;
  final VoidCallback onResetFilters;
  final ValueChanged<int> onTotalCountChanged;

  const SliverResultsLoader({
    super.key,
    this.coordinates,
    this.searchText,
    required this.categoryIds,
    required this.hasActiveFilters,
    required this.onResetFilters,
    required this.onTotalCountChanged,
  });

  bool hasSameSearchParams(SliverResultsLoader other) =>
      searchText == other.searchText &&
      coordinates == other.coordinates &&
      const ListEquality<int>().equals(categoryIds, other.categoryIds);

  @override
  State<StatefulWidget> createState() => SliverResultsLoaderState();
}

class SliverResultsLoaderState extends State<SliverResultsLoader> {
  static const _pageSize = 20;
  GraphQLClient? _client;
  AppResumeNotifier? _resumeNotifier;

  final PagingController<int, Query$AcceptingStoresSearch$search$stores> _pagingController = PagingController(
    firstPageKey: 0,
  );

  void _onAppResumed() {
    if (!mounted) return;
    final client = GraphQLProvider.of(context).value;
    client.cache.store.reset();
    _pagingController.refresh();
  }

  @override
  void initState() {
    super.initState();
    _pagingController.addPageRequestListener(_fetchPage);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    final client = GraphQLProvider.of(context).value;
    if (client != _client) {
      _client = client;
    }

    final newNotifier = context.read<AppResumeNotifier>();
    if (_resumeNotifier != newNotifier) {
      _resumeNotifier?.removeListener(_onAppResumed);
      _resumeNotifier = newNotifier;
      _resumeNotifier?.addListener(_onAppResumed);
    }
  }

  @override
  void didUpdateWidget(SliverResultsLoader oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Only refetch if the search params changed, not on every rebuild of the parent (e.g. when the total count is set).
    if (!widget.hasSameSearchParams(oldWidget)) {
      _pagingController.refresh();
    }
  }

  Future<void> _fetchPage(int pageKey) async {
    final oldWidget = widget;
    if (!mounted) return;

    final projectId = Configuration.of(context).projectId;
    try {
      final client = _client;
      if (client == null) {
        throw Exception('GraqhQL client is not yet initialized!');
      }

      final result = await client.query$AcceptingStoresSearch(
        Options$Query$AcceptingStoresSearch(
          variables: Variables$Query$AcceptingStoresSearch(
            project: projectId,
            params: Input$SearchParamsInput(
              categoryIds: widget.categoryIds.isEmpty ? null : widget.categoryIds,
              coordinates: widget.coordinates,
              searchText: widget.searchText,
              limit: _pageSize,
              offset: pageKey,
            ),
          ),
        ),
      );

      if (!mounted) return;

      final exception = result.exception;
      if (result.hasException && exception != null) {
        throw exception;
      }

      if (!widget.hasSameSearchParams(oldWidget)) {
        // Params are outdated.
        // If we're still at the first key, we must manually retrigger fetching.
        if (pageKey == _pagingController.firstPageKey) {
          return await _fetchPage(pageKey);
        }
      }
      final newData = result.parsedData;

      if (newData == null) {
        throw Exception('Fetched data is null.');
      }
      final newItems = newData.search.stores;

      final totalCount = newData.search.totalCount;
      if (totalCount != null && widget.hasSameSearchParams(oldWidget)) {
        widget.onTotalCountChanged(totalCount);
      }

      final isLastPage = newItems.length < _pageSize;
      if (isLastPage) {
        _pagingController.appendLastPage(newItems);
      } else {
        final nextPageKey = pageKey + newItems.length;
        _pagingController.appendPage(newItems, nextPageKey);
      }
    } on Exception catch (error) {
      if (!mounted) return;
      if (!widget.hasSameSearchParams(oldWidget)) {
        // Params are outdated.
        // If we're still at the first key, we must manually retrigger fetching.
        if (pageKey == _pagingController.firstPageKey) {
          return await _fetchPage(pageKey);
        }
      }
      _pagingController.error = error;
    }
  }

  @override
  Widget build(BuildContext context) {
    return SliverPadding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      sliver: PagedSliverList<int, Query$AcceptingStoresSearch$search$stores>(
        pagingController: _pagingController,
        builderDelegate: PagedChildBuilderDelegate<Query$AcceptingStoresSearch$search$stores>(
          itemBuilder: (context, item, index) {
            return SearchResultCard(
              key: ValueKey(item.id),
              store: AcceptingStoreModel.fromGraphql(item),
              coordinates: widget.coordinates,
              showOnMap: (it) => HomePageData.of(context)?.navigateToMapTab(it),
              isFirst: index == 0,
              isLast: _isLastItem(index),
            );
          },
          noMoreItemsIndicatorBuilder: _buildNoMoreItemsSpacer,
          noItemsFoundIndicatorBuilder: _buildNoItemsFoundIndicator,
          firstPageErrorIndicatorBuilder: _buildErrorWithRetry,
          newPageErrorIndicatorBuilder: _buildErrorWithRetry,
          newPageProgressIndicatorBuilder: _buildProgressIndicator,
          firstPageProgressIndicatorBuilder: _buildProgressIndicator,
        ),
      ),
    );
  }

  bool _isLastItem(int index) =>
      _pagingController.nextPageKey == null && index == _pagingController.itemList!.length - 1;

  Widget _buildProgressIndicator(BuildContext context) => const Center(
    child: Padding(padding: EdgeInsets.all(5), child: CircularProgressIndicator()),
  );

  // Leaves room below the last result, so it is not covered by the scroll to top button.
  Widget _buildNoMoreItemsSpacer(BuildContext context) =>
      const SizedBox(height: kFloatingActionButtonMargin + ScrollToTopButton.height);

  Widget _buildErrorWithRetry(BuildContext context) {
    final t = context.t;
    final theme = Theme.of(context);
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.warning, size: 60, color: Colors.orange),
          Text(t.common.checkConnection, style: theme.textTheme.bodyMedium),
          OutlinedButton(
            style: theme.textButtonTheme.style,
            onPressed: _pagingController.retryLastFailedRequest,
            child: Text(t.common.tryAgain),
          ),
        ],
      ),
    );
  }

  Widget _buildNoItemsFoundIndicator(BuildContext context) =>
      NoResultsFound(hasActiveFilters: widget.hasActiveFilters, onResetFilters: widget.onResetFilters);

  @override
  void dispose() {
    _pagingController.dispose();
    _resumeNotifier?.removeListener(_onAppResumed);

    super.dispose();
  }
}
