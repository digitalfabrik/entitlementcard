import 'package:flutter/material.dart';

import 'put_between.dart';

class PaddedTable extends StatelessWidget {
  final Iterable<TableRow> children;
  final double verticalPadding;
  final double horizontalPadding;

  PaddedTable({Key key, this.children, this.verticalPadding,
    this.horizontalPadding}) : super(key: key);

  Iterable<TableRow> get paddedChildren => children
    .map((row) => TableRow(
      key: row.key,
      decoration: row.decoration,
      children: row.children.putBetween((_) =>
          SizedBox(width: horizontalPadding)).toList(growable: false)
    ))
    .putBetween((elementAfter) => TableRow(
      children: elementAfter.children.map((e) =>
          SizedBox(height: verticalPadding)).toList(growable: false)
    ))
    .toList(growable: false);

  @override
  Widget build(BuildContext context) =>
      Table(
        defaultColumnWidth: IntrinsicColumnWidth(),
        children: paddedChildren,
      );

}
