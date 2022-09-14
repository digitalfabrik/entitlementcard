library build_config;

import 'dart:async';

import 'package:build/build.dart';

class MyBuilder extends Builder {
  @override
  FutureOr<void> build(BuildStep buildStep) {
    buildStep.writeAsString(buildStep.allowedOutputs.first,  "class Test {}\n");
  }

  @override
  Map<String, List<String>> get buildExtensions => {".yaml": [".dart"]};
}

Builder configBuilder(BuilderOptions options) {
  return MyBuilder();
}
