import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'business.dart';
import 'business_summary_content.dart';
import '../../graphql/graphql_api.dart';

typedef void OnExecptionCallback(Exception exception);

class LoadingBusinessSummary extends StatelessWidget {
  final int businessId;
  final OnExecptionCallback onException;

  LoadingBusinessSummary(this.businessId, {Key key, this.onException})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    var query = AcceptingStoreSummaryByIdQuery(
        variables: AcceptingStoreSummaryByIdArguments(
            ids: ParamsInput(ids: [this.businessId])));
    return Query(
        options: QueryOptions(documentNode: query.document),
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
            var stores = query.parse(result.data).acceptingStoreById;
            if (stores.isEmpty) {
              throw Exception("ID not found");
            }
            return BusinessSummaryContent(
                _convertToAcceptingBusiness(stores[0]));
          } on Exception catch (e) {
            debugPrint(e.toString());
            return Row(children: [
              Icon(Icons.warning, color: Colors.orange),
              SizedBox(
                width: 8,
              ),
              Text("Fehler beim Laden der Infos."),
            ]);
          }
        });
  }

  _convertToAcceptingBusiness(
      AcceptingStoreSummaryById$Query$AcceptingStore store) {
    return AcceptingBusiness(store.id.toString(), store.name,
        "An accepting store of category ${store.category.toString()}" // TODO get real description
        );
  }
}
