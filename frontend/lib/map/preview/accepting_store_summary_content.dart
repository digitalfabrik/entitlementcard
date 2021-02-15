import 'package:flutter/material.dart';

import 'models.dart';

class AcceptingStoreSummaryContent extends StatelessWidget {
  final AcceptingStoreSummary acceptingStore;

  AcceptingStoreSummaryContent(this.acceptingStore, {Key key})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: _space(8, [
        Text(acceptingStore.name ?? "Akzeptanzstelle",
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(fontWeight: FontWeight.w500, fontSize: 16)),
        if (acceptingStore.description != null)
          Text(
            acceptingStore.description,
            maxLines: 4,
            overflow: TextOverflow.ellipsis,
          )
      ]),
    );
  }

  List<Widget> _space(double gap, Iterable<Widget> children) => children
      .expand((item) sync* {
        yield SizedBox(height: gap);
        yield item;
      })
      .skip(1)
      .toList();
}
