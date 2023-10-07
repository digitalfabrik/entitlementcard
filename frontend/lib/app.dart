import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/configuration/definitions.dart';
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/graphql/configured_graphql_provider.dart';
import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:ehrenamtskarte/intro_slides/intro_screen.dart';
import 'package:ehrenamtskarte/themes.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';

import 'home/home_page.dart';

const introRouteName = '/intro';
const homeRouteName = '/home';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsModel>(context);
    final mapStyleUrl = settings.enableStaging
        ? buildConfig.mapStyleUrl.staging
        : isProduction()
            ? buildConfig.mapStyleUrl.production
            : isLocal()
                ? buildConfig.mapStyleUrl.local
                : buildConfig.mapStyleUrl.showcase;

    final graphqlUrl = settings.enableStaging
        ? buildConfig.backendUrl.staging
        : isProduction()
            ? buildConfig.backendUrl.production
            : isLocal()
                ? buildConfig.backendUrl.local
                : buildConfig.backendUrl.showcase;

    final projectId = isProduction()
        ? buildConfig.projectId.production
        : isLocal()
            ? buildConfig.projectId.local
            : buildConfig.projectId.showcase;

    final routes = <String, WidgetBuilder>{
      introRouteName: (context) => IntroScreen(
            onFinishedCallback: () => settings.setFirstStart(enabled: false),
          ),
      homeRouteName: (context) => const HomePage()
    };

    final String initialRoute = settings.firstStart ? introRouteName : homeRouteName;

    return Configuration(
      mapStyleUrl: mapStyleUrl,
      graphqlUrl: graphqlUrl,
      projectId: projectId,
      showDevSettings: kDebugMode,
      child: ConfiguredGraphQlProvider(
        child: ChangeNotifierProvider(
          create: (context) => UserCodeModel()..initialize(),
          child: MaterialApp(
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
          ),
        ),
      ),
    );
  }
}
