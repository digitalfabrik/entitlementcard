// This builder is based on: https://github.com/pikaju/dart-protoc-builder

library protobuf_builder;

import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:build/build.dart';
import 'package:path/path.dart' as path;

/// Adds a forward slash between the two paths.
///
/// NOTE: Do NOT use path.join, since package:build is expecting a forward slash
/// regardless of the platform, but path.join will return a backslash on Windows.
String join(String a, String b) => a.endsWith("/") ? "$a$b" : "$a/$b";

/// Runs [Process#run] but throws a [ProcessError] if the [Process] exits with
/// a non-zero status code.
Future<ProcessResult> runSafely(
  String executable,
  List<String> arguments, {
  String? workingDirectory,
  Map<String, String>? environment,
  bool includeParentEnvironment = true,
  bool runInShell = true,
  Encoding? stdoutEncoding = systemEncoding,
  Encoding? stderrEncoding = systemEncoding,
}) async {
  final result = await Process.run(
    executable,
    arguments,
    workingDirectory: workingDirectory,
    environment: environment,
    includeParentEnvironment: includeParentEnvironment,
    runInShell: runInShell,
    stdoutEncoding: stdoutEncoding,
    stderrEncoding: stderrEncoding,
  );
  if (result.exitCode != 0) throw ProcessError(executable, arguments, result);
  return result;
}

/// An error describing the failure of a [Process].
class ProcessError extends Error {
  ProcessError(this.executable, this.arguments, this.result);

  final String executable;
  final List<String> arguments;
  final ProcessResult result;

  @override
  String toString() {
    return '''
A process finished with exit code ${result.exitCode}:
Call:
"$executable", ${json.encode(arguments)}
Standard error output:
${result.stderr}
    ''';
  }
}

const outputDirectory = 'lib/proto/';

class ProtobufBuilder extends Builder {
  @override
  FutureOr<void> build(BuildStep buildStep) async {
    await buildStep.readAsString(buildStep.inputId);

    final inputPath = path.normalize(buildStep.inputId.path);

    // Read the input path to signal to the build graph that if the file changes
    // then it should be rebuilt.
    await buildStep.readAsString(buildStep.inputId);

    await Directory(outputDirectory).create(recursive: true);
    await runSafely(
      "protoc",
      [
        '--plugin=protoc-gen-dart=/Users/max/.pub-cache/bin/protoc-gen-dart',
        '--dart_out=$outputDirectory',
        path.join('.', inputPath),
      ],
    );

    // Just as with the read, the build runner spies on what we write, so we
    // need to write each output file explicitly, even though they've already
    // been written by protoc. This will ensure that if an output file is
    // deleted, a future build will recreate it. This also checks that the files
    // we were expected to write were actually written, since this will fail if
    // an output file wasn't created by protoc.
    await Future.wait(
      buildStep.allowedOutputs.map(
        (AssetId out) async {
          final file = File(out.path);
          await buildStep.writeAsBytes(out, file.readAsBytes());
        },
      ),
    );
  }

  @override
  Map<String, List<String>> get buildExtensions => {
        "{{}}.proto": [
          '$outputDirectory/{{}}.pb.dart',
          '$outputDirectory/{{}}.pbenum.dart',
          '$outputDirectory/{{}}.pbjson.dart',
        ],
      };
}

Builder protobufBuilder(BuilderOptions options) {
  return ProtobufBuilder();
}
