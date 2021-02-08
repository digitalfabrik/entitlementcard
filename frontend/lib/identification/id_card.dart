import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

class IdCard extends StatelessWidget {
  final Widget child;
  final double height;

  const IdCard({Key key, this.child, this.height}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10.0),
        ),
        clipBehavior: Clip.antiAliasWithSaveLayer,
        color: Colors.black26,
        child: Container(
            height: height,
            child: AspectRatio(aspectRatio: 3 / 2, child: child)));
  }
}
