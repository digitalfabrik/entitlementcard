import 'package:flutter/material.dart';

import '../map/map_page.dart';
import './app_flow.dart';

class HomePage extends StatefulWidget {
  HomePage({Key key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentTabIndex = 0;

  final List<AppFlow> appFlows = <AppFlow>[
    AppFlow(MapPage(), Icons.map, "Karte",
        GlobalKey<NavigatorState>(debugLabel: "Map tab key")),
    AppFlow(Container(), Icons.search, "Suche",
        GlobalKey<NavigatorState>(debugLabel: "Search tab key")),
    AppFlow(Container(), Icons.remove_red_eye, "Ausweisen",
        GlobalKey<NavigatorState>(debugLabel: "Auth tab key")),
  ];

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async =>
          // do not pop if the inner navigator can handle it
          !await appFlows[_currentTabIndex]
              .navigatorKey
              .currentState
              .maybePop(),
      child: Scaffold(
        body: IndexedStack(
          index: _currentTabIndex,
          children: appFlows.map(_buildNavigator).toList(),
        ),
        bottomNavigationBar: this._buildBottomNavigationBar(context),
      ),
    );
  }

  Widget _buildNavigator(AppFlow appFlow) {
    return Navigator(
      key: appFlow.navigatorKey,
      onGenerateRoute: (settings) => MaterialPageRoute(
          settings: settings, builder: (context) => appFlow.widget),
    );
  }

  Widget _buildBottomNavigationBar(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: _currentTabIndex,
      items: appFlows
          .map(
            (appFlow) => BottomNavigationBarItem(
                icon: Icon(appFlow.iconData), label: appFlow.title),
          )
          .toList(),
      onTap: _onTabTapped,
      type: BottomNavigationBarType.fixed,
    );
  }

  void _onTabTapped(int index) {
    setState(() {
      if (_currentTabIndex != index) {
        _currentTabIndex = index;
      } else {
        // if clicking on tab again, reset the tab
        appFlows[_currentTabIndex]
            .navigatorKey
            .currentState
            .popUntil((route) => route.isFirst);
      }
    });
  }
}
