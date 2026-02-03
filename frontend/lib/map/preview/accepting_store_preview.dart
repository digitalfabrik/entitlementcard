import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql_gen/graphql_queries/stores/accepting_stores_by_physical_store_ids.graphql.dart';
import 'package:ehrenamtskarte/map/preview/accepting_store_preview_card.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class AcceptingStorePreview extends StatelessWidget {
  final int physicalStoreId;

  const AcceptingStorePreview({super.key, required this.physicalStoreId});

  @override
  Widget build(BuildContext context) {
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
        try {
          final exception = result.exception;

          if (result.hasException && exception != null) {
            throw exception;
          }

          final fetchedData = result.parsedData;

          if (result.isLoading && fetchedData == null) {
            return const AcceptingStorePreviewCard(isLoading: true);
          }

          if (fetchedData == null) {
            throw Exception('Fetched data is null.');
          }

          final stores = fetchedData.stores;
          if (stores.length != 1) {
            throw Exception('Server unexpectedly returned an array of the wrong size.');
          }
          final store = stores.first;
          return AcceptingStorePreviewCard(isLoading: false, acceptingStore: AcceptingStoreModel.fromGraphql(store));
        } on Exception catch (e) {
          debugPrint(e.toString());
          return AcceptingStorePreviewCard(isLoading: false, refetch: refetch);
        }
      },
    );
  }
}
