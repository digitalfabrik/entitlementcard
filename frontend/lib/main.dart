import 'package:ehrenamtskarte/app.dart';
import 'package:ehrenamtskarte/configuration/definitions.dart';
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  debugPrint("Environment: $appEnvironment");

  runApp(
    ChangeNotifierProvider(
      create: (context) => SettingsModel()..initialize(),
      child: const App(),
    ),
  );
}
