import 'package:ehrenamtskarte/activation/deeplink_activation.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/configuration/definitions.dart';
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/graphql/configured_graphql_provider.dart';
import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:ehrenamtskarte/intro_slides/intro_screen.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/themes.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'home/home_page.dart';

const initialRouteName = '/';
const activationRouteCodeParamName = 'base64qrcode';
const activationRouteName = 'activation';
const homeRouteParamTabIndexName = 'tabIndex';
const homeRouteName = '/home';
const introRouteName = '/intro';

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

    final GoRouter router = GoRouter(
      routes: <RouteBase>[
        GoRoute(
          path: initialRouteName,
          builder: (BuildContext context, GoRouterState state) {
            return settings.firstStart
                ? IntroScreen(
                    onFinishedCallback: () => settings.setFirstStart(enabled: false),
                  )
                : HomePage();
          },
          routes: [
            GoRoute(
              path: '$activationRouteName/:$activationRouteCodeParamName',
              builder: (BuildContext context, GoRouterState state) {
                print(state.uri.fragment);
                return DeepLinkActivation(base64qrcode: Uri.decodeFull(state.uri.fragment));
              },
            ),
          ],
        ),
        GoRoute(
          path: introRouteName,
          builder: (BuildContext context, GoRouterState state) {
            return IntroScreen(
              onFinishedCallback: () => settings.setFirstStart(enabled: false),
            );
          },
        ),
        GoRoute(
          path: homeRouteName,
          builder: (BuildContext context, GoRouterState state) {
            return HomePage();
          },
        ),
        GoRoute(
          path: '$homeRouteName/:$homeRouteParamTabIndexName',
          builder: (BuildContext context, GoRouterState state) {
            return HomePage(initialTabIndex: int.parse(state.pathParameters[homeRouteParamTabIndexName]!));
          },
        ),
      ],
    );

    // Load default language from settings
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (settings.language != null) {
        LocaleSettings.setLocaleRaw(settings.language!);
      }
    });

    return Configuration(
      mapStyleUrl: mapStyleUrl,
      graphqlUrl: graphqlUrl,
      projectId: projectId,
      showDevSettings: kDebugMode,
      child: ConfiguredGraphQlProvider(
        child: ChangeNotifierProvider(
          create: (context) => UserCodeModel()..initialize(),
          child: MaterialApp.router(
            theme: lightTheme,
            darkTheme: darkTheme,
            themeMode: ThemeMode.system,
            debugShowCheckedModeBanner: false,
            localizationsDelegates: [
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            supportedLocales: buildConfig.appLocales.map((locale) => Locale(locale)),
            locale: TranslationProvider.of(context).flutterLocale,
            routerConfig: router,
          ),
        ),
      ),
    );
  }
}
