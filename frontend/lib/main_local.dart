import 'package:flutter/material.dart';

import 'app.dart';
import 'configuration/configuration.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const Configuration(
      mapStyleUrl: "https://maps.tuerantuer.org/styles/ehrenamtskarte/style.json?tiles=http://localhost:5002",
      graphqlUrl: "http://localhost:7000",
      showVerification: true,
      showDevSettings: true,
      child: App(),
    ),
  );
}
