### Upgrade flutter

- check for recent flutter and dart sdk versions here: https://docs.flutter.dev/install/archive
- check for breaking changes here: https://docs.flutter.dev/release/breaking-changes
- adjust the `pubspec.yml` and `mise.toml` with the desired version `flutter` and `sdk` (dart).
- run in (/frontend):
```
mise install
flutter --version
```
- adjust flutter to the recent version in your IDE using  (f.e. Languages & Frameworks in IntelliJ).
- you should find it in `/Users/<user>/.local/share/mise/http-tarballs` (if you use MacOS)
- run `flutter pub get` to check if the packages run under the current dart and flutter environment.
- build the app on android and ios and check if there are any issues.
