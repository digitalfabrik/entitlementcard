import 'package:flutter/material.dart';

import 'app.dart';
import 'configuration/configuration.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const Configuration(
      mapStyleUrl: "https://maps.tuerantuer.org/styles/ehrenamtskarte/style.json?tiles=https://tiles.ehrenamtskarte.app",
      graphqlUrl: "https://api.ehrenamtskarte.app",
      showVerification: false,
      showDevSettings: false,
      child: App()));
}
