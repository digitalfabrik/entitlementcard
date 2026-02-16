import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql_gen/graphql_queries/stores/accepting_stores_by_physical_store_ids.graphql.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/map/preview/accepting_store_preview_card.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:ehrenamtskarte/sentry.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class AcceptingStorePreview extends StatelessWidget {
  final int physicalStoreId;

  const AcceptingStorePreview({super.key, required this.physicalStoreId});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final projectId = Configuration.of(context).projectId;

    return Query$AcceptingStoresByPhysicalStoreIds$Widget(
      options: Options$Query$AcceptingStoresByPhysicalStoreIds(
        fetchPolicy: FetchPolicy.cacheAndNetwork,
        variables: Variables$Query$AcceptingStoresByPhysicalStoreIds(
          project: projectId,
          physicalStoreIds: [physicalStoreId],
        ),
      ),
      builder: (result, {refetch, fetchMore}) {
        final data = result.parsedData;
        if (result.isLoading && data == null) {
          return const AcceptingStorePreviewCard(isLoading: true);
        }

        if (result.hasException) {
          debugPrint('AcceptingStores query failed: ${result.exception}');
          // If we have cached data, show it even if the network request fails
          if (data == null) {
            return AcceptingStorePreviewCard(isLoading: false, refetch: refetch);
          }
        }

        if (data == null || data.stores.length != 1) {
          debugPrint('Unexpected AcceptingStores response length: ${data?.stores.length}');
          reportError('AcceptanceStore $physicalStoreId was deleted and cannot be shown on the map', null);
          final client = GraphQLProvider.of(context).value;
          client.cache.store.reset();
          debugPrint('Clear store cache, data is not in sync');
          return AcceptingStorePreviewCard(isLoading: false, errorMessage: t.store.acceptingStoreNotAvailable);
        }

        final store = data.stores.single;
        return AcceptingStorePreviewCard(isLoading: false, acceptingStore: AcceptingStoreModel.fromGraphql(store));
      },
    );
  }
}
