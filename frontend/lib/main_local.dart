import 'package:flutter/material.dart';

import 'app.dart';
import 'configuration.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(Configuration(
      mapStyleUrl: "http://localhost:5002/style.json",
      graphqlStoresUrl: "http://localhost:7000/stores",
      graphqlVerificationUrl: "http://localhost:7000/verification",
      child: App()));
}
