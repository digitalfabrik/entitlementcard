import 'package:flutter/material.dart';

import '../map/map_page.dart';
import '../search/search_page.dart';

class HomePage extends StatefulWidget {
  HomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _HomePageState createState() => _HomePageState();
}

class _TabData {
  final Widget widget;
  final IconData icon;
  final String label;
  _TabData(this.widget, this.icon, this.label);
}

class _HomePageState extends State<HomePage> {
  int _currentTabIndex = 0;

  List<_TabData> _tabs = [
    _TabData(MapPage(), Icons.map, "Karte"),
    _TabData(SearchPage(), Icons.search, "Suche"),
    _TabData(Container(), Icons.remove_red_eye, "Ausweisen"),
  ];

  void _onTabTapped(int index) {
    setState(() {
      _currentTabIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
          index: _currentTabIndex,
          children: _tabs.asMap()
              .map((index, tab) => MapEntry(
                  index, Focus(
                      key: ValueKey(index),
                      child: tab.widget,
                      descendantsAreFocusable: _currentTabIndex == index)))
              .values.toList(growable: false)),
      bottomNavigationBar: BottomNavigationBar(
          items: _tabs.map((tabData) => BottomNavigationBarItem(
                    icon: Icon(tabData.icon),
                    label: tabData.label
                  )).toList(),
          currentIndex: _currentTabIndex,
          onTap: _onTabTapped,
          type: BottomNavigationBarType.fixed),
    );
  }
}
