import 'package:flutter/material.dart';

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
        SliverGrid.count(
            crossAxisCount: 5,
            children: Iterable.generate(10)
                .map((i) => Container(
                    color: Theme.of(context).accentColor,
                    child: IconButton(
                      icon: Icon(Icons.category),
                      onPressed: () => {},
                    )))
                .toList()),
        SliverList(
            delegate: SliverChildBuilderDelegate(
                (ctx, index) => ListTile(title: Text('Search result #$index')),
                childCount: 500))
      ],
    );
  }
}
