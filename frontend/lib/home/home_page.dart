import 'package:flutter/material.dart';

import '../about/about_page.dart';
import '../identification/identification_view.dart';
import '../map/map_page.dart';
import '../search/search_page.dart';
import 'app_flow.dart';
import 'app_flows_stack.dart';

class HomePage extends StatefulWidget {
  final bool showVerification;

  HomePage({Key key, this.showVerification}) : super(key: key);

  static _HomePageData of(BuildContext context) => _HomePageData.of(context);

  @override
  _HomePageState createState() =>
      _HomePageState(showVerification: showVerification);
}

class _HomePageState extends State<HomePage> {
  int _currentTabIndex = 0;
  MapPageController mapPageController;

  final MapPage mapPage;
  final List<AppFlow> appFlows;

  _HomePageState._(this.mapPage, this.appFlows);

  factory _HomePageState({bool showVerification}) {
    _HomePageState state;
    var mapPage = MapPage(
      onMapCreated: (controller) =>
          state.setState(() => state.mapPageController = controller),
    );
    var appFlows = <AppFlow>[
      AppFlow(mapPage, Icons.map, "Karte",
          GlobalKey<NavigatorState>(debugLabel: "Map tab key")),
      AppFlow(SearchPage(), Icons.search, "Suche",
          GlobalKey<NavigatorState>(debugLabel: "Search tab key")),
      if (showVerification)
        AppFlow(IdentificationPage(), Icons.remove_red_eye, "Ausweisen",
            GlobalKey<NavigatorState>(debugLabel: "Auth tab key")),
      AppFlow(AboutPage(), Icons.more_horiz, "Über",
          GlobalKey<NavigatorState>(debugLabel: "About tab key")),
    ];
    state = _HomePageState._(mapPage, appFlows);
    return state;
  }

  @override
  Widget build(BuildContext context) {
    return _HomePageData(
      goToMap: _goToMap,
      child: Scaffold(
        body: AppFlowsStack(
          appFlows: appFlows,
          currentIndex: _currentTabIndex,
        ),
        bottomNavigationBar: _buildBottomNavigationBar(context),
      ),
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

  void _goToMap([PhysicalStoreFeatureData idWithCoordinates]) {
    setState(() {
      _currentTabIndex = 0;
    });
    if (idWithCoordinates != null) {
      mapPageController.showAcceptingStore(idWithCoordinates);
    }
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
