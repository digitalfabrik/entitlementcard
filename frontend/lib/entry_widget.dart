import 'package:flutter/material.dart';
import 'package:flutter_form_builder/localization/form_builder_localizations.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'configuration/configuration.dart';
import 'configuration/first_start.dart';
import 'home/home_page.dart';
import 'intro_slides/intro_screen.dart';
import 'themes.dart';

class EntryWidget extends StatelessWidget {
  const EntryWidget({Key? key}) : super(key: key);

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
          String initialRoute = null;
          if (!snapshot.hasError && snapshot.hasData && (snapshot.data ?? false)) {
            routes.addAll(<String, WidgetBuilder>{
              '/intro': (context) => const IntroScreen(
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
                showVerification: Configuration.of(context).showVerification,
              ),
              routes: routes);
        });
  }
}
