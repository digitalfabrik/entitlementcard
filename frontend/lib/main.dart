import 'dart:io';
import 'package:ehrenamtskarte/app.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/configuration/definitions.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/sentry.dart';
import 'package:ehrenamtskarte/settings_provider.dart';
import 'package:ehrenamtskarte/util/android_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:slang/overrides.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // support android version < 7.1.1 by adding a valid certificate - https://stackoverflow.com/questions/69511057
  if (Platform.isAndroid && await certificateIsRequired()) {
    loadCertificate();
  }

  // Only use device locale if set as available in build config, otherwise fallback to de
  final locale = Platform.localeName.split('_')[0];
  if (buildConfig.appLocales.contains(locale)) {
    LocaleSettings.useDeviceLocale();
  } else if (buildConfig.appLocales.contains('en')) {
    LocaleSettings.setLocale(AppLocale.en);
  } else {
    LocaleSettings.setLocale(AppLocale.de);
  }

  // Use override locales for whitelabels (e.g. nuernberg)
  // ignore: unnecessary_null_comparison
  if (buildConfig.localeOverridePath != null) {
    await Future.forEach(AppLocale.values, (locale) async {
      await overrideLocale(locale);
    });
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

Future<String?> loadLocaleOverride(AppLocale locale) async {
  final path = '${buildConfig.localeOverridePath}/override_${locale.languageCode}.json';
  try {
    return await rootBundle.loadString(path);
  } on FlutterError catch (e) {
    if (e.message.contains('Unable to load asset')) {
      debugPrint('Locale override not found at path: $path. The default translation will be used');
      return null;
    }
    rethrow;
  }
}

Future<void> overrideLocale(AppLocale locale) async {
  final content = await loadLocaleOverride(locale);
  if (content != null) {
    LocaleSettings.overrideTranslations(locale: locale, fileType: FileType.json, content: content);
  }
}
