import 'package:flutter/material.dart';

import '../about/about_page.dart';
import '../identification/identification_page.dart';
import '../map/map_page.dart';
import '../search/search_page.dart';
import 'app_flow.dart';
import 'app_flows_stack.dart';
import 'floating_action_map_bar.dart';

const mapTabIndex = 0;

class AppBarParams {
  PreferredSizeWidget? Function() builder;

  AppBarParams(this.builder);

  AppBarParams.none() : builder = (() => null);

  static AppBarParams fromTitle(String title) {
    return AppBarParams(
        () => AppBar(leading: const BackButton(), title: Text(title)));
  }

  static AppBarParams fromBuilder(PreferredSizeWidget? Function() builder) {
    return AppBarParams(builder);
  }

  static AppBarParams? fromRouteSettings(RouteSettings? settings) {
    return (settings?.arguments as Map<String, dynamic>?)?["appBarParams"]
        as AppBarParams?;
  }

  toRouteSettings() {
    return RouteSettings(arguments: {"appBarParams": this});
  }

  PreferredSizeWidget? build() {
    return builder();
  }
}

class ScaffoldRouteObserver extends NavigatorObserver {
  final void Function(AppBarParams) setAppBarParams;

  ScaffoldRouteObserver({required this.setAppBarParams});

  @override
  void didPush(Route<dynamic>? route, Route<dynamic>? previousRoute) {
    var appBarParams = AppBarParams.fromRouteSettings(route?.settings);
    if (appBarParams != null) {
      setAppBarParams(appBarParams);
    }
  }

  @override
  void didReplace({Route<dynamic>? newRoute, Route<dynamic>? oldRoute}) {
    var appBarParams = AppBarParams.fromRouteSettings(newRoute?.settings);
    setAppBarParams(appBarParams ?? AppBarParams.none());
  }

  @override
  void didPop(Route<dynamic>? route, Route<dynamic>? previousRoute) {
    var appBarParams = AppBarParams.fromRouteSettings(previousRoute?.settings);
    setAppBarParams(appBarParams ?? AppBarParams.none());
  }

  @override
  NavigatorState? get navigator {
    return null;
  }
}

class HomePage extends StatefulWidget {
  final bool showVerification;

  const HomePage({Key? key, required this.showVerification}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentTabIndex = 0;
  late List<AppFlow> appFlows;

  MapPageController? mapPageController;
  int? selectedAcceptingStoreId;
  AppBarParams appBarParams = AppBarParams.none();

  @override
  void initState() {
    super.initState();
    appFlows = [
      AppFlow(
          MapPage(
            onMapCreated: (controller) =>
                setState(() => mapPageController = controller),
            selectAcceptingStore: (id) =>
                setState(() => selectedAcceptingStoreId = id),
          ),
          Icons.map_outlined,
          "Karte",
          GlobalKey<NavigatorState>(debugLabel: "Map tab key")),
      AppFlow(const SearchPage(), Icons.search_outlined, "Suche",
          GlobalKey<NavigatorState>(debugLabel: "Search tab key")),
      if (widget.showVerification)
        AppFlow(
            const IdentificationPage(title: "Ausweisen"),
            Icons.remove_red_eye_outlined,
            "Ausweisen",
            GlobalKey<NavigatorState>(debugLabel: "Auth tab key")),
      AppFlow(const AboutPage(), Icons.info_outline, "Über",
          GlobalKey<NavigatorState>(debugLabel: "About tab key")),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return HomePageData(
      navigateToMapTab: _navigateToMapTab,
      child: Scaffold(
        appBar: appBarParams.build(),
        body: AppFlowsStack(
          appFlows: appFlows,
          currentIndex: _currentTabIndex,
          observer: ScaffoldRouteObserver(
            setAppBarParams: (_appBarParams) {
              // WidgetsBinding.instance!.addPostFrameCallback((_) {
              setState(() {
                appBarParams = _appBarParams;
              });
              //  });
            },
          ),
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
        floatingActionButton: _currentTabIndex == mapTabIndex
            ? FloatingActionMapBar(
                bringCameraToUser: (position) async {
                  await mapPageController?.bringCameraToUser(position);
                },
                selectedAcceptingStoreId: selectedAcceptingStoreId,
              )
            : null,
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

  Future<void> _navigateToMapTab(
      PhysicalStoreFeatureData idWithCoordinates) async {
    setState(() {
      _currentTabIndex = mapTabIndex;
    });

    await mapPageController?.showAcceptingStore(idWithCoordinates);
  }
}

class HomePageData extends InheritedWidget {
  final Future<void> Function(PhysicalStoreFeatureData) navigateToMapTab;

  const HomePageData(
      {Key? key, required this.navigateToMapTab, required Widget child})
      : super(key: key, child: child);

  static HomePageData? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<HomePageData>();
  }

  @override
  bool updateShouldNotify(HomePageData oldWidget) {
    return oldWidget.navigateToMapTab != navigateToMapTab;
  }
}
