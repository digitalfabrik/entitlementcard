import 'dart:math';

import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';

import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:ehrenamtskarte/home/home_page.dart';
import 'package:ehrenamtskarte/favorites/favorites_model.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:ehrenamtskarte/store_widgets/accepting_store_summary.dart';
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:provider/provider.dart';

class FavoritesLoader extends StatefulWidget {
  const FavoritesLoader({super.key});

  @override
  State<StatefulWidget> createState() => FavoritesLoaderState();
}

class FavoritesLoaderState extends State<FavoritesLoader> {
  static const _pageSize = 20;

  GraphQLClient? _client;

  late FavoritesModel _favoritesModel;

  final PagingController<int, AcceptingStoreById$Query$PhysicalStore> _pagingController =
      PagingController(firstPageKey: 0);

  @override
  void initState() {
    super.initState();
    _pagingController.addPageRequestListener(_fetchPage);
    _favoritesModel = Provider.of<FavoritesModel>(context, listen: false);
    _favoritesModel.addListener(() {
      _pagingController.refresh();
    });
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
  void didUpdateWidget(FavoritesLoader oldWidget) {
    super.didUpdateWidget(oldWidget);
    _pagingController.refresh();
  }

  Future<void> _fetchPage(int pageKey) async {
    final projectId = Configuration.of(context).projectId;

    try {
      final favoritesModel = _favoritesModel;
      if (!favoritesModel.isInitialized) {
        throw Exception('Failed to load favorites');
      }

      final favorites = favoritesModel.favoriteStoreIds;

      if (favorites.isEmpty || pageKey >= favorites.length) {
        _pagingController.appendLastPage(List<AcceptingStoreById$Query$PhysicalStore>.empty());
        return;
      }

      final fetchIds = favorites.getRange(pageKey, min(pageKey + _pageSize, favorites.length)).toList();

      final query = AcceptingStoreByIdQuery(variables: AcceptingStoreByIdArguments(project: projectId, ids: fetchIds));

      final client = _client;
      if (client == null) {
        throw Exception('GraphQL client is not yet initialized!');
      }

      final result = await client.query(QueryOptions(document: query.document, variables: query.getVariablesMap()));
      final exception = result.exception;
      if (result.hasException && exception != null) {
        throw exception;
      }

      final newData = result.data;
      if (newData == null) {
        throw Exception('Fetched data is null');
      }

      final newItems = query.parse(newData).physicalStoresByIdInProject.cast<AcceptingStoreById$Query$PhysicalStore>();

      final isLastPage = newItems.length < _pageSize;
      if (isLastPage) {
        _pagingController.appendLastPage(newItems);
      } else {
        final nextPageKey = pageKey + newItems.length;
        _pagingController.appendPage(newItems, nextPageKey);
      }
    } catch (error) {
      _pagingController.error = error;
    }
  }

  @override
  Widget build(BuildContext context) {
    return PagedSliverList<int, AcceptingStoreById$Query$PhysicalStore>.separated(
      pagingController: _pagingController,
      builderDelegate: PagedChildBuilderDelegate<AcceptingStoreById$Query$PhysicalStore>(
        itemBuilder: (context, item, index) {
          return IntrinsicHeight(
            child: AcceptingStoreSummary(
              key: ValueKey(item.id),
              store: AcceptingStoreSummaryModel(
                  item.id, item.store.name, item.store.description, item.store.category.id, null, null),
              showOnMap: (it) => HomePageData.of(context)?.navigateToMapTab(it),
            ),
          );
        },
        noItemsFoundIndicatorBuilder: _buildNoItemsFoundIndicator,
        firstPageErrorIndicatorBuilder: _buildErrorWithRetry,
        newPageErrorIndicatorBuilder: _buildErrorWithRetry,
        firstPageProgressIndicatorBuilder: _buildProgressIndicator,
        newPageProgressIndicatorBuilder: _buildProgressIndicator,
      ),
      separatorBuilder: (context, index) => const Divider(height: 0),
    );
  }

  Widget _buildProgressIndicator(BuildContext context) =>
      const Center(child: Padding(padding: EdgeInsets.all(5), child: CircularProgressIndicator()));

  Widget _buildErrorWithRetry(BuildContext context) {
    final t = context.t;
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.warning, size: 60, color: Colors.orange),
          Text(t.favorites.loadingFailed),
          OutlinedButton(
            onPressed: _pagingController.retryLastFailedRequest,
            child: Text(t.common.tryAgain),
          )
        ],
      ),
    );
  }

  Widget _buildNoItemsFoundIndicator(BuildContext context) {
    final t = context.t;
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.search_off, size: 60, color: Theme.of(context).disabledColor),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text(
              t.favorites.noFavoritesFound,
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _favoritesModel.removeListener(() {
      _pagingController.refresh();
    });
    _pagingController.dispose();
    super.dispose();
  }
}
