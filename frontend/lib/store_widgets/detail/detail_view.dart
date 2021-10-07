import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import '../../graphql/graphql_api.dart';
import '../../graphql/graphql_api.graphql.dart';
import '../../util/color_utils.dart';
import '../../widgets/error_message.dart';
import 'detail_content.dart';
import 'detail_layout.dart';

class DetailView extends StatelessWidget {
  final int _acceptingStoreId;
  final bool hideShowOnMapButton;

  DetailView(this._acceptingStoreId, {this.hideShowOnMapButton = false});

  @override
  Widget build(BuildContext context) {
    final byIdQuery = AcceptingStoreByIdQuery(
        variables: AcceptingStoreByIdArguments(
            ids: IdsParamsInput(ids: [_acceptingStoreId])));
    return Query(
        options: QueryOptions(
            document: byIdQuery.document,
            variables: byIdQuery.getVariablesMap()),
        builder: (result, {refetch, fetchMore}) {
          try {
            if (result.hasException) {
              throw result.exception;
            }

            if (result.isLoading) {
              return DetailLayout(body: LinearProgressIndicator());
            }
            final matchingStores =
                byIdQuery.parse(result.data).physicalStoresById;
            if (matchingStores.isEmpty) {
              throw ArgumentError("Store not found.");
            }
            final categoryId = matchingStores.first?.store?.category?.id;
            final accentColor = getDarkenedColorForCategory(categoryId);
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
          } on Exception catch (e) {
            debugPrint(e.toString());
            return _errorMessage("Fehler beim Laden der Daten", refetch);
          }
        });
  }

  Widget _errorMessage(String message, Function refetch) {
    return DetailLayout(
        title: "",
        body: InkWell(
            onTap: refetch,
            child: Padding(
              padding: EdgeInsets.all(16),
              child: ErrorMessage(message),
            )));
  }
}
