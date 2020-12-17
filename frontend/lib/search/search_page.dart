import 'package:flutter/material.dart';

import 'filter_bar.dart';

class SearchPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          title: TextField(
            controller: TextEditingController(),
            decoration: InputDecoration.collapsed(
              hintText: "Tippen und schreiben, um zu suchen …",
            ),
          ),
          pinned: true,
          actions: [
            IconButton(
              icon: const Icon(Icons.search),
              onPressed: () => {},
            )
          ],
        ),
        FilterBar(),
        SliverList(
            delegate: SliverChildBuilderDelegate(
                (ctx, index) => ListTile(title: Text('Search result #$index')),
                childCount: 500))
      ],
    );
  }
}
