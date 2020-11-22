import 'package:ehrenamtskarte/list/accepting_businesses_page.dart';
import 'package:flutter/material.dart';

import '../graphql/graphql_page.dart';
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
    GraphQLTestPage(),
    AcceptingBusinessesPage(),
    AcceptingBusinessesPage()
  ];

  void _onTabTapped(int index) {
    setState(() {
      _currentTabIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: _tabs.elementAt(_currentTabIndex),
      bottomNavigationBar: BottomNavigationBar(
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.map), label: "Karte"),
          BottomNavigationBarItem(icon: Icon(Icons.chat), label: "GraphQL Test"),
          BottomNavigationBarItem(icon: Icon(Icons.chat), label: "Provider Test"),
          BottomNavigationBarItem(icon: Icon(Icons.chat), label: "Provider Test 2")
        ],
        currentIndex: _currentTabIndex,
        onTap: _onTabTapped,
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.blue,
        selectedItemColor: Colors.black54,
        unselectedItemColor: Colors.black,
      ),
    );
  }
}
