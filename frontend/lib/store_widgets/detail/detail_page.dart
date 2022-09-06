import 'package:ehrenamtskarte/graphql/graphql_api.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:ehrenamtskarte/store_widgets/detail/detail_app_bar.dart';
import 'package:ehrenamtskarte/store_widgets/detail/detail_content.dart';
import 'package:ehrenamtskarte/util/color_utils.dart';
import 'package:ehrenamtskarte/widgets/error_message.dart';
import 'package:ehrenamtskarte/widgets/top_loading_spinner.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class DetailPage extends StatelessWidget {
  final int _acceptingStoreId;
  final bool hideShowOnMapButton;

  const DetailPage(this._acceptingStoreId, {super.key, this.hideShowOnMapButton = false});

  @override
  Widget build(BuildContext context) {
    final byIdQuery =
        AcceptingStoreByIdQuery(variables: AcceptingStoreByIdArguments(ids: IdsParamsInput(ids: [_acceptingStoreId])));
    return Query(
      options: QueryOptions(document: byIdQuery.document, variables: byIdQuery.getVariablesMap()),
      builder: (result, {refetch, fetchMore}) {
        final exception = result.exception;
        final data = result.data;

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

  const DetailErrorMessage({super.key, required this.message, this.refetch});

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
