import 'dart:io';
import 'package:ehrenamtskarte/app.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/configuration/definitions.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/sentry.dart';
import 'package:ehrenamtskarte/settings_provider.dart';
import 'package:ehrenamtskarte/util/android_certificate.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:slang/builder/model/enums.dart';

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
    void override(AppLocale locale) async {
      final localeOverridePath = '${buildConfig.localeOverridePath}/override_${locale.languageCode}.json';
      String overrideLocales = await rootBundle.loadString(localeOverridePath);
      LocaleSettings.overrideTranslations(locale: locale, fileType: FileType.json, content: overrideLocales);
    }

    AppLocale.values.forEach(override);
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
