# Generate protobuf

How to compile:

For java:

1. Install `protoc` for compiling https://github.com/protocolbuffers/protobuf#protocol-compiler-installation
1. To compile the java file: `protoc --java_out=. card_activate_model.proto` in the folder where the .proto file is.
   Then copy the java file into the appropriate folder

For dart:

1. Install `protoc` for compiling https://github.com/protocolbuffers/protobuf#protocol-compiler-installation
1. You need the `protobuf: ^1.1.0` dependency in the pubspec.yaml like in this branch. Run `flutter pub get` as normal
   in the frontend directory.
1. Run `flutter pub global activate protoc_plugin` in the frontend directory. Add the recommended line to your path as
   printed on the terminal after running the command.
1. Then `protoc --dart_out=../frontend/lib/identification/protobuf card_activate_model.proto` should work in the folder where the .proto file is.
1. Then `protoc --dart_out=../frontend/lib/identification/protobuf card_verify_model.proto` should work in the folder where the .proto file is.
