import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:ehrenamtskarte/store_widgets/detail/detail_app_bar.dart';
import 'package:ehrenamtskarte/store_widgets/detail/detail_content.dart';
import 'package:ehrenamtskarte/util/color_utils.dart';
import 'package:ehrenamtskarte/widgets/error_message.dart';
import 'package:ehrenamtskarte/widgets/top_loading_spinner.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

import 'package:ehrenamtskarte/map/map_page.dart';

class DetailPage extends StatelessWidget {
  final int _acceptingStoreId;
  final void Function(PhysicalStoreFeatureData)? showOnMap;

  const DetailPage(this._acceptingStoreId, {super.key, this.showOnMap});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final projectId = Configuration.of(context).projectId;
    final byIdQuery =
        AcceptingStoreByIdQuery(variables: AcceptingStoreByIdArguments(project: projectId, ids: [_acceptingStoreId]));
    return Query(
      options: QueryOptions(document: byIdQuery.document, variables: byIdQuery.getVariablesMap()),
      builder: (result, {refetch, fetchMore}) {
        final exception = result.exception;
        final data = result.data;

        if (result.hasException && exception != null) {
          return DetailErrorMessage(message: t.store.loadingDataFailed, refetch: refetch);
        } else if (result.isNotLoading && data != null) {
          final matchingStores = byIdQuery.parse(data).physicalStoresByIdInProject;
          if (matchingStores.length != 1) {
            return DetailErrorMessage(message: t.store.loadingDataFailed, refetch: refetch);
          }
          final matchingStore = matchingStores.first;
          if (matchingStore == null) {
            return DetailErrorMessage(message: t.store.acceptingStoreNotFound);
          }
          final categoryId = matchingStore.store.category.id;
          final accentColor = getDarkenedColorForCategory(context, categoryId);
          return Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DetailAppBar(matchingStore),
              Expanded(
                  child: Scaffold(
                body: DetailContent(
                  matchingStore,
                  showOnMap: showOnMap,
                  accentColor: accentColor,
                ),
              )),
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
