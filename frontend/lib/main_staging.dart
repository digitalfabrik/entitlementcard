import 'package:flutter/material.dart';

import 'app.dart';
import 'configuration.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(Configuration(
      mapStyleUrl: "https://tiles.staging.ehrenamtskarte.app/style.json",
      graphqlUrl: "https://api.staging.ehrenamtskarte.app",
      child: App()));
}
