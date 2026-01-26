import 'package:ehrenamtskarte/l10n/translations.g.dart';

String? getLocalizedDescription(List<dynamic>? descriptions) {
  if (descriptions == null || descriptions.isEmpty) return null;

  final appLocale = LocaleSettings.currentLocale.languageCode.toUpperCase();
  final fallbackLocale = AppLocale.de.languageCode.toUpperCase();

  String? fallback;

  for (final description in descriptions) {
    final locale = (description.locale as String);
    if (locale == appLocale) {
      return description.text as String;
    }
    if (locale == fallbackLocale) {
      fallback ??= description.text as String;
    }
  }

  return fallback;
}
