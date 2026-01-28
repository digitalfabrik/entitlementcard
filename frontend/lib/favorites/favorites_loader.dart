import 'dart:math';

import 'package:ehrenamtskarte/graphql_gen/graphql_queries/stores/accepting_stores_by_physical_store_ids.graphql.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';

import 'package:ehrenamtskarte/home/home_page.dart';
import 'package:ehrenamtskarte/favorites/favorites_model.dart';
import 'package:ehrenamtskarte/favorites/favorite_store.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:ehrenamtskarte/store_widgets/accepting_store_summary.dart';
import 'package:ehrenamtskarte/store_widgets/removed_store_summary.dart';
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
  late VoidCallback _favoritesListener;

  final PagingController<int, FavoriteStore> _pagingController = PagingController(firstPageKey: 0);

  @override
  void initState() {
    super.initState();
    _pagingController.addPageRequestListener(_fetchPage);
    _favoritesModel = Provider.of<FavoritesModel>(context, listen: false);
    _favoritesListener = () {
      if (mounted) _pagingController.refresh();
    };
    _favoritesModel.addListener(_favoritesListener);
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
    try {
      final favoritesModel = _favoritesModel;
      if (!favoritesModel.isInitialized) {
        throw Exception('Failed to load favorites');
      }

      final favorites = favoritesModel.getFavoriteIds();

      if (favorites.isEmpty || pageKey >= favorites.length) {
        _pagingController.appendLastPage(List.empty());
        return;
      }

      final fetchIds = favorites.getRange(pageKey, min(pageKey + _pageSize, favorites.length)).toList();

      final acceptingStores = {
        for (final store in await _fetchAcceptingStores(fetchIds))
          if (store.physicalStoreId != null) store.physicalStoreId!: store,
      };

      final newItems = fetchIds
          .map((id) => favoritesModel.getFavoriteStore(id)..acceptingStore = acceptingStores[id])
          .toList();

      if (mounted) {
        final isLastPage = newItems.length < _pageSize;
        if (isLastPage) {
          _pagingController.appendLastPage(newItems);
        } else {
          final nextPageKey = pageKey + newItems.length;
          _pagingController.appendPage(newItems, nextPageKey);
        }
      }
    } catch (error) {
      if (mounted) {
        _pagingController.error = error;
      }
    }
  }

  Future<List<AcceptingStoreModel>> _fetchAcceptingStores(List<int> physicalStoreIds) async {
    final projectId = Configuration.of(context).projectId;

    final client = _client;
    if (client == null) {
      throw Exception('GraphQL client is not yet initialized!');
    }

    final result = await client.query$AcceptingStoresByPhysicalStoreIds(
      Options$Query$AcceptingStoresByPhysicalStoreIds(
        variables: Variables$Query$AcceptingStoresByPhysicalStoreIds(
          project: projectId,
          physicalStoreIds: physicalStoreIds,
        ),
      ),
    );
    final exception = result.exception;
    if (result.hasException && exception != null) {
      throw exception;
    }

    final data = result.parsedData;
    if (data == null) {
      throw Exception('Fetched data is null');
    }
    return data.stores.map((store) => AcceptingStoreModel.fromGraphql(store)).toList();
  }

  @override
  Widget build(BuildContext context) {
    return PagedSliverList<int, FavoriteStore>.separated(
      pagingController: _pagingController,
      builderDelegate: PagedChildBuilderDelegate<FavoriteStore>(
        itemBuilder: _buildItem,
        noItemsFoundIndicatorBuilder: _buildNoItemsFoundIndicator,
        firstPageErrorIndicatorBuilder: _buildErrorWithRetry,
        newPageErrorIndicatorBuilder: _buildErrorWithRetry,
        firstPageProgressIndicatorBuilder: _buildProgressIndicator,
        newPageProgressIndicatorBuilder: _buildProgressIndicator,
      ),
      separatorBuilder: (context, index) => const Divider(height: 0),
    );
  }

  Widget _buildItem(BuildContext context, FavoriteStore item, index) {
    final store = item.acceptingStore;
    if (store != null) {
      return IntrinsicHeight(
        child: AcceptingStoreSummary(
          key: ValueKey(store.id),
          store: store,
          showOnMap: (it) => HomePageData.of(context)?.navigateToMapTab(it),
        ),
      );
    } else {
      return IntrinsicHeight(
        child: RemovedStoreSummary(storeId: item.storeId, storeName: item.storeName, categoryId: item.categoryId),
      );
    }
  }

  Widget _buildProgressIndicator(BuildContext context) => const Center(
    child: Padding(padding: EdgeInsets.all(5), child: CircularProgressIndicator()),
  );

  Widget _buildErrorWithRetry(BuildContext context) {
    final t = context.t;
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.warning, size: 60, color: Colors.orange),
          Text(t.favorites.loadingFailed),
          OutlinedButton(onPressed: _pagingController.retryLastFailedRequest, child: Text(t.common.tryAgain)),
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
            child: Text(t.favorites.noFavoritesFound, textAlign: TextAlign.center),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _favoritesModel.removeListener(_favoritesListener);
    _pagingController.dispose();
    super.dispose();
  }
}
