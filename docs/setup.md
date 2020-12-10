# Frontend

The Ehrenamtskarte app uses Flutter. You can have a look at [this guide](https://flutter.dev/docs/get-started/install) to install flutter and the tools needed to work with it.

This short guide focuses on setting up the project using IntelliJ instead of Android Studio:
1. Install [Dart SDK](https://dart.dev/get-dart)
   1.1. On Arch Linux you can just do: `pacman -S dart`
2. Install [Flutter](https://flutter.dev/docs/get-started/install/linux)
   2.1. You need write access to the flutter installation directory:
        ```
        chgrp -R flutterusers /opt/flutter
        chmod g+w /opt/flutter
        sudo usermod -a -G flutterusers $USER
        ```
3. Install Android SDK via [IntelliJ](https://www.jetbrains.com/help/idea/create-your-first-android-application.html#754fd) or Android Studio
4. Open the root project in IntelliJ
   4.1. Install the Android extension in IntelliJ and set the SDK path in the settings of IntelliJ
   4.1. Install the Dart extension in IntelliJ and set the SDK path in the settings of IntelliJ
   4.2. Install the Flutter extension in IntelliJ and set the SDK path in the settings of IntelliJ
5. Run `flutter pub get` in `frontend/`
6. Execute the "Run Flutter" (upper right corner of IDE) configuration from within IntelliJ

# Backend

1. Install docker and docker-compose
2. `sudo docker-compose rm`
2. `sudo docker-compose build`
2. `sudo docker-compose up --force-recreate`
3. Open Adminer: [http://localhost:5001](http://127.0.0.1:5001/?pgsql=db-postgis&username=postgres&db=ehrenamtskarte)

   The credentials are:

   |Property|Value|
   |---|---|
   |Host (within Docker)|db|
   |Username|postgres|
   |Password|postgres|
   |Database|ehrenamtskarte|
4. Install JDK8
5. Run the backend: `./backend/gradlew run` or `.\backend\gradlew.bat run` on Windows
6. Take a look at the martin endpoints: http://localhost:5002/tiles/accepting_stores/index.json and http://localhost:5002/tiles/accepting_stores/rpc/index.json. The data shown on the map is fetched from a hardcoded url and is not using the data from the local martin!
7. Take a look at the style by viewing the test map: [http://localhost:5002](http://localhost:5002)

## Using ehrenamtskarte.app as database

```bash
ssh -L 5432:localhost:5432 -L 5001:localhost:5001 team@ehrenamtskarte.app
```

That way the Adminer and postgres will be available offline.

## (Old) Filling postgis with GeoJSON

Not really needed anymore because we have the data in the database.

```
ogr2ogr -f "PostgreSQL" PG:"dbname=ehrenamtskarte host='localhost' port='5432' user=postgres password=postgres" verguenstigungen.json
```


# Styling the Map

You can use maputnik to edit style the map:

1. Download Maputnik CLI from https://github.com/maputnik/editor/releases
2. Run `~/Downloads/maputnik --file docker/style/style.json`
3. Commit the style.json after editing!
