import 'package:ehrenamtskarte/graphql/graphql_api.dart';
import 'package:ehrenamtskarte/map/preview/accepting_store_preview_card.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class AcceptingStorePreview extends StatelessWidget {
  final int acceptingStoreId;

  const AcceptingStorePreview(this.acceptingStoreId, {super.key});

  @override
  Widget build(BuildContext context) {
    final query = AcceptingStoreSummaryByIdQuery(
      variables: AcceptingStoreSummaryByIdArguments(ids: IdsParamsInput(ids: [acceptingStoreId])),
    );
    return Query(
      options: QueryOptions(document: query.document, variables: query.getVariablesMap()),
      builder: (result, {refetch, fetchMore}) {
        try {
          final exception = result.exception;

          if (result.hasException && exception != null) {
            throw exception;
          }

          final fetchedData = result.data;

          if (result.isLoading || fetchedData == null) {
            return const AcceptingStorePreviewCard(isLoading: true);
          }

          final stores = query.parse(fetchedData).physicalStoresById;
          if (stores.isEmpty) {
            throw Exception("ID not found");
          }
          return AcceptingStorePreviewCard(
            isLoading: false,
            acceptingStore: _convertToAcceptingStoreSummary(stores[0]),
          );
        } on Exception catch (e) {
          debugPrint(e.toString());
          return AcceptingStorePreviewCard(isLoading: false, refetch: refetch);
        }
      },
    );
  }

  AcceptingStoreSummaryModel _convertToAcceptingStoreSummary(AcceptingStoreSummaryById$Query$PhysicalStore item) {
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
