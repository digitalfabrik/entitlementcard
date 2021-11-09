import 'package:flutter/material.dart';

import '../about/about_page.dart';
import '../identification/identification_page.dart';
import '../map/map_page.dart';
import '../search/search_page.dart';
import 'app_flow.dart';
import 'app_flows_stack.dart';

class HomePage extends StatefulWidget {
  final bool showVerification;

  const HomePage({Key? key, required this.showVerification}) : super(key: key);

  static _HomePageData? of(BuildContext context) {
    return _HomePageData.of(context);
  }

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentTabIndex = 0;
  MapPageController? mapPageController;

  late MapPage mapPage;
  late List<AppFlow> appFlows;

  @override
  void initState() {
    super.initState();
    mapPage = MapPage(
      onMapCreated: (controller) =>
          setState(() => mapPageController = controller),
    );
    appFlows = [
      AppFlow(mapPage, Icons.map_outlined, "Karte",
          GlobalKey<NavigatorState>(debugLabel: "Map tab key")),
      AppFlow(const SearchPage(), Icons.search_outlined, "Suche",
          GlobalKey<NavigatorState>(debugLabel: "Search tab key")),
      if (widget.showVerification)
        AppFlow(const IdentificationPage(title: "Ausweisen"), Icons.remove_red_eye_outlined,
            "Ausweisen", GlobalKey<NavigatorState>(debugLabel: "Auth tab key")),
      AppFlow(const AboutPage(), Icons.info_outline, "Über",
          GlobalKey<NavigatorState>(debugLabel: "About tab key")),
    ];
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
            ?.popUntil((route) => route.isFirst);
      }
    });
  }

  void _goToMap([PhysicalStoreFeatureData? idWithCoordinates]) {
    var currentMapPageController = mapPageController;
    
    if (currentMapPageController == null) {
      return;
    }
    
    setState(() {
      _currentTabIndex = 0;
    });
    if (idWithCoordinates != null) {
      currentMapPageController.showAcceptingStore(idWithCoordinates);
    }
  }
}

class _HomePageData extends InheritedWidget {
  final Function goToMap;

  const _HomePageData({Key? key, required this.goToMap, required Widget child})
      : super(key: key, child: child);

  static _HomePageData? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<_HomePageData>();
  }

  @override
  bool updateShouldNotify(_HomePageData oldWidget) {
    return oldWidget.goToMap != goToMap;
  }
}
