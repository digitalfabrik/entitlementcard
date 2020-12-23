import 'package:flutter/material.dart';

import '../map/map_page.dart';
import '../identification/identification_page.dart';

class HomePage extends StatefulWidget {
  HomePage({Key key}) : super(key: key);

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

  List<_TabData> _tabs = <_TabData>[
    _TabData(MapPage(), Icons.map, "Karte"),
    _TabData(Container(), Icons.search, "Suche"),
    _TabData(IdentificationPage(), Icons.remove_red_eye, "Ausweisen"),
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
        children: _tabs.map((tab) => tab.widget).toList(),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: _tabs
            .map((tabData) => BottomNavigationBarItem(
                icon: Icon(tabData.icon), label: tabData.label))
            .toList(),
        currentIndex: _currentTabIndex,
        onTap: _onTabTapped,
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}
