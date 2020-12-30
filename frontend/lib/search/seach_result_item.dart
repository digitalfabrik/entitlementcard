import 'package:ehrenamtskarte/map/detail/detail_view.dart';
import 'package:flutter/material.dart';

import '../graphql/graphql_api.dart';

class SearchResultItem extends StatelessWidget {
  final AcceptingStoresSearch$Query$AcceptingStore item;

  const SearchResultItem({Key key, this.item}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
        title: Text(item.name),
        subtitle: Text(
          item.description,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        isThreeLine: true,
        trailing: Container(
            child: Icon(Icons.keyboard_arrow_right, size: 30.0),
            height: double.infinity),
        onTap: () {
          _openDetailView(context, item.id);
        });
  }

  void _openDetailView(BuildContext context, int acceptingStoreId) {
    Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => DetailView(acceptingStoreId),
        ));
  }
}
