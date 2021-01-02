import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import '../../graphql/graphql_api.dart';
import '../../graphql/graphql_api.graphql.dart';
import '../../widgets/error_message.dart';
import 'detail_content.dart';
import 'detail_layout.dart';

class DetailView extends StatelessWidget {
  final int _acceptingStoreId;

  DetailView(this._acceptingStoreId);

  @override
  Widget build(BuildContext context) {
    final byIdQuery = AcceptingStoreByIdQuery(
        variables: AcceptingStoreByIdArguments(
            ids: IdsParamsInput(ids: [_acceptingStoreId])));
    return Query(
      options: QueryOptions(
          documentNode: byIdQuery.document,
          variables: byIdQuery.getVariablesMap()),
      builder: (result, {refetch, fetchMore}) {
        if (result.hasException) {
          return _errorMessage(result.exception.toString());
        }

        if (result.loading) {
          return DetailLayout(title: "", body: LinearProgressIndicator());
        }
        final matchingStores =
            AcceptingStoreByIdQuery().parse(result.data).physicalStoresById;
        if (matchingStores.isEmpty) {
          return _errorMessage("Akzeptanzstelle nicht gefunden");
        }
        return DetailLayout(
          title: matchingStores.first.store.name,
          body: DetailContent(matchingStores.first),
          category: matchingStores.first.store.category.id,
        );
      },
    );
  }

  Widget _errorMessage(String message) {
    return DetailLayout(
        title: "",
        body: Padding(
          padding: EdgeInsets.all(16),
          child: ErrorMessage(message),
        ));
  }
}
