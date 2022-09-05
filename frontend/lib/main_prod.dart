import 'package:ehrenamtskarte/app.dart';
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:flutter/material.dart';

Future<void> main() async {
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
