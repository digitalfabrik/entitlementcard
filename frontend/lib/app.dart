import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'configuration.dart';
import 'graphql/configured_graphql_provider.dart';
import 'home/home_page.dart';
import 'identification/card_details_model.dart';

class App extends StatelessWidget {
  const App({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = ThemeData.from(
        colorScheme:
            ColorScheme.light(primary: Colors.blue, secondary: Colors.blue),
        // primary: Color(0xff8377A9), secondary: Color(0xff8377A9)
        textTheme: TextTheme(
          headline6: TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold),
          bodyText1: TextStyle(fontSize: 15.0, fontWeight: FontWeight.normal),
          bodyText2: TextStyle(fontSize: 15.0, color: Color(0xFF505050)),
        ));
    var darkTheme = ThemeData.from(
        colorScheme: ColorScheme.dark(
          primary: Color(0xff8377A9),
          secondary: Color(0xff8377A9),
        ),
        textTheme: TextTheme(
          headline6: TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold),
          bodyText1: TextStyle(fontSize: 15.0, fontWeight: FontWeight.normal),
          bodyText2: TextStyle(fontSize: 15.0, color: Color(0xFFC6C4C4)),
        ));
    darkTheme = darkTheme.copyWith(
        appBarTheme: AppBarTheme(color: darkTheme.colorScheme.primary));
    return ConfiguredGraphQlProvider(
      child: MultiProvider(
          providers: [
            ChangeNotifierProvider(
                create: (context) => CardDetailsModel()..initialize()),
          ],
          child: MaterialApp(
            title: 'Ehrenamtskarte',
            theme: theme,
            darkTheme: darkTheme,
            home: HomePage(
              showVerification: Configuration.of(context).showVerification,
            ),
          )),
    );
  }
}
