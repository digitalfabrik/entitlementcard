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
        visualDensity: VisualDensity.adaptivePlatformDensity);
    return GraphQLProvider(
        child: CacheProvider(
            child: MaterialApp(
                title: 'Digitale Ehrenamtskarte',
                theme: theme,
                home: HomePage(title: "Digitale Ehrenamtskarte"))),
        client: client);
  }
}
