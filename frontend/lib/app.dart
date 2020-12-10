import 'package:flutter/material.dart';

import 'home/home_page.dart';

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Digitale Ehrenamtskarte',
        theme: ThemeData(
            primarySwatch: Colors.blue,
            brightness: Brightness.light,
            visualDensity: VisualDensity.adaptivePlatformDensity),
        home: HomePage(title: "Digitale Ehrenamtskarte"));
  }
}
