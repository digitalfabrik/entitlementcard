import 'package:flutter/material.dart';

import 'app.dart';
import 'configuration/configuration.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(Configuration(
      mapStyleUrl: "http://localhost:5002/style.json",
      graphqlUrl: "http://localhost:7000",
      showVerification: true,
      showDevSettings: true,
      child: App()));
}
