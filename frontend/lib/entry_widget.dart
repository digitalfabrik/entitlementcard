import 'package:ehrenamtskarte/widgets/error_message.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/localization/form_builder_localizations.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';

import 'configuration/configuration.dart';
import 'configuration/settings_model.dart';
import 'home/home_page.dart';
import 'intro_slides/intro_screen.dart';
import 'themes.dart';

class EntryWidget extends StatelessWidget {
  const EntryWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final configuration = Configuration.of(context);
    final settings = Provider.of<SettingsModel>(context);

    return FutureBuilder<SettingsModel>(
      future: settings.initialize(),
      builder: (context, snapshot) {
        final settings = snapshot.data;
        final error = snapshot.error;
        if (snapshot.hasError && error != null) {
          return ErrorMessage(error.toString());
        } else if (snapshot.hasData && settings != null) {
          final routes = <String, WidgetBuilder>{};
          String? initialRoute;

          if (settings.firstStart) {
            routes.addAll(<String, WidgetBuilder>{
              '/intro': (context) => IntroScreen(
                    onFinishedCallback: () => settings.setFirstStart(false),
                  ),
            });
            initialRoute = '/intro';
          }

          return MaterialApp(
            title: 'Ehrenamtskarte',
            theme: lightTheme,
            darkTheme: darkTheme,
            themeMode: ThemeMode.system,
            initialRoute: initialRoute,
            debugShowCheckedModeBanner: false,
            localizationsDelegates: const [
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
              FormBuilderLocalizations.delegate,
            ],
            supportedLocales: const [Locale('de')],
            locale: const Locale('de'),
            home: HomePage(
              showVerification: configuration.showVerification,
            ),
            routes: routes,
          );
        } else {
          return Container();
        }
      },
    );
  }
}
