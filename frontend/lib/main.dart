import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  var client = ValueNotifier(
    GraphQLClient(
      cache: InMemoryCache(),
      link: Link.from([
        HttpLink(
          uri: 'http://10.0.2.2:7000',
        )
      ]),
    ),
  );
  runApp(GraphQLProvider(child: CacheProvider(child: App()), client: client));
}
