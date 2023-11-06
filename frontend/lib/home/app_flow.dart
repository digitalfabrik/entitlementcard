import 'package:flutter/material.dart';

class AppFlow {
  final Widget widget;
  final IconData iconData;
  final String Function(BuildContext) getTitle;
  final GlobalKey<NavigatorState> navigatorKey;
  AppFlow(this.widget, this.iconData, this.getTitle, this.navigatorKey);
}
