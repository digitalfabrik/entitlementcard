import 'dart:io';
import 'package:ehrenamtskarte/app.dart';
import 'package:ehrenamtskarte/configuration/definitions.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/sentry.dart';
import 'package:ehrenamtskarte/settings_provider.dart';
import 'package:ehrenamtskarte/util/android_utils.dart';
import 'package:flutter/material.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // support android version < 7.1.1 by adding a valid certificate - https://stackoverflow.com/questions/69511057
  if (Platform.isAndroid && await certificateIsRequired()) {
    loadCertificate();
  }

  debugPrint('Environment: $appEnvironment');

  void run() {
    return runApp(TranslationProvider(child: SettingsProvider(child: const App())));
  }

  if (isProduction()) {
    runAppWithSentry(run);
  } else {
    run();
  }
}
