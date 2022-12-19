# Protobuf Setup

Install `protoc` for compiling https://github.com/protocolbuffers/protobuf#protocol-compiler-installation

## Frontend (Dart)

1. Enable protobuf: `flutter pub global activate protoc_plugin` in the `./frontend/` directory.
2. Then execute the Dart `build_runner` like this:
   ```bash
   fvm flutter pub run build_runner build
   ```

