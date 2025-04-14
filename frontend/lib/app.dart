import 'package:ehrenamtskarte/activation/deeplink_activation.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/configuration/definitions.dart';
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/favorites/favorites_model.dart';
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

import 'package:ehrenamtskarte/home/home_page.dart';
import 'package:ehrenamtskarte/locale_initializer.dart';

const initialRouteName = '/';
const activationRouteCodeParamName = 'base64qrcode';
const activationRouteName = 'activation';
const homeRouteParamTabIndexName = 'tabIndex';
const homeRouteParamCardIndexName = 'cardIndex';
const homeRouteName = '/home';
const introRouteName = '/intro';

class App extends StatefulWidget {
  const App({super.key});

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  late Future<void> _initFuture;

  @override
  void initState() {
    super.initState();
    _initFuture = _initializeApp();
  }

  Future<void> _initializeApp() async {
    await initializeTranslations();
  }

  GoRouter _createRouter(SettingsModel settings) {
    return GoRouter(
      routes: <RouteBase>[
        GoRoute(
          path: initialRouteName,
          builder: (BuildContext context, GoRouterState state) {
            return settings.firstStart ? const IntroScreen() : const HomePage();
          },
          routes: [
            GoRoute(
              path: '$activationRouteName/:$activationRouteCodeParamName',
              builder: (BuildContext context, GoRouterState state) {
                return DeepLinkActivation(base64qrcode: Uri.decodeFull(state.uri.fragment));
              },
            ),
          ],
        ),
        GoRoute(
          path: homeRouteName,
          builder: (BuildContext context, GoRouterState state) => const HomePage(),
        ),
        GoRoute(
          path: '$homeRouteName/:$homeRouteParamTabIndexName/:$homeRouteParamCardIndexName',
          builder: (BuildContext context, GoRouterState state) {
            return HomePage(
              initialTabIndex: int.parse(state.pathParameters[homeRouteParamTabIndexName]!),
              initialCardIndex: int.parse(state.pathParameters[homeRouteParamCardIndexName]!),
            );
          },
        ),
        GoRoute(
          path: introRouteName,
          builder: (BuildContext context, GoRouterState state) => const IntroScreen(),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: _initFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const SizedBox.shrink();
        }

        final settings = Provider.of<SettingsModel>(context);
        final router = _createRouter(settings);

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

        return Configuration(
          mapStyleUrl: mapStyleUrl,
          graphqlUrl: graphqlUrl,
          projectId: projectId,
          showDevSettings: kDebugMode,
          child: ConfiguredGraphQlProvider(
            child: MultiProvider(
              providers: [
                ChangeNotifierProvider<UserCodeModel>(create: (_) => UserCodeModel()..initialize()),
                ChangeNotifierProvider<FavoritesModel>(create: (_) => FavoritesModel()..initialize()),
              ],
              child: MaterialApp.router(
                theme: lightTheme,
                darkTheme: darkTheme,
                themeMode: ThemeMode.system,
                debugShowCheckedModeBanner: false,
                localizationsDelegates: const [
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
      },
    );
  }
}
