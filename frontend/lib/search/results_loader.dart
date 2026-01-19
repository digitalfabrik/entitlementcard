import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql_gen/schema.graphql.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:ehrenamtskarte/store_widgets/accepting_store_summary.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';
import 'package:ehrenamtskarte/graphql_gen/graphql_queries/stores/accepting_stores_search.graphql.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';

import 'package:ehrenamtskarte/home/home_page.dart';

class ResultsLoader extends StatefulWidget {
  final Input$CoordinatesInput? coordinates;
  final String? searchText;
  final List<int> categoryIds;

  const ResultsLoader({super.key, this.coordinates, this.searchText, required this.categoryIds});

  @override
  State<StatefulWidget> createState() => ResultsLoaderState();
}

class ResultsLoaderState extends State<ResultsLoader> {
  static const _pageSize = 20;
  GraphQLClient? _client;

  final PagingController<int, Query$AcceptingStoresSearch$stores> _pagingController = PagingController(firstPageKey: 0);

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

      if (widget != oldWidget) {
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
      // TODO 2691: Remove ignore of deprecation, when new endpoint will be used
      // ignore: deprecated_member_use_from_same_package
      final newItems = newData.stores;

      final isLastPage = newItems.length < _pageSize;
      if (isLastPage) {
        _pagingController.appendLastPage(newItems);
      } else {
        final nextPageKey = pageKey + newItems.length;
        _pagingController.appendPage(newItems, nextPageKey);
      }
    } on Exception catch (error) {
      if (!mounted) return;
      if (widget != oldWidget) {
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
    return PagedSliverList<int, Query$AcceptingStoresSearch$stores>.separated(
      pagingController: _pagingController,
      builderDelegate: PagedChildBuilderDelegate<Query$AcceptingStoresSearch$stores>(
        itemBuilder: (context, item, index) {
          final storeCoordinates = item.physicalStore?.coordinates;
          return IntrinsicHeight(
            child: AcceptingStoreSummary(
              key: ValueKey(item.id),
              store: AcceptingStoreSummaryModel(
                item.physicalStore?.id,
                item.name,
                _getLocalizedDescription(item.descriptions),
                item.categoryId,
                storeCoordinates != null ? Coordinates(storeCoordinates.lat, storeCoordinates.lng) : null,
                item.physicalStore?.address.location,
              ),
              coordinates: widget.coordinates,
              showOnMap: (it) => HomePageData.of(context)?.navigateToMapTab(it),
            ),
          );
        },
        noMoreItemsIndicatorBuilder: _buildNoMoreItemsSpacer,
        noItemsFoundIndicatorBuilder: _buildNoItemsFoundIndicator,
        firstPageErrorIndicatorBuilder: _buildErrorWithRetry,
        newPageErrorIndicatorBuilder: _buildErrorWithRetry,
        newPageProgressIndicatorBuilder: _buildProgressIndicator,
        firstPageProgressIndicatorBuilder: _buildProgressIndicator,
      ),
      separatorBuilder: (context, index) => const Divider(height: 0),
    );
  }

  Widget _buildProgressIndicator(BuildContext context) => const Center(
    child: Padding(padding: EdgeInsets.all(5), child: CircularProgressIndicator()),
  );

  Widget _buildNoMoreItemsSpacer(BuildContext context) => const SizedBox(height: 80);

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

  String? _getLocalizedDescription(List<Query$AcceptingStoresSearch$stores$descriptions>? descriptions) {
    if (descriptions == null || descriptions.isEmpty) return null;

    String? fallback;

    for (final description in descriptions) {
      final locale = description.locale.toLowerCase();
      if (locale == LocaleSettings.currentLocale.languageCode.toLowerCase()) {
        return description.text;
      }
      if (locale == AppLocale.de.languageCode.toLowerCase()) {
        fallback ??= description.text;
      }
    }

    return fallback;
  }

  @override
  void dispose() {
    _pagingController.dispose();
    super.dispose();
  }
}
