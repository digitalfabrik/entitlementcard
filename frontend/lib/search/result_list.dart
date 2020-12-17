import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:ehrenamtskarte/widgets/error_message.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class ResultList extends StatelessWidget {
  String _searchText;
  int _searchCategory;

  ResultList(this._searchText, this._searchCategory);

  @override
  Widget build(BuildContext context) {
    final byIdQuery = SearchAcceptingStoresQuery(
        variables: SearchAcceptingStoresArguments(
            searchParams: SearchParamsInput(
                categoryId: _searchCategory, searchText: _searchText)));
    return Query(
      options: QueryOptions(
          documentNode: byIdQuery.document,
          variables: byIdQuery.getVariablesMap()),
      builder: (QueryResult result,
          {VoidCallback refetch, FetchMore fetchMore}) {
        if (result.hasException) {
          return SliverToBoxAdapter(
              child: ErrorMessage(result.exception.toString()));
        }

        if (result.loading) {
          return SliverToBoxAdapter(child: LinearProgressIndicator());
        }
        final matchingStores = SearchAcceptingStoresQuery()
            .parse(result.data)
            .searchAcceptingStores;
        if (matchingStores.isEmpty) {
          return SliverToBoxAdapter(child: Text("Keine Ergebnisse gefunden"));
        }
        return SliverList(
            delegate: SliverChildBuilderDelegate(
                (ctx, index) => ListTile(
                      title: Text(matchingStores[index].name),
                      subtitle: Text(matchingStores[index].description),
                    ),
                childCount: 50));
      },
    );
  }
}
