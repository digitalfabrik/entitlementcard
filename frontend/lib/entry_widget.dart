import 'package:flutter/material.dart';

import 'configuration.dart';
import 'configuration/first_start.dart';
import 'home/home_page.dart';
import 'intro_slides/intro_screen.dart';

class EntryWidget extends StatelessWidget {
  final theme = ThemeData.from(
      colorScheme:
          ColorScheme.light(primary: Colors.blue, secondary: Colors.blue),
      textTheme: TextTheme(
        headline6: TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold),
        bodyText1: TextStyle(fontSize: 15.0, fontWeight: FontWeight.normal),
        bodyText2: TextStyle(fontSize: 15.0, color: Color(0xFF505050)),
      ));

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
        future: isFirstStart(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.none ||
              snapshot.connectionState == ConnectionState.waiting) {
            return Container();
          }
          final routes = <String, WidgetBuilder>{};
          String initialRoute;
          if (!snapshot.hasError && snapshot.hasData && snapshot.data) {
            routes.addAll(<String, WidgetBuilder>{
              '/intro': (context) => IntroScreen(),
            });
            initialRoute = '/intro';
          }
          return MaterialApp(
              title: 'Ehrenamtskarte',
              theme: theme,
              initialRoute: initialRoute,
              home: HomePage(
                showVerification: Configuration.of(context).showVerification,
              ),
              routes: routes);
        });
  }
}
