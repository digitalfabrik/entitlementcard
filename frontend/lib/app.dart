import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'configuration.dart';
import 'graphql/configured_graphql_provider.dart';
import 'home/home_page.dart';
import 'identification/card_details_model.dart';
import 'themes.dart';

class App extends StatelessWidget {
  const App({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ConfiguredGraphQlProvider(
      child: MultiProvider(
          providers: [
            ChangeNotifierProvider(
                create: (context) => CardDetailsModel()..initialize()),
          ],
          child: MaterialApp(
            title: 'Ehrenamtskarte',
            theme: lightTheme,
            darkTheme: darkTheme,
            themeMode: ThemeMode.system,
            home: HomePage(
              showVerification: Configuration.of(context).showVerification,
            ),
          )),
    );
  }
}
