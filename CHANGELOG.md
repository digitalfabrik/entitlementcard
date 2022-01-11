# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]
### Fixed
- Fixed the web preview of the MapLibre map. (#401)
- Improved .gitignore. (#406)
- Refactored app structure to conform with the Flutter API. (#408, #414)
- Added a workaround for a bug in the map which is triggered when rotating the device. (#416)
- Fixed warnings which are emitted when building the app. (#425)
- Added a fallback text for the description of Akzeptanzstellen (#428)
- Prevent line breaks in category names (#429)
- 
### Added
- Enabled Dart null safety. (#398)
- Implemented custom license page. (#409)
- Added a CircleCI setup for building the app on iOS and Android. (#423)
- Added a floss build which can be published on F-Droid. (#427)

### Changed
- Refactored permission handling to conform with Android guidelines. It is very similar to Google Maps now. (#396, #404)
- Moved the MapLibre map styles from this repository to [another one](https://github.com/digitalfabrik/ehrenamtskarte-maplibre-style). (#422)
- Added a better linting configuration (#431)
- Increased Android target SDK to 30. (#402)

### Removed
- Removed application module from the frontend. It is still available in the backend. (#411)

## [2.0.2] - 53 - 2021-10-19
### Changed
- Upgraded flutter version to 2.5.2 (#385)
- Upgraded dependencies of flutter project (#387)
- Using a linter for flutter (#386)
- We are using now Fastlane match to install certificates and profiles on iOS
- Switched from MapBox to MapLibre (#387)

## [2.0.1] - 52 - 2021-09-18
### Fixed
- Location permission button in into slides is greyed out if permission is already given
- Increased the touch target for selection points on the map
- Switched development team from IT.NRW to Tür an Tür - Digitalfabrik


## [2.0.0] - 51 - 2021-08-29
### Fixed
- The whole app
### Removed
- The ability to search for Akzeptanzstellen nearby arbitrary locations

[Unreleased]: https://github.com/digitalfabrik/ehrenamtskarte/compare/v2.0.1...HEAD
[2.0.1]: https://github.com/digitalfabrik/ehrenamtskarte/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/digitalfabrik/ehrenamtskarte/releases/tag/v2.0.0

