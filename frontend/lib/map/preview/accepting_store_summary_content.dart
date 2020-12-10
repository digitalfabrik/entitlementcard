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
        Text(acceptingStore.name,
            style: TextStyle(fontWeight: FontWeight.w500, fontSize: 16)),
        Text(acceptingStore.description)
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
