import 'package:ehrenamtskarte/about/about_page.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/home/app_flow.dart';
import 'package:ehrenamtskarte/home/app_flows_stack.dart';
import 'package:ehrenamtskarte/home/home_navigation_bar.dart';
import 'package:ehrenamtskarte/identification/identification_page.dart';
import 'package:ehrenamtskarte/favorites/favorites_page.dart';
import 'package:ehrenamtskarte/map/floating_action_map_bar.dart';
import 'package:ehrenamtskarte/map/map_page.dart';
import 'package:ehrenamtskarte/search/search_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

enum HomeTab { search, map, favorites, identification, about }

List<HomeTab> get homeTabs => [
  HomeTab.search,
  HomeTab.map,
  if (buildConfig.featureFlags.favorites) HomeTab.favorites,
  HomeTab.identification,
  HomeTab.about,
];

int get mapTabIndex => homeTabs.indexOf(HomeTab.map);
int get identityTabIndex => homeTabs.indexOf(HomeTab.identification);

class HomePage extends StatefulWidget {
  final int? initialTabIndex;
  final int? initialCardIndex;

  const HomePage({super.key, this.initialTabIndex, this.initialCardIndex});

  @override
  HomePageState createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  late List<AppFlow> appFlows;
  late int _currentTabIndex;

  MapPageController? mapPageController;
  int? selectedPhysicalStoreId;
  bool followUserLocation = true;

  @override
  void initState() {
    super.initState();
    _currentTabIndex = widget.initialTabIndex ?? 0;
    appFlows = homeTabs.map(_createAppFlow).toList();
  }

  AppFlow _createAppFlow(HomeTab tab) {
    return switch (tab) {
      HomeTab.search => AppFlow(
        SearchPage(),
        // Material Icons has no filled search icon, so a custom SVG colored by the surrounding IconTheme is used
        Builder(
          builder: (context) {
            final iconTheme = IconTheme.of(context);
            return SvgPicture.asset(
              'assets/icons/search_filled.svg',
              width: iconTheme.size,
              colorFilter: ColorFilter.mode(iconTheme.color!, BlendMode.srcIn),
            );
          },
        ),
        (BuildContext context) => t.search.title,
        GlobalKey<NavigatorState>(debugLabel: 'Search tab key'),
      ),
      HomeTab.map => AppFlow(
        MapPage(
          onMapCreated: (controller) => setState(() => mapPageController = controller),
          selectAcceptingStore: (id) => setState(() => selectedPhysicalStoreId = id),
          setFollowUserLocation: (follow) => setState(() => followUserLocation = follow),
        ),
        const Icon(Icons.map_outlined),
        (BuildContext context) => t.map.title,
        GlobalKey<NavigatorState>(debugLabel: 'Map tab key'),
      ),
      HomeTab.favorites => AppFlow(
        const FavoritesPage(),
        const Icon(Icons.favorite_border),
        (BuildContext context) => t.favorites.title,
        GlobalKey<NavigatorState>(debugLabel: 'Favorites tab key'),
      ),
      HomeTab.identification => AppFlow(
        IdentificationPage(initialCardIndex: widget.initialCardIndex),
        const Icon(Icons.credit_card_outlined),
        (BuildContext context) => t.identification.title,
        GlobalKey<NavigatorState>(debugLabel: 'Auth tab key'),
      ),
      HomeTab.about => AppFlow(
        const AboutPage(),
        // Projects with multiple languages show a menu icon, as the page also contains the language selection
        Icon(buildConfig.appLocales.length > 1 ? Icons.menu : Icons.info_outline),
        (BuildContext context) => t.about.title,
        GlobalKey<NavigatorState>(debugLabel: 'About tab key'),
      ),
    };
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
      floatingActionButton: _currentTabIndex == mapTabIndex
          ? FloatingActionMapBar(
              bringCameraToUser: (position) async {
                await mapPageController?.bringCameraToUser(position);
                if (!mounted) return;
                setState(() => followUserLocation = true);
              },
              selectedPhysicalStoreId: selectedPhysicalStoreId,
              followUserLocation: followUserLocation,
            )
          : const SizedBox.shrink(),
      bottomNavigationBar: HomeNavigationBar(appFlows: appFlows, currentIndex: _currentTabIndex, onTap: _onTabTapped),
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
