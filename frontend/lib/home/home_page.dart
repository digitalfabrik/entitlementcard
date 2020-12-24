import 'package:flutter/material.dart';

import '../map/map_page.dart';
import './app_flow.dart';

class HomePage extends StatefulWidget {
  HomePage({Key key}) : super(key: key);

  static _HomePageData of(BuildContext context) => _HomePageData.of(context);

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
    return _HomePageData(
      goToMap: _goToMap,
      child: WillPopScope(
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

  void _goToMap() {
    setState(() {
      _currentTabIndex = 0;
    });
  }
}

class _HomePageData extends InheritedWidget {
  final Function goToMap;

  _HomePageData({Key key, this.goToMap, Widget child})
      : super(key: key, child: child);

  static _HomePageData of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<_HomePageData>();
  }

  @override
  bool updateShouldNotify(_HomePageData oldWidget) {
    return oldWidget.goToMap != goToMap;
  }
}
