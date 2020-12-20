import 'dart:math';

import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:ehrenamtskarte/map/detail/detail_view.dart';
import 'package:ehrenamtskarte/widgets/error_message.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class ResultList extends StatelessWidget {
  final String _searchText;
  final List<int> _searchCategory;

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
          (BuildContext context, int index) {
            final int itemIndex = index ~/ 2;
            if (index.isEven) {
              return ListTile(
                  title: Text(matchingStores[itemIndex].name),
                  subtitle: Text(
                    matchingStores[itemIndex].description,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  isThreeLine: true,
                  trailing: Container(
                      child: Icon(Icons.keyboard_arrow_right, size: 30.0),
                      height: double.infinity),
                  onTap: () {
                    _openDetailView(context, matchingStores[itemIndex].id);
                  });
            }
            return Divider(height: 0, color: Colors.grey);
          },
          semanticIndexCallback: (Widget widget, int localIndex) {
            if (localIndex.isEven) {
              return localIndex ~/ 2;
            }
            return null;
          },
          childCount: max(0, matchingStores.length * 2 - 1),
        ));
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
