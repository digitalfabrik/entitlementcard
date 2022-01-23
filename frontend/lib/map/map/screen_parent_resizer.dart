import 'dart:math';
import 'package:flutter/material.dart';

/// A widget which resizes the child widget twice when the orientation changes.
///
/// * Firstly, the child is resized to
///   `width = height = max(screenWidth, screenHeight)`. This creates a square.
/// * Secondly, the child is resized to
///   `width = parentWidth, height = parentHeight. This sizes the child according to the parent constraints.
class ScreenParentResizer extends StatefulWidget {
  final Widget? child;

  const ScreenParentResizer({
    Key? key,
    required Widget this.child,
  }) : super(key: key);

  @override
  State createState() => _ScreenParentResizer();
}

class _ScreenParentResizer extends State<ScreenParentResizer> {
  Orientation? _lastBuildOrientation;

  @override
  Widget build(BuildContext context) {
    final maximum = max(
      MediaQuery.of(context).size.width,
      MediaQuery.of(context).size.height,
    );

    final currentOrientation = MediaQuery.of(context).orientation;
    final isOverDrawingSquare = currentOrientation != _lastBuildOrientation;

    if (isOverDrawingSquare) {
      WidgetsBinding.instance!.addPostFrameCallback(
        (_) => setState(() {
          _lastBuildOrientation = currentOrientation;
        }),
      );
    }

    final width = isOverDrawingSquare ? maximum : null;
    final height = isOverDrawingSquare ? maximum : null;

    return OverflowBox(
      alignment: Alignment.topLeft,
      maxHeight: height,
      maxWidth: width,
      child: widget.child,
    );
  }
}
