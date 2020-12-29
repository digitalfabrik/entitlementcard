import 'package:flutter/material.dart';
import 'home/home_page.dart';

import 'graphql/configured_graphql_provider.dart';

class App extends StatelessWidget {
  const App({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = ThemeData(
        primarySwatch: Colors.blue,
        brightness: Brightness.light,
        visualDensity: VisualDensity.adaptivePlatformDensity,
        textTheme: TextTheme(
          headline6: TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold),
          bodyText1: TextStyle(fontSize: 15.0, fontWeight: FontWeight.normal),
          bodyText2: TextStyle(fontSize: 15.0, color: Color(0xFF505050)),
        ));
    return ConfiguredGraphQlProvider(
        child: MaterialApp(
      title: 'Ehrenamtskarte',
      theme: theme,
      home: HomePage(),
    ));
  }
}
