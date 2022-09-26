import 'package:ehrenamtskarte/app.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/configuration/definitions.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  debugPrint("Environment: $appEnvironment");

  final mapDataHost = isProduction()
      ? buildConfig.mapDataHost.production
      : isLocal()
          ? buildConfig.mapDataHost.local
          : buildConfig.mapDataHost.showcase;

  final graphqlUrl = isProduction()
      ? buildConfig.backendUrl.production
      : isLocal()
          ? buildConfig.backendUrl.local
          : buildConfig.backendUrl.showcase;

  final projectId = isProduction()
      ? buildConfig.projectId.production
      : isLocal()
          ? buildConfig.projectId.local
          : buildConfig.projectId.showcase;

  runApp(
    Configuration(
      mapStyleUrl: "https://maps.tuerantuer.org/styles/ehrenamtskarte/style.json?tiles=$mapDataHost",
      graphqlUrl: graphqlUrl,
      projectId: projectId,
      showVerification: buildConfig.featureFlags.verification,
      showDevSettings: kDebugMode,
      child: const App(),
    ),
  );
}
