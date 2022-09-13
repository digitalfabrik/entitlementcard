library build_config;

import 'dart:async';

import 'package:build/build.dart';
import 'package:source_gen/source_gen.dart';

class MyGenerator extends Generator {
  @override
  FutureOr<String?> generate(LibraryReader library, BuildStep buildStep) async {
    print("AAAAAAA");
    print(buildStep.inputId);
    return "class Test {}";
  }
}

class MyBuilder extends Builder {
  @override
  FutureOr<void> build(BuildStep buildStep) {
    print("AAAAAAA");
    print(buildStep.inputId);
  }

  @override
  // TODO: implement buildExtensions
  Map<String, List<String>> get buildExtensions => {".ts": [".config_builder.g.part"]};
}

Builder configBuilder(BuilderOptions options) {
  print("BBBBBBB");
  //return PartBuilder([MyGenerator()], 'build_config');
  
  return MyBuilder();
}
