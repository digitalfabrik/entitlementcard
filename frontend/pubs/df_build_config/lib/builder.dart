library build_config;

import 'dart:async';
import 'dart:collection';
import 'dart:convert';
import 'dart:io';

import 'package:build/build.dart';

void pair_to_const(String k, dynamic v, StringBuffer buffer) {
  if (v is Map) {
    final map = v as Map<String, dynamic>;
    map.forEach((key, value) => pair_to_const(key, value, buffer));
  } else if (v is String) {
    buffer.write("const ");
    buffer.write('String ${k} = "${v}"');
    buffer.write(";\n");
  } else if (v is bool) {
    buffer.write("const ");
    buffer.write('bool ${k} = ${v}');
    buffer.write(";\n");
  } else {
    throw "invalid type ${v.runtimeType}";
    
  }
}

class MyBuilder extends Builder {
  String name;

  MyBuilder({required this.name});

  @override
  FutureOr<void> build(BuildStep buildStep) async {
    final arguments = <String>["v0", "build-config", "to-json", this.name, "ios"];
    final process = await Process.run("app-toolbelt", arguments, runInShell: true);
    final exitCode = process.exitCode;
    final stdErr = process.stderr.toString();

    if (exitCode != 0) {
      throw "Failed to execute app-toolbelt. Exit code ${exitCode}: ${stdErr}";
    }

    if (stdErr.isNotEmpty) {
      throw "Failed to execute app-toolbelt. Exit code ${exitCode}: ${stdErr}";
    }

    Map<String, dynamic> output = jsonDecode(process.stdout.toString()) as Map<String, dynamic>;

    var buffer = StringBuffer();

    output.forEach((k, v) => pair_to_const(k, v, buffer));

    buildStep.writeAsString(buildStep.allowedOutputs.first, """
${buffer}
class Test {     
}    
""");
  }

  @override
  Map<String, List<String>> get buildExtensions => {
        ".yaml": [".dart"]
      };
}

Builder configBuilder(BuilderOptions options) {
  var name = options.config["name"];

  if (name == null) {
    name = "bayern";
    print("Build config name is not set. Falling back to 'bayern'");
  }

  if (!(name is String)) {
    throw "Build config name is not a string.";
  }

  return MyBuilder(name: name);
}
