import 'package:ehrenamtskarte/app.dart';
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:flutter/material.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const Configuration(
      mapStyleUrl: "https://maps.tuerantuer.org/styles/ehrenamtskarte/style.json?tiles=http://localhost:5002",
      graphqlUrl: "http://10.0.2.2:7000",
      projectId: "bayern.ehrenamtskarte.app",
      // TODO: Replace this with the projectId from the build config.
      showVerification: true,
      showDevSettings: true,
      child: App(),
    ),
  );
}
