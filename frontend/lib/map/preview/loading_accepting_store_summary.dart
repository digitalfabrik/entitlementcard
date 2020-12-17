import 'package:ehrenamtskarte/widgets/error_message.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import '../../graphql/graphql_api.dart';
import 'accepting_store_summary_content.dart';
import 'models.dart';

typedef void OnExecptionCallback(Exception exception);

class LoadingAcceptingStorySummary extends StatelessWidget {
  final int acceptingStoreId;

  LoadingAcceptingStorySummary(this.acceptingStoreId, {Key key})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    final query = AcceptingStoreSummaryByIdQuery(
        variables: AcceptingStoreSummaryByIdArguments(
            ids: IdsParamsInput(ids: [this.acceptingStoreId])));
    return Query(
        options: QueryOptions(
            documentNode: query.document, variables: query.getVariablesMap()),
        builder: (result, {refetch, fetchMore}) {
          try {
            if (result.hasException) {
              throw result.exception;
            }
            if (result.loading) {
              return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 30),
                  child: const LinearProgressIndicator());
            }
            var stores = query.parse(result.data).physicalStoresById;
            if (stores.isEmpty) {
              throw Exception("ID not found");
            }
            return AcceptingStoreSummaryContent(
                _convertToAcceptingStoreSummary(stores[0]));
          } on Exception catch (e) {
            debugPrint(e.toString());
            return ErrorMessage("Fehler beim Laden der Infos.");
          }
        });
  }

  _convertToAcceptingStoreSummary(
      AcceptingStoreSummaryById$Query$PhysicalStore store) {
    return AcceptingStoreSummary(
        store.id, store.store.name, store.store.description);
  }
}
