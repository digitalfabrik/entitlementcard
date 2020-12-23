import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:ehrenamtskarte/map/detail/detail_view.dart';
import 'package:ehrenamtskarte/widgets/error_message.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'results_list.dart';

class ResultsLoader extends StatelessWidget {
  final String _searchText;
  final List<int> _searchCategories;

  ResultsLoader(this._searchText, this._searchCategories, {Key key})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    final searchQuery = AcceptingStoresSearchQuery(
        variables: AcceptingStoresSearchArguments(
            params: SearchParamsInput(
                categoryIds: _searchCategories, searchText: _searchText)));
    return Query(
      options: QueryOptions(
          documentNode: searchQuery.document,
          variables: searchQuery.getVariablesMap()),
      builder: (QueryResult result,
          {VoidCallback refetch, FetchMore fetchMore}) {
        if (result.hasException) {
          return SliverToBoxAdapter(
              child: ErrorMessage(result.exception.toString()));
        }

        if (result.loading) {
          return SliverToBoxAdapter(child: LinearProgressIndicator());
        }
        final matchingStores = AcceptingStoresSearchQuery()
            .parse(result.data)
            .searchAcceptingStores;
        if (matchingStores.isEmpty) {
          return SliverToBoxAdapter(child: Text("Keine Ergebnisse gefunden"));
        }
        return ResultsList(matchingStores);
      },
    );
  }

  void _openDetailView(BuildContext context, int acceptingStoreId) {
    Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => DetailView(acceptingStoreId),
        ));
  }
}
