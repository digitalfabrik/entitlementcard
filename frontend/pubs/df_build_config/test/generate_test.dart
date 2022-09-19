import 'dart:convert';

import 'package:test/test.dart';
import 'package:df_build_config/builder.dart';

void main() {
  test('Counter value should be incremented', () {
    final json = """
    {"appName":"Ehrenamt","appIcon":"","backendUrl":"","featureFlags":{"developerFriendly":false},"bundleIdentifier":"de.nrw.it.ehrensachebayern"}
    """;

    var output = new StringBuffer();
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
