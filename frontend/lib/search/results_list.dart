import 'dart:math';

import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:ehrenamtskarte/map/detail/detail_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class ResultsList extends StatelessWidget {
  final List<AcceptingStoresSearch$Query$AcceptingStore> matchingStores;

  ResultsList(this.matchingStores, {Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
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
  }

  void _openDetailView(BuildContext context, int acceptingStoreId) {
    Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => DetailView(acceptingStoreId),
        ));
  }
}
