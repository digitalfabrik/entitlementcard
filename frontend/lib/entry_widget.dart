import 'package:flutter/material.dart';

import 'configuration/first_start.dart';
import 'configuration.dart';
import 'home/home_page.dart';
import 'intro_slides/intro_screen.dart';
import 'themes.dart';

class EntryWidget extends StatelessWidget {
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
              '/intro': (context) => IntroScreen(
                    onFinishedCallback: setFirstStart,
                  ),
            });
            initialRoute = '/intro';
          }
          return MaterialApp(
              title: 'Ehrenamtskarte',
              theme: lightTheme,
              darkTheme: darkTheme,
              themeMode: ThemeMode.system,
              initialRoute: initialRoute,
              home: HomePage(
                showVerification: Configuration.of(context).showVerification,
              ),
              routes: routes);
        });
  }
}
