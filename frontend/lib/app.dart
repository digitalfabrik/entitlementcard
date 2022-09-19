import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/entry_widget.dart';
import 'package:ehrenamtskarte/graphql/configured_graphql_provider.dart';
import 'package:ehrenamtskarte/identification/card_details_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return ConfiguredGraphQlProvider(
      child: MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (context) => SettingsModel()..initialize()),
          ChangeNotifierProvider(create: (context) => CardDetailsModel()..initialize()),
        ],
        child: const EntryWidget(),
      ),
    );
  }
}
