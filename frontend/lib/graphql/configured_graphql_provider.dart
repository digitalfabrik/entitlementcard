import 'package:flutter/widgets.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import '../configuration/configuration.dart';

class ConfiguredGraphQlProvider extends StatelessWidget {
  final Widget child;

  const ConfiguredGraphQlProvider({Key? key, required this.child}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final client = ValueNotifier(
      GraphQLClient(
        cache: GraphQLCache(),
        link: Link.from([
          ErrorLink(
            onException: (Request request, NextLink forward, LinkException exception) {
              debugPrint(exception.toString());
            },
            onGraphQLError: (Request request, NextLink forward, Response response) {
              debugPrint(response.errors.toString());
            },
          ),
          HttpLink(Configuration.of(context).graphqlUrl)
        ]),
      ),
    );
    return GraphQLProvider(
      client: client,
      child: CacheProvider(
        child: child,
      ),
    );
  }
}
