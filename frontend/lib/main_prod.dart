import 'package:ehrenamtskarte/configuration.dart';
import 'package:flutter/material.dart';

import 'app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(Configuration(
      mapStyleUrl: "https://vector.ehrenamtskarte.app/style.json",
      graphqlUrl: "https://api.ehrenamtskarte.app",
      child: App()));
}
