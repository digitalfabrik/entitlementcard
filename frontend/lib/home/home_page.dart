import 'package:ehrenamtskarte/about/about_page.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/graphql/configured_graphql_provider.dart';
import 'package:ehrenamtskarte/home/app_flow.dart';
import 'package:ehrenamtskarte/home/app_flows_stack.dart';
import 'package:ehrenamtskarte/identification/identification_page.dart';
import 'package:ehrenamtskarte/map/floating_action_map_bar.dart';
import 'package:ehrenamtskarte/map/map_page.dart';
import 'package:ehrenamtskarte/search/search_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:provider/provider.dart';

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
        "Karte",
        GlobalKey<NavigatorState>(debugLabel: "Map tab key"),
      ),
      AppFlow(
        const SearchPage(),
        Icons.search_outlined,
        "Suche",
        GlobalKey<NavigatorState>(debugLabel: "Search tab key"),
      ),
      if (buildConfig.featureFlags.verification)
        AppFlow(
          const IdentificationPage(title: "Ausweisen"),
          Icons.remove_red_eye_outlined,
          "Ausweisen",
          GlobalKey<NavigatorState>(debugLabel: "Auth tab key"),
        ),
      AppFlow(const AboutPage(), Icons.info_outline, "Über", GlobalKey<NavigatorState>(debugLabel: "About tab key")),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsModel>(context);
    loadConfigFromSettings();
    return ConfiguredGraphQlProvider(
      child: HomePageData(
        navigateToMapTab: _navigateToMapTab,
        child: settings.staging
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

  // loads config data from settings if they exists and wait until app was build before setting state
  Future<bool> loadConfigFromSettings() async {
    final settings = Provider.of<SettingsModel>(context, listen: false);
    if (settings.graphqlUrl.isEmpty || settings.mapStyleUrl.isEmpty) {
      return false;
    }

    if (!mounted) return false;

    // if there's a current frame,
    if (SchedulerBinding.instance.schedulerPhase != SchedulerPhase.idle) {
      // wait for the end of that frame.
      await SchedulerBinding.instance.endOfFrame;
      if (!mounted) return false;
    }

    final config = Configuration.of(context);
    config.switchEndpoint(settings.graphqlUrl, settings.mapStyleUrl);
    return true;
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
