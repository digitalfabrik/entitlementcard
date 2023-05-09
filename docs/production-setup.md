# Setup of production

> The deployment to production is done by the [Digitalfabrik](https://github.com/digitalfabrik/) and restricted by permissions.
> Reach out to [@maxammann](https://github.com/maxammann/) or [@sarahsporck](https://github.com/sarahsporck/) or [@f1sh1918](https://github.com/f1sh1918/) for more information and insights.

## Certificates and Signing

### Android

Clone the [app-credentials](https://github.com/digitalfabrik/app-credentials) repo.

In `frontend/android` create a file `local.properties` (if it does not already exist).

Add the following entries for signing:

```bash
signing.keyAlias=upload
signing.keyPassword=<passbolt - Ehrenamtskarte Bayern Keystore Key Password>
signing.storeFile=<path-to-local-repo>/app-credentials/android/nuernberg-sozialpass.jks
signing.storePassword=<passbolt - Ehrenamtskarte Bayern Keystore Password>
```

### iOS

In `frontend/iOS`  run `bundle exec fastlane match appstore` .

- Use user [app-team@integreat-app.de](mailto:app-team@integreat-app.de) and password from `<passbolt - Digitalfabrik Fastlane Match>`
- Set correct app_identifier (a list of identifier is also allowed): `app.sozialpass.nuernberg,de.nrw.it.ehrensachebayern`

## Release Workflow

- Create a release branch: `release-<version>`  (check out the next version in the google play console or in app store connect)
- Create a  [Github release](https://github.com/digitalfabrik/entitlementcard/releases/new) based on that branch
- Set a new tag with `<version>`
- Generate release notes and update CHANGELOG.md
- Update version in `/administration/package.json` and `frontend/pubspec.yaml`

### Frontend

For Nürnberg replace:

- bayern → nuernberg
- Bayern → Nuernberg

1. In a shell navigate to the `frontend` directory
2. Select the correct build version

```bash
fvm flutter pub run build_runner build —define “df_build_config=name=bayern”
```

3. Create bundles

```bash
# Android
fvm flutter build appbundle --flavor Bayern --release --dart-define=environment=production

# iOS
# Make sure the correct certificate is selected for the release job in xcode
fvm flutter build ipa --flavor Bayern --release --dart-define=environment=production
# This will show an error "exportArchive: "Runner.app" requires a provisioning profile."
# but an xcarchive will still be created which then can be distributed via xcode
```

5. Release:
    1. In the Google Play Console create a new release for Open Testing. For this upload the app bundle from `build/app/outputs/bundle/bayernRelease/app-bayern-release.aab`. Once the release is approved by Google Play promote to production.
    2. `open ./build/ios/archive/Runner.xcarchive` → navigate the dialog and finally distribute the app. This will create a release on Testflight. Once apple has approved the Testflight release, the app can be “promoted”. For that change the build and version number in app store connect and let the app be checked a second time. Finally the app can be released.


### Backend and Administration
*Note:* On staging the new bundles will be triggered after merging on main and be installed every friday via `auto-update`

- setting the git tag, triggers `backend` job with `deploy-production` and creates new bundles on the `entitlementcard.app` server.
- connect via ssh `ssh <username>@entitlementcard.app`
- switch to root user `sudo -i`
- (optional) check installed version of administration: `apt-cache policy eak-administration`
- (optional) check available versions: `ll -trh /srv/local-apt-repository`
- stop backend service : `systemctl stop eak-backend.service`
- update and upgrade apt: `apt update` && `apt upgrade`
- run database migrations if needed: `sudo -u backend /opt/ehrenamtskarte/backend/bin/backend migrate`
  - check current version of migration: `sudo -u backend psql entitlementcard` && `SELECT * from migrations;`
- restart backend service: `systemctl restart eak-backend.service`
- check backend health log: `journalctl -u eak-backend.service --since "1h ago"`

## Snapshots

The Snapshots are created by executing a bunch of e2e tests locally. Check out `frontend/ios/ScreenshotTest` .

iOS snapshots can be created via `bundle exec fastlane snapshot` in the `frontend/ios` directory. For that you’ll have to install a bunch of simulators in XCode (see `frontend/ios/fastlane/Snapfile`)
