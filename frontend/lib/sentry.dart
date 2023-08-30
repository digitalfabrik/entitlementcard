import 'package:ehrenamtskarte/settings_provider.dart';
import 'package:flutter/cupertino.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import 'app.dart';

Future<void> runAppWithSentry() async {
  await SentryFlutter.init((options) {
    options.dsn = 'https://ceb1e25ecc334e26b1469a0bc325b7c9@sentry.tuerantuer.org/4';
  }, appRunner: () => runApp(SettingsProvider(child: const App())));
}

Future<void> reportError(dynamic exception, dynamic stackTrace) async {
  await Sentry.captureException(exception, stackTrace: stackTrace);
}
