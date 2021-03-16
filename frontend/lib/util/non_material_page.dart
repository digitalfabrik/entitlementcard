import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class NonMaterialPage extends StatelessWidget {
  final SystemUiOverlayStyle overlayStyle;
  final Widget child;

  const NonMaterialPage({Key key, this.overlayStyle, this.child})
      : super(key: key);

  static SystemUiOverlayStyle getDefaultOverlayStyle(BuildContext context) {
    if (Theme.of(context).brightness == Brightness.dark) {
      return SystemUiOverlayStyle.light;
    } else {
      return SystemUiOverlayStyle.dark;
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
        child: SafeArea(
          child: child,
        ),
        value: overlayStyle ?? getDefaultOverlayStyle(context));
  }
}
