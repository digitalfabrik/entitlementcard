import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'graphql_api.dart';

class GraphQLTestPage extends StatelessWidget {
  GraphQLTestPage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Query(
        options: QueryOptions(documentNode: AcceptingStoresQuery().document),
        builder: (QueryResult result,
            {VoidCallback refetch, FetchMore fetchMore}) {
          if (result.hasException) {
            return Text(result.exception.toString(),
                style: TextStyle(color: Colors.red));
          }

          if (result.loading) {
            return Text('Loading …');
          }
          final allStores =
              AcceptingStores.fromJson(result.data).acceptingStoreName;
          final resultNames = allStores.map((e) => e.name).join(" ");
          return Text(resultNames);
        },
      ),
      Query(
        options: QueryOptions(
            documentNode: AcceptingStoreByIdQuery().document,
            variables: {
              "ids": {
                "ids": [1]
              }
            }),
        builder: (QueryResult result,
            {VoidCallback refetch, FetchMore fetchMore}) {
          if (result.hasException) {
            return Text(result.exception.toString(),
                style: TextStyle(color: Colors.red));
          }

          if (result.loading) {
            return Text('Loading …');
          }
          final allStores =
              AcceptingStoreById.fromJson(result.data).acceptingStoreById;
          final resultNames =
              "Store with id 1: " + allStores.map((e) => e.name).join(" ");
          return Text(resultNames);
        },
      )
    ]);
  }
}
