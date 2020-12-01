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
7. Place the `secrets.json` in `./frontend/secrets.json` (see below)
6. Execute the "Run Flutter" (upper right corner of IDE) configuration from within IntelliJ

### Add a file with secrets

You have to add a file named `secrets.json` next to `pubspec.yaml` with content like this:
```json
{
  "mapbox_key": "<YOUR PUBLIC MAPBOX API KEY>"
}
```
Be careful not to add this file to the repository. For our CI pipeline, we have an encrypted environment variable that will be put into a `secrets.json` file when the pipeline runs.

# Backend

1. Install docker
2. `sudo docker-compose up`
3. Open Adminer: [http://localhost:5433](http://localhost:5433/?pgsql=db&username=postgres&db=ehrenamtskarte)

   The credentials are:

   |Property|Value|
   |---|---|
   |Host (within Docker)|db|
   |Username|postgres|
   |Password|postgres|
   |Database|ehrenamtskarte|
4. Install JDK8
5. Run the backend: `./backend/gradlew run`
