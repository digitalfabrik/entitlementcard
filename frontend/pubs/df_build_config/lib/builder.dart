// ignore_for_file: prefer_single_quotes
library build_config;

import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:build/build.dart';
import 'package:logging/logging.dart';

String capitalize(String subject) {
  return subject[0].toUpperCase() + subject.substring(1);
}

void generateDataModel(String name, Map<String, dynamic> json, StringBuffer output) {
  final root = StringBuffer();

  final fields = StringBuffer();

  json.forEach((key, value) => pairToField(key, value, root, fields));

  output.write("""
${root}class $name {
$fields
  const $name();
}

""");
}

void pairToField(String k, dynamic v, StringBuffer root, StringBuffer output) {
  if (v is Map) {
    final json = v as Map<String, dynamic>;

    final name = capitalize(k);
    output.write('  $name get $k => const $name();\n');
    generateDataModel(name, json, root);
  } else if (v is String) {
    final escaped = v.replaceAll('"', '\\"').replaceAll("\n", "\\n");
    output.write('  String get $k => "$escaped";\n');
  } else if (v is String?) {
    output.write('  String? get $k => null;\n');
  } else if (v is bool) {
    output.write('  bool get $k => $v;\n');
  } else if (v is double) {
    output.write('  double get $k => $v;\n');
    // Ignoring a JS-specific linting rule whose reasoning does not apply here.
    // ignore: avoid_double_and_int_checks
  } else if (v is int) {
    output.write('  int get $k => $v;\n');
  } else if (v is List) {
    if (v.isEmpty) {
      output.write('  List<dynamic> get $k => [];\n');
    } else {
      final element = v.first;

      if (element is int) {
        output.write('  List<int> get $k => $v;\n');
      } else if (element is String) {
        output.write('  List<String> get $k => [\'${v.join('\', \'')}\'];\n');
      } else {
        throw "invalid list ${v.runtimeType}";
      }
    }
  } else {
    throw "invalid type ${v.runtimeType}";
  }
}

class BuildConfigBuilder extends Builder {
  String name;

  BuildConfigBuilder({required this.name});

  @override
  FutureOr<void> build(BuildStep buildStep) async {
    final arguments = <String>["v0", "build-config", "to-json", name, "common"];
    final process = await Process.run("app-toolbelt", arguments, runInShell: true);
    final exitCode = process.exitCode;
    final stdErr = process.stderr.toString();

    if (exitCode != 0 || stdErr.isNotEmpty) {
      throw "Failed to execute app-toolbelt. Exit code $exitCode: $stdErr";
    }

    final Map<String, dynamic> json = jsonDecode(process.stdout.toString()) as Map<String, dynamic>;
    final dataModel = StringBuffer();

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
    log.log(Level.WARNING, "Build config name is not set. Falling back to 'bayern'");
  }

  if (name is! String) {
    throw "Build config name is not a string.";
  }

  return BuildConfigBuilder(name: name);
}
