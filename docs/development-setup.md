# Prerequisite

1. Make sure you have installed [Protobuf Compiler](https://github.com/protocolbuffers/protobuf):
   - The simplest way to install it is to download a pre-built binary from [GitHub release page](https://github.com/protocolbuffers/protobuf/releases). 
   In the downloads section of each release, you can find pre-built binaries in zip packages: `protoc-$VERSION-$PLATFORM.zip`.
   ❕ The selected version should match (or may be older than) the version of protobuf-kotlin dependency used in [build.gradle.kts](../backend/build.gradle.kts). 
2. Make sure you have JDK installed (at least JDK 17 LTS). 
If you go for a later version, it should be compatible with the [configured Gradle version](../frontend/android/gradle/wrapper/gradle-wrapper.properties).
Check [Gradle Compatibility Matrix](https://docs.gradle.org/current/userguide/compatibility.html#java) for details.

# Frontend

This short guide focuses on setting up the project using IntelliJ instead of Android Studio:
1. Install Flutter
   - You can take a look at [README.md](../frontend/README.md) for a simpler guide which uses Flutter Version Manager (**recommended**)
   - Or use [this guide](https://flutter.dev/docs/get-started/install) to install Flutter and the tools needed to work with it. If you go for this option, make sure to use the version configured in the environment section of [pubspec.yaml](../frontend/pubspec.yaml)
2. Dart SDK should be installed automatically from the Flutter Engine in the previous step (just check it with `dart --version`). Otherwise, it can be installed using [this guide](https://dart.dev/get-dart).
   - On Arch Linux you can just do: `pacman -S dart`
3. Install Android SDK via [IntelliJ](https://www.jetbrains.com/help/idea/create-your-first-android-application.html#754fd) or Android Studio
4. Open the root project in IntelliJ
   - Install the Android extension in IntelliJ and set the SDK path in the settings of IntelliJ
   - Install the Dart extension in IntelliJ and set the SDK path in the settings of IntelliJ
   - Install the Flutter extension in IntelliJ and set the SDK path in the settings of IntelliJ
5. Run `fvm flutter pub get` in `frontend/` (if you use Flutter Version Manager) or `flutter pub get` (otherwise)
6. Execute the "Run (env:local+buildConfig:bayern)" run configuration from within IntelliJ
7. Install app-toolbelt: `npm install --unsafe-perm -g https://github.com/digitalfabrik/app-toolbelt/archive/refs/heads/main.tar.gz`
8. Set build config: `fvm flutter pub run build_runner build --define "df_build_config=name=bayern"`

Note: If `8.` fails with message `app-toolbelt: command not found`, you might have to set the build config differently first,
e.g. to `nuernberg` and only then set the desired build config.

Note: Your Intellij needs access to environment variables to run these commands successfully.

As there are several services running and interacting some ports need to be forwarded.
This includes the backend port 8000 and the map tiles port at 5002.
For this run:
```
adb reverse tcp:5002 tcp:5002
adb reverse tcp:8000 tcp:8000
```

# Backend

1. Install docker and docker-compose
2. `sudo docker-compose rm`
3. `sudo docker-compose build`
4. `sudo docker-compose up --force-recreate`
5. Open Adminer: [http://localhost:5001](http://127.0.0.1:5001/?pgsql=db-postgis&username=postgres&db=ehrenamtskarte)
   The credentials are:
   |Property|Value|
   |---|---|
   |Host (within Docker)|db-postgis|
   |Username|postgres|
   |Password|postgres|
   |Database|ehrenamtskarte|
6. Open the IntelliJ "Project Structure" and set up the required SDK called "entitlementcard-jdk" and point it to your JDK installation.
   ![SDK/JDK setup](./img/intellij-sdk-setup.png)
7. Clone the submodule inside `backend/ehrenamtskarte-maplibre-style`
8. Initialize all submodules by running `git submodule update --init --recursive` in the root directory 
9. Run the backend migration: `run --args "migrate"`
10. Run the backend: `cd backend && ./gradlew run --args="execute"` or `.\backend\gradlew.bat run --args="execute"` on Windows 
11. Create an admin account using `./gradlew run --args="create-admin <project> <role> <email> <password> <region>"`
12. Take a look at the martin endpoints: [http://localhost:5002/tiles/accepting_stores/index.json](http://localhost:5002/tiles/accepting_stores/index.json) and [http://localhost:5002/tiles/accepting_stores/rpc/index.json](http://localhost:5002/tiles/accepting_stores/rpc/index.json). The data shown on the map is fetched from a hardcoded url and is not using the data from the local martin!
13. Take a look at the style by viewing the test map: [http://localhost:5002/map.html](http://localhost:5002)
14. Set up the matomo instance [http://localhost:5003](http://localhost:5003) (The public version is available at https://matomo-entitlementcard.tuerantuer.org)
15. (optional) Add your matomo config for each project to the backend config
```yaml
projects:
  - id: ...
    # ...
    matomo:
      siteId: 1
      url: http://localhost:5003/matomo.php
      accessToken: <matomo-access-token>
```
You can find and generate an access token, when you visit `localhost:5003/settings` and search for token there.
You might also need to update the matomo `/var/www/html/config/config.ini.php` (you'll only have to do this once) to add localhost:5003 to matomos trusted_hosts.
To do that it is recommended to use the docker desktop client.

# Administration

1. Run `npm install`
2. Run `Start Administration` from Intellij run configurations

## Dumping and restoring the database through docker

```bash
docker exec -ti <container_id> pg_dump -c -U postgres ehrenamtskarte > dump-$(date +%F).sql
```

To copy the dump to your local machine:

```bash
rsync root@ehrenamtskarte.app:dump-2020-12-23.sql .
```

To restore the dump
```bash
docker exec -i <container_id> psql ehrenamtskarte postgres < dump-$(date +%F).sql
```


## Using ehrenamtskarte.app as database

```bash
ssh -L 5432:localhost:5432 -L 5001:localhost:5001 team@ehrenamtskarte.app
```

That way the Adminer and postgres will be available locally.

