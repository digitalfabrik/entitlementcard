import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class IdCard extends StatelessWidget {
  final Widget child;

  const IdCard({Key key, this.child}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10.0),
        ),
        clipBehavior: Clip.antiAliasWithSaveLayer,
        color: Colors.black26,
        child: AspectRatio(aspectRatio: 3 / 2, child: child));
  }
}
