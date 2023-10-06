# Frontend

The Ehrenamtskarte app uses Flutter. You can have a look at [this guide](https://flutter.dev/docs/get-started/install) to install flutter and the tools needed to work with it. Alternatively, you can take a look at [README.md](../frontend/README.md) for a simpler guide which uses Flutter Version Manager.

This short guide focuses on setting up the project using IntelliJ instead of Android Studio:
1. Install [Dart SDK](https://dart.dev/get-dart)
   1.1. On Arch Linux you can just do: `pacman -S dart`
2. Install [Flutter](https://flutter.dev/docs/get-started/install/linux)
3. Install Android SDK via [IntelliJ](https://www.jetbrains.com/help/idea/create-your-first-android-application.html#754fd) or Android Studio
4. Open the root project in IntelliJ
   4.1. Install the Android extension in IntelliJ and set the SDK path in the settings of IntelliJ
   4.1. Install the Dart extension in IntelliJ and set the SDK path in the settings of IntelliJ
   4.2. Install the Flutter extension in IntelliJ and set the SDK path in the settings of IntelliJ
5. Run `flutter pub get` in `frontend/`
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
6. Install at least JDK 17 LTS
7. Open the IntelliJ "Project Structure" and setup the required SDK called "entitlementcard-jdk" and point it to your JDK installation.
   ![SDK/JDK setup](./img/intellij-sdk-setup.png)
8. Clone the submodule inside `backend/ehrenamtskarte-maplibre-style`
9. Run the backend migration: `run --args "migrate"`
10. Run the backend: `cd backend && ./gradlew run --args="execute"` or `.\backend\gradlew.bat run --args="execute"` on Windows
11. Create an admin account using `./gradlew run --args="create-admin <project> <role> <email> <password> <region>"`
12. Take a look at the martin endpoints: [http://localhost:5002/tiles/accepting_stores/index.json](http://localhost:5002/tiles/accepting_stores/index.json) and [http://localhost:5002/tiles/accepting_stores/rpc/index.json](http://localhost:5002/tiles/accepting_stores/rpc/index.json). The data shown on the map is fetched from a hardcoded url and is not using the data from the local martin!
13. Take a look at the style by viewing the test map: [http://localhost:5002](http://localhost:5002)
14. Take a look at the backend: [http://localhost:8000](http://localhost:8000) (The public version is available at
    api.entitlementcard.app)

# Administration

1. Run `npm install`
2. Create folder `generated` inside `administration/src`
3. Run `Start Administration` from Intellij run configurations

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

