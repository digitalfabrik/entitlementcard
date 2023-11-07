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
              onTap: () => switchLanguage(context, item))))
    ]);
  }

  switchLanguage(BuildContext context, String language) {
    final messengerState = ScaffoldMessenger.of(context);
    LocaleSettings.setLocaleRaw(language);
    messengerState.showSnackBar(
      SnackBar(
        backgroundColor: Theme.of(context).colorScheme.primary,
        content: Text(t.about.settings.languageNotification,
            style: TextStyle(color: Theme.of(context).colorScheme.background)),
      ),
    );
    Navigator.pop(context);
  }
}
