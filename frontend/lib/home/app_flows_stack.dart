import 'package:ehrenamtskarte/home/app_flow.dart';
import 'package:ehrenamtskarte/routing.dart';
import 'package:flutter/material.dart';

class AppFlowsStack extends StatelessWidget {
  final int currentIndex;
  final List<AppFlow> appFlows;

  const AppFlowsStack({super.key, required this.currentIndex, required this.appFlows});

  @override
  Widget build(BuildContext context) {
    return IndexedStack(index: currentIndex, children: _buildChildren());
  }

  List<Widget> _buildChildren() {
    return appFlows
        .asMap()
        .map((index, appFlow) => MapEntry(index, _buildChildForAppFlow(appFlow, index == currentIndex)))
        .values
        .toList(growable: false);
  }

  Widget _buildChildForAppFlow(AppFlow appFlow, bool isCurrentAppFlow) {
    return Focus(
      key: ValueKey(appFlow),
      descendantsAreFocusable: isCurrentAppFlow,
      child: _buildNavigatorForAppFlow(appFlow),
    );
  }

  Widget _buildNavigatorForAppFlow(AppFlow appFlow) {
    return Navigator(
      key: appFlow.navigatorKey,
      onGenerateRoute: (settings) => AppRoute(settings: settings, builder: (context) => appFlow.widget),
    );
  }
}
