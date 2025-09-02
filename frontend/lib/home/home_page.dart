import 'package:ehrenamtskarte/about/about_page.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/home/app_flow.dart';
import 'package:ehrenamtskarte/home/app_flows_stack.dart';
import 'package:ehrenamtskarte/identification/identification_page.dart';
import 'package:ehrenamtskarte/favorites/favorites_page.dart';
import 'package:ehrenamtskarte/map/floating_action_map_bar.dart';
import 'package:ehrenamtskarte/map/map_page.dart';
import 'package:ehrenamtskarte/search/search_page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

const mapTabIndex = 0;
const identityTabIndex = 2;

class HomePage extends StatefulWidget {
  final int? initialTabIndex;
  final int? initialCardIndex;

  const HomePage({super.key, this.initialTabIndex, this.initialCardIndex});

  @override
  HomePageState createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  late List<AppFlow> appFlows;
  int _currentTabIndex = mapTabIndex;

  MapPageController? mapPageController;
  int? selectedPhysicalStoreId;
  bool followUserLocation = true;

  @override
  void initState() {
    super.initState();
    _currentTabIndex = widget.initialTabIndex ?? mapTabIndex;
    appFlows = [
      AppFlow(
        MapPage(
          onMapCreated: (controller) => setState(() => mapPageController = controller),
          selectAcceptingStore: (id) => setState(() => selectedPhysicalStoreId = id),
          setFollowUserLocation: (follow) => setState(() => followUserLocation = follow),
        ),
        Icons.map_outlined,
        (BuildContext context) => t.map.title,
        GlobalKey<NavigatorState>(debugLabel: 'Map tab key'),
      ),
      AppFlow(
        SearchPage(),
        Icons.search_outlined,
        (BuildContext context) => t.search.title,
        GlobalKey<NavigatorState>(debugLabel: 'Search tab key'),
      ),
      if (buildConfig.featureFlags.favorites)
        AppFlow(
          const FavoritesPage(),
          Icons.favorite_border_outlined,
          (BuildContext context) => t.favorites.title,
          GlobalKey<NavigatorState>(debugLabel: 'Favorites tab key'),
        ),
      if (buildConfig.featureFlags.verification)
        AppFlow(
          IdentificationPage(initialCardIndex: widget.initialCardIndex),
          Icons.credit_card,
          (BuildContext context) => t.identification.title,
          GlobalKey<NavigatorState>(debugLabel: 'Auth tab key'),
        ),
      AppFlow(
        const AboutPage(),
        buildConfig.appLocales.length > 1 ? Icons.menu : Icons.info_outline,
        (BuildContext context) => t.about.title,
        GlobalKey<NavigatorState>(debugLabel: 'About tab key'),
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsModel>(context);

    return HomePageData(
      navigateToMapTab: _navigateToMapTab,
      child: settings.enableStaging
          ? Banner(
              message: 'Testing',
              location: BannerLocation.topEnd,
              color: Colors.red,
              child: _buildScaffold(context),
            )
          : _buildScaffold(context),
    );
  }

  Widget _buildScaffold(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      body: AppFlowsStack(appFlows: appFlows, currentIndex: _currentTabIndex),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      floatingActionButton: FloatingActionMapBar(
        bringCameraToUser: (position) async {
          await mapPageController?.bringCameraToUser(position);
          if (!mounted) return;
          setState(() => followUserLocation = true);
        },
        selectedPhysicalStoreId: selectedPhysicalStoreId,
        followUserLocation: followUserLocation,
        currentTabIndex: _currentTabIndex,
      ),
      bottomNavigationBar: _buildBottomNavigationBar(context),
    );
  }

  Widget _buildBottomNavigationBar(BuildContext context) {
    final theme = Theme.of(context);
    return BottomNavigationBar(
      currentIndex: _currentTabIndex,
      backgroundColor: theme.colorScheme.surfaceContainerHighest,
      items: appFlows
          .map((appFlow) => BottomNavigationBarItem(icon: Icon(appFlow.iconData), label: appFlow.getTitle(context)))
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
