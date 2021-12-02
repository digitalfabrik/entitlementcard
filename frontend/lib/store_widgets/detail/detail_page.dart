import 'package:ehrenamtskarte/store_widgets/detail/detail_app_bar.dart';
import 'package:ehrenamtskarte/widgets/top_loading_spinner.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import '../../graphql/graphql_api.dart';
import '../../graphql/graphql_api.graphql.dart';
import '../../util/color_utils.dart';
import '../../widgets/error_message.dart';
import 'detail_content.dart';

class DetailPage extends StatelessWidget {
  final int _acceptingStoreId;
  final bool hideShowOnMapButton;

  const DetailPage(this._acceptingStoreId, {Key? key, this.hideShowOnMapButton = false}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final byIdQuery =
        AcceptingStoreByIdQuery(variables: AcceptingStoreByIdArguments(ids: IdsParamsInput(ids: [_acceptingStoreId])));
    return Query(
      options: QueryOptions(document: byIdQuery.document, variables: byIdQuery.getVariablesMap()),
      builder: (result, {refetch, fetchMore}) {
        var exception = result.exception;
        var data = result.data;

        if (result.hasException && exception != null) {
          return DetailErrorMessage(message: "Fehler beim Laden der Daten", refetch: refetch);
        } else if (result.isNotLoading && data != null) {
          final matchingStores = byIdQuery.parse(data).physicalStoresById;
          if (matchingStores.isEmpty) {
            return const DetailErrorMessage(message: "Akzeptanzstelle nicht gefunden.");
          }
          final categoryId = matchingStores.first.store.category.id;
          final accentColor = getDarkenedColorForCategory(categoryId);
          return Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DetailAppBar(matchingStores.first),
              Expanded(
                child: DetailContent(
                  matchingStores.first,
                  hideShowOnMapButton: hideShowOnMapButton,
                  accentColor: accentColor,
                ),
              )
            ],
          );
        } else {
          return const TopLoadingSpinner();
        }
      },
    );
  }
}

class DetailErrorMessage extends StatelessWidget {
  final String message;
  final Future<QueryResult?> Function()? refetch;

  const DetailErrorMessage({Key? key, required this.message, this.refetch}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: refetch,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: ErrorMessage(message),
      ),
    );
  }
}
