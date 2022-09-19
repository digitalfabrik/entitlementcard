library build_config;

import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:build/build.dart';

String capitalize(String subject, [bool lowerRest = false]) {
  if (lowerRest) {
    return subject[0].toUpperCase() + subject.substring(1).toLowerCase();
  } else {
    return subject[0].toUpperCase() + subject.substring(1);
  }
}

void generateDataModel(String name, Map<String, dynamic> json, StringBuffer output) {
  var root = StringBuffer();

  var fields = StringBuffer();

  json.forEach((key, value) => pair_to_field(key, value, root, fields));

  output.write("""
${root}class ${name} {
${fields}
  const ${name}();
}

""");
 
}

void pair_to_field(String k, dynamic v, StringBuffer root, StringBuffer output) {
  if (v is Map) {
    final json = v as Map<String, dynamic>;

    var name = capitalize(k);
    output.write('  ${name} get ${k} => const ${name}();\n');
    json.forEach((key, value) => generateDataModel(name, json, root));
  } else if (v is String) {
    output.write('  String get ${k} => "${v}";\n');
  } else if (v is bool) {
    output.write('  bool get ${k} => ${v};\n');
  } else if (v is int) {
    output.write('  int get ${k} => ${v};\n');
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

    if (exitCode != 0 || stdErr.isNotEmpty) {
      throw "Failed to execute app-toolbelt. Exit code ${exitCode}: ${stdErr}";
    }

    Map<String, dynamic> json = jsonDecode(process.stdout.toString()) as Map<String, dynamic>;
    var dataModel = StringBuffer();

    generateDataModel("BuildConfig", json, dataModel);
    
    dataModel.write("""
const BuildConfig buildConfig = BuildConfig();
    """);

    buildStep.writeAsString(buildStep.allowedOutputs.first, dataModel.toString());
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
