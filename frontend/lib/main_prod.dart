import 'package:flutter/material.dart';

import 'app.dart';
import 'configuration.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(Configuration(
      mapStyleUrl: "https://vector.ehrenamtskarte.app/style.json",
      graphqlStoresUrl: "https://api.ehrenamtskarte.app/stores",
      graphqlVerificationUrl: "https://api.ehrenamtskarte.app/verification",
      child: App()));
}
