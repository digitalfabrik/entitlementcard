import 'package:flutter/material.dart';

import 'app_flow.dart';

class AppFlowsStack extends StatelessWidget {
  final int currentIndex;
  final List<AppFlow> appFlows;

  const AppFlowsStack(
      {Key? key,
      required this.currentIndex,
      required this.appFlows})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        final currentState = appFlows[currentIndex].navigatorKey.currentState;
        final currentStatePopped = await currentState?.maybePop() ?? false;
        return !currentStatePopped;
      },
      child: IndexedStack(
        index: currentIndex,
        children: _buildChildren(),
      ),
    );
  }

  List<Widget> _buildChildren() {
    return appFlows
        .asMap()
        .map((index, appFlow) => MapEntry(
            index, _buildChildForAppFlow(appFlow, index == currentIndex)))
        .values
        .toList(growable: false);
  }

  Widget _buildChildForAppFlow(AppFlow appFlow, bool isCurrentAppFlow) {
    return Focus(
        key: ValueKey(appFlow),
        child: _buildNavigatorForAppFlow(appFlow),
        descendantsAreFocusable: isCurrentAppFlow);
  }

  Widget _buildNavigatorForAppFlow(AppFlow appFlow) {
    return Navigator(
      key: appFlow.navigatorKey,
      onGenerateRoute: (settings) => MaterialPageRoute(
          settings: settings, builder: (context) => appFlow.widget),
    );
  }
}
