import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/home/home_page.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/routing.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

Map<String, String> nativeLanguageNames = {'en': 'English', 'de': 'Deutsch'};

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
                nativeLanguageNames[item]!,
                textAlign: TextAlign.center,
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              onTap: () => switchLanguage(context, item))))
    ]);
  }

  switchLanguage(BuildContext context, String language) {
    final messengerState = ScaffoldMessenger.of(context);
    final settings = Provider.of<SettingsModel>(context, listen: false);
    LocaleSettings.setLocaleRaw(language);
    settings.setLanguage(language: language);
    Navigator.push(
      context,
      AppRoute(
        builder: (context) => HomePage(),
      ),
    );
    messengerState.showSnackBar(
      SnackBar(
        backgroundColor: Theme.of(context).colorScheme.primary,
        content:
            Text(t.about.languageChangeSuccessful, style: TextStyle(color: Theme.of(context).colorScheme.background)),
      ),
    );
  }
}
