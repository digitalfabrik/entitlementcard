import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql_gen/graphql_queries/stores/accepting_store_summary_by_id.graphql.dart';
import 'package:ehrenamtskarte/map/preview/accepting_store_preview_card.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:flutter/material.dart';

class AcceptingStorePreview extends StatelessWidget {
  final int acceptingStoreId;

  const AcceptingStorePreview(this.acceptingStoreId, {super.key});

  @override
  Widget build(BuildContext context) {
    final projectId = Configuration.of(context).projectId;
    return Query$AcceptingStoreSummaryById$Widget(
      options: Options$Query$AcceptingStoreSummaryById(
          variables: Variables$Query$AcceptingStoreSummaryById(project: projectId, ids: [acceptingStoreId])),
      builder: (result, {refetch, fetchMore}) {
        try {
          final exception = result.exception;

          if (result.hasException && exception != null) {
            throw exception;
          }

          final fetchedData = result.parsedData;

          if (result.isLoading || fetchedData == null) {
            return const AcceptingStorePreviewCard(isLoading: true);
          }

          final stores = fetchedData.stores;
          if (stores.length != 1) {
            throw Exception('Server unexpectedly returned an array of the wrong size.');
          }
          final store = stores[0];
          if (store == null) {
            throw Exception('ID not found.');
          }
          return AcceptingStorePreviewCard(
            isLoading: false,
            acceptingStore: _convertToAcceptingStoreSummary(store),
          );
        } on Exception catch (e) {
          debugPrint(e.toString());
          return AcceptingStorePreviewCard(isLoading: false, refetch: refetch);
        }
      },
    );
  }

  AcceptingStoreSummaryModel _convertToAcceptingStoreSummary(Query$AcceptingStoreSummaryById$stores item) {
    return AcceptingStoreSummaryModel(
      item.id,
      item.store.name,
      item.store.description,
      item.store.categoryId,
      null,
      null,
    );
  }
}
