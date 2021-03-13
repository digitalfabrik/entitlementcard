import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import '../../graphql/graphql_api.dart';
import '../../graphql/graphql_api.graphql.dart';
import '../../widgets/error_message.dart';
import 'detail_content.dart';
import 'detail_layout.dart';

class DetailView extends StatelessWidget {
  final int _acceptingStoreId;
  final bool hideShowOnMapButton;
  final Color accentColor;

  DetailView(this._acceptingStoreId,
      {this.hideShowOnMapButton = false, this.accentColor});

  @override
  Widget build(BuildContext context) {
    final byIdQuery = AcceptingStoreByIdQuery(
        variables: AcceptingStoreByIdArguments(
            ids: IdsParamsInput(ids: [_acceptingStoreId])));
    return Query(
      options: QueryOptions(
          document: byIdQuery.document, variables: byIdQuery.getVariablesMap()),
      builder: (result, {refetch, fetchMore}) {
        if (result.hasException) {
          return _errorMessage(result.exception.toString());
        }

        if (result.isLoading) {
          return DetailLayout(body: LinearProgressIndicator());
        }
        final matchingStores =
            AcceptingStoreByIdQuery().parse(result.data).physicalStoresById;
        if (matchingStores.isEmpty) {
          return _errorMessage("Akzeptanzstelle nicht gefunden");
        }
        return DetailLayout(
          title: matchingStores.first.store.name ?? "Akzeptanzstelle",
          body: DetailContent(
            matchingStores.first,
            hideShowOnMapButton: hideShowOnMapButton,
            accentColor: accentColor,
          ),
          categoryId: matchingStores.first.store.category.id,
          categoryName: matchingStores.first.store.category.name,
          accentColor: accentColor,
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
