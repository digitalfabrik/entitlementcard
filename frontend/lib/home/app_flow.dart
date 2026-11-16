import 'package:flutter/material.dart';

class AppFlow {
  final Widget widget;
  final Widget icon;
  final String Function(BuildContext) getTitle;
  final GlobalKey<NavigatorState> navigatorKey;
  AppFlow(this.widget, this.icon, this.getTitle, this.navigatorKey);
}
