import 'package:flutter/material.dart';

import '../map/map_page.dart';

class HomePage extends StatefulWidget {
  HomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentTabIndex = 0;

  List<Widget> _tabs = <Widget>[
    MapPage(),
    Container(),
    Container(),
  ];

  void _onTabTapped(int index) {
    setState(() {
      _currentTabIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _tabs.elementAt(_currentTabIndex),
      bottomNavigationBar: BottomNavigationBar(
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.map), label: "Karte"),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: "Suche"),
          BottomNavigationBarItem(
              icon: Icon(Icons.card_giftcard), label: "Ausweisen"),
        ],
        currentIndex: _currentTabIndex,
        onTap: _onTabTapped,
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}
