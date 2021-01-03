import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

class IdCard extends StatelessWidget {
  final Widget child;

  const IdCard({Key key, this.child}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return IntrinsicHeight(
        child: FittedBox(
            child: Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10.0),
                ),
                clipBehavior: Clip.antiAliasWithSaveLayer,
                color: Colors.black26,
                child: child)));
  }
}
