import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import '../../graphql/graphql_api.dart';
import '../../graphql/graphql_api.graphql.dart';
import '../../util/color_utils.dart';
import '../../widgets/error_message.dart';
import 'detail_content.dart';

class DetailView extends StatelessWidget {
  final int _acceptingStoreId;
  final bool hideShowOnMapButton;

  const DetailView(this._acceptingStoreId,
      {Key? key, this.hideShowOnMapButton = false})
      : super(key: key);

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
          var exception = result.exception;
          if (result.hasException && exception != null) {
            debugPrint(exception.toString());
            return _errorMessage("Fehler beim Laden der Daten", refetch);
          }
          var data = result.data;

          if (result.isLoading || data == null) {
            return const LinearProgressIndicator();
          }

          final matchingStores = byIdQuery.parse(data).physicalStoresById;
          if (matchingStores.isEmpty) {
            throw ArgumentError("Store not found."); // FIXME
          }
          final categoryId = matchingStores.first.store.category.id;
          final accentColor = getDarkenedColorForCategory(categoryId);
          return DetailContent(
              matchingStores.first,
              hideShowOnMapButton: hideShowOnMapButton,
              accentColor: accentColor,
          );
        });
  }

  Widget _errorMessage(
      String message, Future<QueryResult?> Function()? refetch) {
    return InkWell(
            onTap: refetch,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: ErrorMessage(message),
            ));
  }
}
