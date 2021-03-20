import 'package:flutter/material.dart';
import 'package:flutter_form_builder/localization/form_builder_localizations.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'configuration/configuration.dart';
import 'configuration/first_start.dart';
import 'home/home_page.dart';
import 'intro_slides/intro_screen.dart';
import 'themes.dart';

class EntryWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
        future: isFirstStart(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.none ||
              snapshot.connectionState == ConnectionState.waiting) {
            return Container();
          }
          final routes = <String, WidgetBuilder>{};
          String initialRoute;
          if (!snapshot.hasError && snapshot.hasData && snapshot.data) {
            routes.addAll(<String, WidgetBuilder>{
              '/intro': (context) => IntroScreen(
                    onFinishedCallback: setFirstStart,
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
              localizationsDelegates: [
                GlobalMaterialLocalizations.delegate,
                GlobalWidgetsLocalizations.delegate,
                GlobalCupertinoLocalizations.delegate,
                FormBuilderLocalizations.delegate,
              ],
              supportedLocales: [Locale('de')],
              locale: Locale('de'),
              home: HomePage(
                showVerification: Configuration.of(context).showVerification,
              ),
              routes: routes);
        });
  }
}
