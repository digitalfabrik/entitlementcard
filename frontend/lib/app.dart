import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/home/home_page.dart';
import 'package:ehrenamtskarte/identification/card_details_model.dart';
import 'package:ehrenamtskarte/intro_slides/intro_screen.dart';
import 'package:ehrenamtskarte/themes.dart';
import 'package:ehrenamtskarte/widgets/error_message.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';

const introRouteName = "/intro";
const homeRouteName = "/home";

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsModel>(context);

    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => SettingsModel()..initialize()),
        ChangeNotifierProvider(create: (context) => CardDetailsModel()..initialize()),
      ],
      child: FutureBuilder<SettingsModel>(
        future: settings.initialize(),
        builder: (context, snapshot) {
          final settings = snapshot.data;
          final error = snapshot.error;
          if (snapshot.hasError && error != null) {
            return ErrorMessage(error.toString());
          } else if (snapshot.hasData && settings != null) {
            final routes = <String, WidgetBuilder>{
              introRouteName: (context) => IntroScreen(
                    onFinishedCallback: () => settings.setFirstStart(enabled: false),
                  ),
              homeRouteName: (context) => const HomePage()
            };

            final String initialRoute = settings.firstStart ? introRouteName : homeRouteName;

            return MaterialApp(
              title: 'Ehrenamtskarte',
              theme: lightTheme,
              darkTheme: darkTheme,
              themeMode: ThemeMode.system,
              debugShowCheckedModeBanner: false,
              localizationsDelegates: const [
                GlobalMaterialLocalizations.delegate,
                GlobalWidgetsLocalizations.delegate,
                GlobalCupertinoLocalizations.delegate,
              ],
              supportedLocales: const [Locale('de')],
              locale: const Locale('de'),
              initialRoute: initialRoute,
              routes: routes,
            );
          } else {
            return Container();
          }
        },
      ),
    );
  }
}
