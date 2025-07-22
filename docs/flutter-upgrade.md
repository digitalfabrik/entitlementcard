### Upgrade flutter

####  Note: We are using fvm
- check for recent flutter and dart sdk versions here: https://docs.flutter.dev/install/archive
- check for breaking changes here: https://docs.flutter.dev/release/breaking-changes
- adjust the `pubspec.yml` with the desired version `flutter` and `sdk`.
- run in (/frontend):
```
fvm install <flutter-version>
fvm use <flutter-version>
```
- adjust flutter and dart to the recent version in your IDE (f.e. Languages & Frameworks in IntelliJ).
- run `fvm flutter pub get` to check if the packages run under the current dart and flutter environment.
- build the app on android and ios and check if there are any issues.
