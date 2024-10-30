import 'dart:io';

import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/sentry.dart';
import 'package:fk_user_agent/fk_user_agent.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class ConfiguredGraphQlProvider extends StatefulWidget {
  final Widget child;

  const ConfiguredGraphQlProvider({super.key, required this.child});

  @override
  State<StatefulWidget> createState() => ConfiguredGraphQlProviderState();
}

class ConfiguredGraphQlProviderState extends State<ConfiguredGraphQlProvider> {
  String _platformVersion = 'Unknown';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) async {
      await FkUserAgent.init();
      initPlatformState();
    });
  }

  // Platform messages are asynchronous, so we initialize in an async method.
  Future<void> initPlatformState() async {
    String platformVersion;
    // Platform messages may fail, so we use a try/catch PlatformException.
    try {
      platformVersion = FkUserAgent.userAgent!;
      print(platformVersion);
    } on PlatformException {
      platformVersion = 'Failed to get platform version.';
    }

    // If the widget was removed from the tree while the asynchronous platform
    // message was in flight, we want to discard the reply rather than calling
    // setState to update our non-existent appearance.
    if (!mounted) return;

    setState(() {
      _platformVersion = platformVersion;
    });
  }

  @override
  Widget build(BuildContext context) {
    final client = ValueNotifier(
      GraphQLClient(
        cache: GraphQLCache(),
        link: Link.from([
          ErrorLink(
            onException: (Request request, NextLink forward, LinkException exception) {
              _printDebugMessage(context, exception.toString());
              reportError(exception, null);
              return null;
            },
            onGraphQLError: (Request request, NextLink forward, Response response) {
              _printDebugMessage(context, response.errors.toString());
              reportError(response.errors.toString(), null);
              return null;
            },
          ),
          HttpLink(Configuration.of(context).graphqlUrl,
              defaultHeaders: {HttpHeaders.userAgentHeader: _platformVersion})
        ]),
      ),
    );
    return GraphQLProvider(client: client, child: widget.child);
  }

  void _printDebugMessage(BuildContext context, String message) {
    final theme = Theme.of(context);
    debugPrint(message);
    if (kDebugMode) {
      final messengerState = ScaffoldMessenger.of(context);
      messengerState.showSnackBar(
        SnackBar(
          backgroundColor: theme.colorScheme.primary,
          behavior: SnackBarBehavior.floating,
          content: Text('GraphQL Error: $message',
              style: theme.textTheme.bodyLarge?.apply(color: theme.colorScheme.background)),
        ),
      );
    }
  }
}
