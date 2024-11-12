# Setup of production

> The deployment to production is done by the [Digitalfabrik](https://github.com/digitalfabrik/) and restricted by permissions.
> Reach out to [@maxammann](https://github.com/maxammann/) or [@sarahsporck](https://github.com/sarahsporck/) or [@f1sh1918](https://github.com/f1sh1918/) for more information and insights.

## Certificates and Signing

### Android

Clone the [app-credentials](https://github.com/digitalfabrik/app-credentials) repo.

In `frontend/android` create a file `local.properties` (if it does not already exist).

Add the following entries for signing depending on build config:

```bash
signing.keyAlias=de.nrw.it.giz.ehrensache.bayern.android-googleplay
signing.keyPassword=<passbolt - Ehrenamtskarte Bayern Keystore Key Password>
signing.storeFile=<path-to-local-repo>/app-credentials/android/ehrenamtskarte-bayern.jks
signing.storePassword=<passbolt - Ehrenamtskarte Bayern Keystore Password>
```

```bash
signing.keyAlias=upload
signing.keyPassword=<passbolt - Nuernberg Sozialpass Keystore Password>
signing.storeFile=<path-to-local-repo>/app-credentials/android/nuernberg-sozialpass.jks
signing.storePassword=<passbolt - Nuernberg Sozialpass Keystore Password>
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
- Create PR to main branch

### Frontend

For Nürnberg replace:

- bayern → nuernberg
- Bayern → Nuernberg

1. In a shell navigate to the `frontend` directory
2. Select the correct build version

```bash
fvm flutter pub run build_runner build --define df_build_config=name=bayern
```

3. Create bundles

```bash
# Android
fvm flutter build appbundle --flavor bayern --release --dart-define=environment=production

# iOS
# Make sure the correct certificate is selected for the release job in xcode
fvm flutter build ipa --flavor bayern --release --dart-define=environment=production
# Ensure the correct bundle identifier is used in XCode
# This will show an error "exportArchive: "Runner.app" requires a provisioning profile."
# but an xcarchive will still be created which then can be distributed via xcode
```

4. Release

#### Android:
- In the Google Play Console create a new release for Open Testing. 
- For this upload the app bundle from `build/app/outputs/bundle/bayernRelease/app-bayern-release.aab` and save. 
- Go to "Release-Overview" and send the changes to google. Once the release is approved by Google Play promote to production.

#### iOS:
- `open ./build/ios/archive/Runner.xcarchive`
- go to "distribute app" and "custom" (XCode 15)
- use manual signing and choose match appstore certificate
- Navigate the dialog and finally distribute the app. This will create a release on Testflight. It may take a while until the new build will be listed.
- Once apple has approved the Testflight release, the app can be “promoted”. 
- For that change the build and version number in app store connect and let the app be checked a second time. Finally the app can be released.


### Backend and Administration
- creating release branch triggers `backend` job with `deploy-production` and creates new bundles on the `entitlementcard.app` server.
- connect via ssh `ssh <username>@entitlementcard.app`
- switch to root user `sudo -i`
- run `sh /var/cache/salt/minion/files/base/entitlementcard/files/eak-update`
- check backend health log: `journalctl -u eak-backend.service --since "1h ago"`

#### Additional Commands
- check installed version of administration: `apt-cache policy eak-administration`
- check available versions: `ll -trh /srv/local-apt-repository`
- check current version of migration: `sudo -u backend psql entitlementcard` && `SELECT * from migrations;`

## Snapshots

The snapshots are created by executing a bunch of e2e tests locally. Check out `frontend/ios/ScreenshotTest` .

- ensure local backend is running.
- check for the required simulators in XCode (see `frontend/ios/fastlane/Snapfile`)
- set the build config for the particular project.
- switch to: `frontend/ios`
- run: `bundle exec fastlane ios <snapshot_lane>` where `snapshot_lane` is either `snap_bayern` or `snap_nuernberg`
