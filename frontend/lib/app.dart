import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'home/home_page.dart';
import 'configuration.dart';

class App extends StatelessWidget {
  const App({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final config = Configuration.of(context);
    final client = ValueNotifier(
      GraphQLClient(
        cache: InMemoryCache(),
        link: Link.from([
          HttpLink(
            uri: config.graphqlUrl,
          )
        ]),
      ),
    );
    final theme = ThemeData(
        primarySwatch: Colors.blue,
        brightness: Brightness.light,
        visualDensity: VisualDensity.adaptivePlatformDensity,
        textTheme: TextTheme(
          headline6: TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold),
          bodyText1:
          TextStyle(fontSize: 15.0, fontWeight: FontWeight.normal),
          bodyText2: TextStyle(fontSize: 15.0, color: Color(0xFF505050)),
        ));
    return GraphQLProvider(
        child: CacheProvider(
            child: MaterialApp(
                title: 'Digitale Ehrenamtskarte',
                theme: theme,
                home: HomePage(title: "Digitale Ehrenamtskarte"))),
        client: client);
  }
}
