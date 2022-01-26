import 'dart:math';
import 'package:flutter/material.dart';

/// A widget which resizes the child widget twice when the orientation changes.
///
/// * Firstly, the child put in a container with the following constraints:
///   `width = height = max(screenWidth, screenHeight)`. This creates a square.
/// * Secondly, the child is resized to
///   `width = parentWidth, height = parentHeight. This sizes the child according to the parent constraints. This
///   resize only happens if the child is already initialized. If it is not yet initialized then the resize is delayed.
class ScreenParentResizer extends StatefulWidget {
  final Widget? child;
  final bool childInitialized;

  const ScreenParentResizer({
    Key? key,
    required Widget this.child,
    required this.childInitialized,
  }) : super(key: key);

  @override
  State createState() => _ScreenParentResizer();
}

class _ScreenParentResizer extends State<ScreenParentResizer> {
  Orientation? _lastBuildOrientation;
  Orientation? _initialOrientationUpdate;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    // As soon as the child is initialized we trigger the orientation update
    if (widget.childInitialized) {
      setState(() {
        _lastBuildOrientation = _initialOrientationUpdate;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final maximum = max(
      MediaQuery.of(context).size.width,
      MediaQuery.of(context).size.height,
    );

    final currentOrientation = MediaQuery.of(context).orientation;
    final isOverDrawingSquare = currentOrientation != _lastBuildOrientation;

    if (isOverDrawingSquare) {
      // We only trigger a resize if the child component finished initializing
      if (widget.childInitialized) {
        setState(() {
          _lastBuildOrientation = currentOrientation;
        });
      } else {
        _initialOrientationUpdate = currentOrientation;
      }
    }

    final width = isOverDrawingSquare ? maximum : null;
    final height = isOverDrawingSquare ? maximum : null;

    return OverflowBox(
      alignment: Alignment.topLeft,
      maxHeight: height,
      maxWidth: width,
      minWidth: width,
      minHeight: height,
      child: widget.child,
    );
  }
}
