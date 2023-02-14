import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class ConfiguredGraphQlProvider extends StatelessWidget {
  final Widget child;

  const ConfiguredGraphQlProvider({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    final client = ValueNotifier(
      GraphQLClient(
        cache: GraphQLCache(),
        link: Link.from([
          ErrorLink(
            onException: (Request request, NextLink forward, LinkException exception) {
              _printDebugMessage(context, exception.toString());
              return null;
            },
            onGraphQLError: (Request request, NextLink forward, Response response) {
              _printDebugMessage(context, response.errors.toString());
              return null;
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

  void _printDebugMessage(BuildContext context, String message) {
    debugPrint(message);
    if (kDebugMode) {
      final messengerState = ScaffoldMessenger.of(context);
      messengerState.showSnackBar(
        SnackBar(
          behavior: SnackBarBehavior.floating,
          content: Text("GraphQL Error: $message"),
        ),
      );
    }
  }
}
