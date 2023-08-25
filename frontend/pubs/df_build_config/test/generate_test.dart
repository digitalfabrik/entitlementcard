// ignore_for_file: prefer_single_quotes
import 'dart:convert';

import 'package:df_build_config/builder.dart';
import 'package:test/test.dart';

void main() {
  test('Generated build config should stay the same', () {
    const json = """
    {"appName":"Ehrenamt","appIcon":"","backendUrl":"","featureFlags":{"developerFriendly":false},"bundleIdentifier":"de.nrw.it.ehrensachebayern"}
    """;

    final output = StringBuffer();
    generateDataModel("BuildConfig", jsonDecode(json) as Map<String, dynamic>, output);
    // language=dart
    expect(output.toString(), """
class FeatureFlags {
  bool get developerFriendly => false;

  const FeatureFlags();
}

class BuildConfig {
  String get appName => "Ehrenamt";
  String get appIcon => "";
  String get backendUrl => "";
  FeatureFlags get featureFlags => const FeatureFlags();
  String get bundleIdentifier => "de.nrw.it.ehrensachebayern";

  const BuildConfig();
}

""");
  });
}
