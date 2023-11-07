import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:flutter/material.dart';

Map<String, String> languages = {'en': 'Englisch', 'de': 'Deutsch'};

class LanguageChange extends StatelessWidget {
  const LanguageChange({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      ...buildConfig.appLocales.map((item) => DecoratedBox(
          decoration: BoxDecoration(
              color: LocaleSettings.currentLocale.languageCode == item
                  ? Theme.of(context).colorScheme.surfaceVariant
                  : null),
          child: ListTile(
              title: Text(
                languages[item]!,
                textAlign: TextAlign.center,
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              onTap: () => LocaleSettings.setLocaleRaw(item))))
    ]);
  }
}
