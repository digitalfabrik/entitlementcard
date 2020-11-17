# Ehrenamtskarte frontend

The Flutter app for the bavarian Ehrenamtskarte.

## Project structure

* `android`: A android project like for a native app. Put android specific code, needed permissions, … here
* `ios`: A iOS project like for a native app. Put iOS specific code, needed permissions, … here
* `lib`: Cross-platform production dart code. Here lives most of our code.
* `test`: Cross-platform test dart code. Put widget tests, unit tests, … here
* `pubspec.yaml`: Like `packages.json`. Specifies common information about our app (name, …) and the packages we want to use.
* `pubspec.lock`: Like `packages.lock`. Do not edit manually. Lists all the packages with their specific version we use

## Getting Started

### Flutter set-up

The Ehrenamtskarte app uses Flutter. Follow [this guide](https://flutter.dev/docs/get-started/install) to install flutter and the tools needed to work with it.

### Add a file with secrets

You have to add a file named `secrets.json` next to `pubspec.yaml` with content like this:
```json
{
  "mapbox_key": "<YOUR PUBLIC MAPBOX API KEY>"
}
```
Be careful not to add this file to the repository. For our build pipeline, we have an encrypted version `secrets.json.enc`. You can read more about this in the [Travis Docs](https://docs.travis-ci.com/user/encrypting-files/).
