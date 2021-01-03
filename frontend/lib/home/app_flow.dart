import 'package:flutter/material.dart';

class AppFlow {
  final Widget widget;
  final IconData iconData;
  final String title;
  final GlobalKey<NavigatorState> navigatorKey;
  AppFlow(this.widget, this.iconData, this.title, this.navigatorKey);
}
