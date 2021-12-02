import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'entry_widget.dart';
import 'graphql/configured_graphql_provider.dart';
import 'identification/card_details_model.dart';

class App extends StatelessWidget {
  const App({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ConfiguredGraphQlProvider(
      child: MultiProvider(providers: [
        ChangeNotifierProvider(create: (context) => SettingsModel()..initialize()),
        ChangeNotifierProvider(create: (context) => CardDetailsModel()..initialize()),
      ], child: const EntryWidget()),
    );
  }
}
