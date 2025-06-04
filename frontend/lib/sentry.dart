import 'package:flutter/cupertino.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

Future<void> runAppWithSentry(void Function() runApp) async {
  await SentryFlutter.init((options) {
    options.dsn = 'https://ceb1e25ecc334e26b1469a0bc325b7c9@sentry.tuerantuer.org/4';
    // https://docs.sentry.io/concepts/key-terms/tracing/
    options.tracesSampleRate = 0.05;
  }, appRunner: runApp);
}

Future<void> reportError(dynamic exception, dynamic stackTrace) async {
  _printError(exception, stackTrace);
  if (Sentry.isEnabled) {
    await Sentry.captureException(exception, stackTrace: stackTrace);
  }
}

void _printError(dynamic exception, dynamic stackTrace) async {
  if (stackTrace is StackTrace) {
    debugPrintStack(stackTrace: stackTrace, label: exception.toString());
  } else {
    debugPrint(exception.toString());
  }
}
