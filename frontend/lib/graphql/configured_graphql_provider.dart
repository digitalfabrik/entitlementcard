import 'dart:io';

import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/sentry.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:package_info_plus/package_info_plus.dart';

class ConfiguredGraphQlProvider extends StatefulWidget {
  final Widget child;

  const ConfiguredGraphQlProvider({super.key, required this.child});

  @override
  State<StatefulWidget> createState() => ConfiguredGraphQlProviderState();
}

class ConfiguredGraphQlProviderState extends State<ConfiguredGraphQlProvider> {
  String _userAgent = '';

  @override
  void initState() {
    super.initState();
    _initUserAgent();
  }

  Future<void> _initUserAgent() async {
    PackageInfo packageInfo = await PackageInfo.fromPlatform();
    final productString = '${packageInfo.packageName}/${packageInfo.version} (${packageInfo.buildNumber})';

    DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
    var deviceString = '';
    if (Platform.isAndroid) {
      final androidInfo = await deviceInfo.androidInfo;
      deviceString = 'Android/${androidInfo.version.sdkInt} ${androidInfo.brand} ${androidInfo.model}';
    }
    if (Platform.isIOS) {
      final iosInfo = await deviceInfo.iosInfo;
      deviceString = 'iOS/${iosInfo.systemVersion} Apple ${iosInfo.model}';
    }

    if (!mounted) return;

    setState(() => _userAgent = '$productString $deviceString');
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
          HttpLink(Configuration.of(context).graphqlUrl, defaultHeaders: {HttpHeaders.userAgentHeader: _userAgent})
        ]),
      ),
    );
    return GraphQLProvider(client: client, child: widget.child);
  }

  void _printDebugMessage(BuildContext context, String message) {
    debugPrint(message);
    if (kDebugMode) {
      final messengerState = ScaffoldMessenger.of(context);
      messengerState.showSnackBar(
        SnackBar(
          behavior: SnackBarBehavior.floating,
          content: Text('GraphQL Error: $message'),
        ),
      );
    }
  }
}
