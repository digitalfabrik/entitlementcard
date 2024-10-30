import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:ehrenamtskarte/store_widgets/accepting_store_summary.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

import 'package:ehrenamtskarte/home/home_page.dart';

class ResultsLoader extends StatefulWidget {
  final CoordinatesInput? coordinates;
  final String? searchText;
  final List<int> categoryIds;

  const ResultsLoader({super.key, this.coordinates, this.searchText, required this.categoryIds});

  @override
  State<StatefulWidget> createState() => ResultsLoaderState();
}

class ResultsLoaderState extends State<ResultsLoader> {
  static const _pageSize = 20;
  GraphQLClient? _client;

  final PagingController<int, AcceptingStoresSearch$Query$AcceptingStore> _pagingController =
      PagingController(firstPageKey: 0);

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
  }

  @override
  void didUpdateWidget(ResultsLoader oldWidget) {
    super.didUpdateWidget(oldWidget);
    _pagingController.refresh();
  }

  Future<void> _fetchPage(int pageKey) async {
    final oldWidget = widget;
    final projectId = Configuration.of(context).projectId;
    try {
      final arguments = AcceptingStoresSearchArguments(
        project: projectId,
        params: SearchParamsInput(
          categoryIds: widget.categoryIds.isEmpty ? null : widget.categoryIds,
          coordinates: widget.coordinates,
          searchText: widget.searchText,
          limit: _pageSize,
          offset: pageKey,
        ),
      );
      final query = AcceptingStoresSearchQuery(variables: arguments);

      final client = _client;
      if (client == null) {
        throw Exception('GraqhQL client is not yet initialized!');
      }

      final result = await client.query(QueryOptions(document: query.document, variables: query.getVariablesMap()));
      final exception = result.exception;
      if (result.hasException && exception != null) {
        throw exception;
      }

      if (widget != oldWidget) {
        // Params are outdated.
        // If we're still at the first key, we must manually retrigger fetching.
        if (pageKey == _pagingController.firstPageKey) {
          return await _fetchPage(pageKey);
        }
      }
      final newData = result.data;

      if (newData == null) {
        throw Exception('Fetched data is null.');
      }

      final newItems = query.parse(newData).searchAcceptingStoresInProject;

      if (mounted) {
        final isLastPage = newItems.length < _pageSize;
        if (isLastPage) {
          _pagingController.appendLastPage(newItems);
        } else {
          final nextPageKey = pageKey + newItems.length;
          _pagingController.appendPage(newItems, nextPageKey);
        }
      }
    } on Exception catch (error) {
      if (widget != oldWidget) {
        // Params are outdated.
        // If we're still at the first key, we must manually retrigger fetching.
        if (pageKey == _pagingController.firstPageKey) {
          return await _fetchPage(pageKey);
        }
      }
      if (mounted) {
        _pagingController.error = error;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return PagedSliverList<int, AcceptingStoresSearch$Query$AcceptingStore>.separated(
      pagingController: _pagingController,
      builderDelegate: PagedChildBuilderDelegate<AcceptingStoresSearch$Query$AcceptingStore>(
        itemBuilder: (context, item, index) {
          final storeCoordinates = item.physicalStore?.coordinates;
          return IntrinsicHeight(
            child: AcceptingStoreSummary(
              key: ValueKey(item.id),
              store: AcceptingStoreSummaryModel(
                item.id,
                item.name,
                item.description,
                item.categoryId,
                storeCoordinates != null ? Coordinates(storeCoordinates.lat, storeCoordinates.lng) : null,
                item.physicalStore?.address.location,
              ),
              coordinates: widget.coordinates,
              showOnMap: (it) => HomePageData.of(context)?.navigateToMapTab(it),
            ),
          );
        },
        noItemsFoundIndicatorBuilder: _buildNoItemsFoundIndicator,
        firstPageErrorIndicatorBuilder: _buildErrorWithRetry,
        newPageErrorIndicatorBuilder: _buildErrorWithRetry,
        newPageProgressIndicatorBuilder: _buildProgressIndicator,
        firstPageProgressIndicatorBuilder: _buildProgressIndicator,
      ),
      separatorBuilder: (context, index) => const Divider(height: 0),
    );
  }

  Widget _buildProgressIndicator(BuildContext context) =>
      const Center(child: Padding(padding: EdgeInsets.all(5), child: CircularProgressIndicator()));

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
          )
        ],
      ),
    );
  }

  Widget _buildNoItemsFoundIndicator(BuildContext context) {
    final t = context.t;
    final theme = Theme.of(context);
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.search_off, size: 60, color: theme.disabledColor),
          Text(t.search.noAcceptingStoresFound, style: theme.textTheme.bodyMedium),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _pagingController.dispose();
    super.dispose();
  }
}
