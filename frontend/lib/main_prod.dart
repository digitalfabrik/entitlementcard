import 'package:ehrenamtskarte/app.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:flutter/material.dart';

Future<void> main() async {
  if (buildConfig.featureFlags.developerFriendly) {
    debugPrint("No developers were harmed while developing this app.");
  } else {
    debugPrint("Developers were harmed while developing this app.");
  }
  
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const Configuration(
      mapStyleUrl:
          "https://maps.tuerantuer.org/styles/ehrenamtskarte/style.json?tiles=https://tiles.ehrenamtskarte.app",
      graphqlUrl: "https://api.ehrenamtskarte.app",
      showVerification: false,
      showDevSettings: false,
      child: App(),
    ),
  );
}
