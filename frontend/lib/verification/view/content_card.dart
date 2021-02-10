import 'package:flutter/material.dart';

class ContentCard extends StatelessWidget {
  final Color color;
  final BorderSide borderSide;
  final Widget child;

  ContentCard({
    this.child,
    this.color = Colors.white,
    this.borderSide = const BorderSide(width: 1.0, color: Colors.black12),
  });

  @override
  Widget build(BuildContext context) {
    return Card(
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10.0), side: borderSide),
        margin: EdgeInsets.all(8.0),
        elevation: 5.0,
        color: color,
        child: Padding(
          padding: EdgeInsets.all(8.0),
          child: child,
        ));
  }
}
