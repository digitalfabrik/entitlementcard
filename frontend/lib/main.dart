import 'package:ehrenamtskarte/app.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/configuration/definitions.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  debugPrint("Environment: $appEnvironment");

  final mapStyleUrl = isProduction()
      ? buildConfig.mapStyleUrl.production
      : isLocal()
          ? buildConfig.mapStyleUrl.local
          : buildConfig.mapStyleUrl.showcase;

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
      mapStyleUrl: mapStyleUrl,
      graphqlUrl: graphqlUrl,
      projectId: projectId,
      showVerification: buildConfig.featureFlags.verification,
      showDevSettings: kDebugMode,
      child: const App(),
    ),
  );
}
