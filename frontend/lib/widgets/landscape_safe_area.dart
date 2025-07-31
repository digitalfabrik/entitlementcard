import 'package:flutter/material.dart';

class LandscapeSafeArea extends StatelessWidget {
  final Widget child;

  const LandscapeSafeArea({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    bool isLandscapeMode = MediaQuery.of(context).orientation == Orientation.landscape;
    if (isLandscapeMode == false) {
      return child;
    }
    return SafeArea(child: child);
  }
}
