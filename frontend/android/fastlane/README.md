fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android keystore

```sh
[bundle exec] fastlane android keystore
```

Download and decrypt the JKS

### android validate_play_store_key

```sh
[bundle exec] fastlane android validate_play_store_key
```

Validate Play Store Key

### android build

```sh
[bundle exec] fastlane android build
```

Build Android App

### android upload_to_playstore

```sh
[bundle exec] fastlane android upload_to_playstore
```

Upload Android App to Google Play

### android playstore_promote

```sh
[bundle exec] fastlane android playstore_promote
```

Promote the most recent version in the beta track to the production track in the Play Store.

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
