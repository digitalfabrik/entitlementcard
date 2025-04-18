import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql_gen/graphql_queries/stores/physical_store_by_id.graphql.dart';
import 'package:ehrenamtskarte/store_widgets/detail/detail_app_bar.dart';
import 'package:ehrenamtskarte/store_widgets/detail/detail_content.dart';
import 'package:ehrenamtskarte/util/color_utils.dart';
import 'package:ehrenamtskarte/widgets/error_message.dart';
import 'package:ehrenamtskarte/widgets/top_loading_spinner.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

import 'package:ehrenamtskarte/map/map_page.dart';

class DetailPage extends StatelessWidget {
  final int physicalStoreId;
  final void Function(PhysicalStoreFeatureData)? showOnMap;

  const DetailPage({super.key, required this.physicalStoreId, this.showOnMap});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final projectId = Configuration.of(context).projectId;
    return Query$PhysicalStoreById$Widget(
      options: Options$Query$PhysicalStoreById(
          variables: Variables$Query$PhysicalStoreById(project: projectId, ids: [physicalStoreId])),
      builder: (result, {refetch, fetchMore}) {
        final exception = result.exception;
        final data = result.parsedData;

        if (result.hasException && exception != null) {
          return DetailErrorMessage(message: t.store.loadingDataFailed, refetch: refetch);
        } else if (result.isNotLoading && data != null) {
          final matchingStores = data.stores;
          if (matchingStores.length != 1) {
            return DetailErrorMessage(message: t.store.loadingDataFailed, refetch: refetch);
          }
          final matchingStore = matchingStores.first;
          if (matchingStore == null) {
            return DetailErrorMessage(message: t.store.acceptingStoreNotFound);
          }
          final categoryId = matchingStore.store.category.id;
          final accentColor = getDarkenedColorForCategory(context, categoryId);
          return Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DetailAppBar(
                storeId: matchingStore.id,
                storeName: matchingStore.store.name ?? t.store.acceptingStore,
                categoryId: matchingStore.store.category.id,
                showFavoriteButton: true,
              ),
              Expanded(
                  child: Scaffold(
                body: DetailContent(
                  matchingStore,
                  showOnMap: showOnMap,
                  accentColor: accentColor,
                ),
              )),
            ],
          );
        } else {
          return const TopLoadingSpinner();
        }
      },
    );
  }
}

class DetailErrorMessage extends StatelessWidget {
  final String message;
  final Future<QueryResult?> Function()? refetch;

  const DetailErrorMessage({super.key, required this.message, this.refetch});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: refetch,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: ErrorMessage(message),
      ),
    );
  }
}
