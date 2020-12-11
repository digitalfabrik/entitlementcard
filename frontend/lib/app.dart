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
            visualDensity: VisualDensity.adaptivePlatformDensity,
            textTheme: TextTheme(
              headline6: TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold),
              bodyText1:
              TextStyle(fontSize: 15.0, fontWeight: FontWeight.normal),
              bodyText2: TextStyle(fontSize: 15.0, color: Color(0xFF505050)),
            )),
        home: HomePage(title: "Digitale Ehrenamtskarte"));
  }
}
