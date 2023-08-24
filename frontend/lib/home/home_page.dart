import 'package:ehrenamtskarte/about/about_page.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/graphql/configured_graphql_provider.dart';
import 'package:ehrenamtskarte/home/app_flow.dart';
import 'package:ehrenamtskarte/home/app_flows_stack.dart';
import 'package:ehrenamtskarte/identification/identification_page.dart';
import 'package:ehrenamtskarte/map/floating_action_map_bar.dart';
import 'package:ehrenamtskarte/map/map_page.dart';
import 'package:ehrenamtskarte/search/search_page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../util/i18n.dart';

const mapTabIndex = 0;

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  HomePageState createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  int _currentTabIndex = 0;
  late List<AppFlow> appFlows;

  MapPageController? mapPageController;
  int? selectedAcceptingStoreId;

  @override
  void initState() {
    super.initState();
    appFlows = [
      AppFlow(
        MapPage(
          onMapCreated: (controller) => setState(() => mapPageController = controller),
          selectAcceptingStore: (id) => setState(() => selectedAcceptingStoreId = id),
        ),
        Icons.map_outlined,
        t(context, 'card'),
        GlobalKey<NavigatorState>(debugLabel: 'Map tab key'),
      ),
      AppFlow(
        const SearchPage(),
        Icons.search_outlined,
        t(context, 'search'),
        GlobalKey<NavigatorState>(debugLabel: 'Search tab key'),
      ),
      if (buildConfig.featureFlags.verification)
        AppFlow(
          IdentificationPage(),
          Icons.remove_red_eye_outlined,
          t(context, 'identification'),
          GlobalKey<NavigatorState>(debugLabel: 'Auth tab key'),
        ),
      AppFlow(const AboutPage(), Icons.info_outline, t(context, 'about'), GlobalKey<NavigatorState>(debugLabel: 'About tab key')),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsModel>(context);

    return ConfiguredGraphQlProvider(
      child: HomePageData(
        navigateToMapTab: _navigateToMapTab,
        child: settings.enableStaging
            ? Banner(
                message: 'Testing', location: BannerLocation.topEnd, color: Colors.red, child: _buildScaffold(context))
            : _buildScaffold(context),
      ),
    );
  }

  Widget _buildScaffold(BuildContext context) {
    return Scaffold(
      body: AppFlowsStack(appFlows: appFlows, currentIndex: _currentTabIndex),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      floatingActionButton: _currentTabIndex == mapTabIndex
          ? FloatingActionMapBar(
              bringCameraToUser: (position) async {
                await mapPageController?.bringCameraToUser(position);
              },
              selectedAcceptingStoreId: selectedAcceptingStoreId,
            )
          // Returning a Container() instead of null avoids animations
          : Container(),
      bottomNavigationBar: _buildBottomNavigationBar(context),
    );
  }

  Widget _buildBottomNavigationBar(BuildContext context) {
    final theme = Theme.of(context);
    return BottomNavigationBar(
      currentIndex: _currentTabIndex,
      backgroundColor: theme.colorScheme.surfaceVariant,
      items: appFlows
          .map((appFlow) => BottomNavigationBarItem(icon: Icon(appFlow.iconData), label: appFlow.title))
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
        appFlows[_currentTabIndex].navigatorKey.currentState?.popUntil((route) => route.isFirst);
      }
    });
  }

  Future<void> _navigateToMapTab(PhysicalStoreFeatureData idWithCoordinates) async {
    setState(() {
      _currentTabIndex = mapTabIndex;
    });

    await mapPageController?.showAcceptingStore(idWithCoordinates);
  }
}

class HomePageData extends InheritedWidget {
  final Future<void> Function(PhysicalStoreFeatureData) navigateToMapTab;

  const HomePageData({super.key, required this.navigateToMapTab, required super.child});

  static HomePageData? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<HomePageData>();
  }

  @override
  bool updateShouldNotify(HomePageData oldWidget) {
    return oldWidget.navigateToMapTab != navigateToMapTab;
  }
}
