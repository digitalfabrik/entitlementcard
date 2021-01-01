import 'package:ehrenamtskarte/configuration.dart';
import 'package:ehrenamtskarte/util/card_details_test_data.dart';
import 'package:flutter/material.dart';

import 'app.dart';

const GRAPHQL_URL = String.fromEnvironment("graphql_url",
    defaultValue: "http://localhost:7000");
const MAP_STYLE_URL = String.fromEnvironment("map_style_url",
    defaultValue: "http://localhost:5002/style.json");
const EAK_TEST_DATA =
    bool.fromEnvironment("eak_test_data", defaultValue: false);
const RESET_EAK_DATA = bool.fromEnvironment("reset_eak", defaultValue: false);

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (RESET_EAK_DATA) {
    await clearStoredData();
  }
  if (EAK_TEST_DATA) {
    await insertEAKTestData();
  }
  runApp(Configuration(
      mapStyleUrl: MAP_STYLE_URL, graphqlUrl: GRAPHQL_URL, child: App()));
}
