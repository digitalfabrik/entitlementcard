import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class GraphQLWrapper extends GraphQLProvider {
  GraphQLWrapper({
    Key key,
    Widget child,
  }) : super(
            key: key,
            child: CacheProvider(
                child: child
            ),
            client: ValueNotifier(
              GraphQLClient(
                cache: InMemoryCache(),
                link: Link.from([
                  HttpLink(
                    uri: 'http://localhost:7000/graphql',
                  )
                ]),
              ),
            ));
}
