import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import '../../graphql/graphql_api.dart';
import 'accepting_store_preview_card.dart';

class AcceptingStorePreview extends StatelessWidget {
  final int acceptingStoreId;
  final bool hideShowOnMapButton;

  AcceptingStorePreview(this.acceptingStoreId,
      {Key key, this.hideShowOnMapButton})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    final query = AcceptingStoreSummaryByIdQuery(
        variables: AcceptingStoreSummaryByIdArguments(
            ids: IdsParamsInput(ids: [acceptingStoreId])));
    return Query(
        options: QueryOptions(
            document: query.document, variables: query.getVariablesMap()),
        builder: (result, {refetch, fetchMore}) {
          try {
            if (result.hasException) {
              throw result.exception;
            }
            if (result.isLoading) {
              return AcceptingStorePreviewCard(isLoading: true);
            }
            var stores = query.parse(result.data).physicalStoresById;
            if (stores.isEmpty) {
              throw Exception("ID not found");
            }
            return AcceptingStorePreviewCard(
                isLoading: false,
                acceptingStore: _convertToAcceptingStoreSummary(stores[0]));
          } on Exception catch (e) {
            debugPrint(e.toString());
            return AcceptingStorePreviewCard(
                isLoading: false, refetch: refetch);
          }
        });
  }

  _convertToAcceptingStoreSummary(
      AcceptingStoreSummaryById$Query$PhysicalStore store) {
    return AcceptingStoreSummary(
        store.id, store.store.name, store.store.description);
  }
}
