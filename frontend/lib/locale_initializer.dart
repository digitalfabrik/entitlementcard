import 'dart:io';
import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:slang/overrides.dart';

Future<void> initializeTranslations() async {
  // This is a workaround for not properly overriding translations on ios, find the issue here: https://github.com/slang-i18n/slang/issues/294
  // This workaround should be removed when slang v.4.6.1 is available (#2061)
  await LocaleSettings.instance.loadAllLocales();

  final storedAppLocale = await SettingsModel.getLanguage();
  if (storedAppLocale != null) {
    await LocaleSettings.setLocaleRaw(storedAppLocale);
  } else {
    final systemLocale = Platform.localeName.split('_')[0];
    if (buildConfig.appLocales.contains(systemLocale)) {
      await LocaleSettings.useDeviceLocale();
    } else if (buildConfig.appLocales.contains('en')) {
      await LocaleSettings.setLocale(AppLocale.en);
    } else {
      await LocaleSettings.setLocale(AppLocale.de);
    }
  }
  // Use override locales for whitelabels (e.g. nuernberg)
  // ignore: unnecessary_null_comparison
  if (buildConfig.localeOverridePath != null) {
    Future.forEach(AppLocale.values, (locale) async {
      await overrideLocale(locale);
    });
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
