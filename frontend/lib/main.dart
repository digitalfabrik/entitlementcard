import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'repositories/acceping_businesses_repository.dart';
import 'app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  var client = ValueNotifier(
    GraphQLClient(
      cache: InMemoryCache(),
      link: Link.from([
        HttpLink(
          uri: 'http://10.0.2.2:7000/graphql',
        )
      ]),
    ),
  );
  runApp(GraphQLProvider(
      child: CacheProvider(
          child: App(repository: AcceptingBusinessesRepository())),
      client: client));
}
