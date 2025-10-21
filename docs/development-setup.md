# Development Setup

## Contents

- [Development Setup](#development-setup)
  - [Contents](#contents)
  - [Prerequisites](#prerequisites)
  - [Frontend](#frontend)
    - [Frontend Setup](#frontend-setup)
    - [Run Frontend](#run-frontend)
  - [Administration](#administration)
    - [Administration Setup](#administration-setup)
    - [Run Administration](#run-administration)
    - [Run e2e-tests for Administration](#run-e2e-tests-for-administration)
  - [Backend](#backend)
    - [Recommended IDE set up](#recommended-ide-set-up)
    - [Common development tasks](#common-development-tasks)
    - [Backend Setup](#backend-setup)
    - [Run Backend](#run-backend)
    - [Optional Backend Setup](#optional-backend-setup)
      - [Local Backend Configuration](#local-backend-configuration)
      - [Map Styles](#map-styles)
      - [Matomo](#matomo)
      - [Inspecting Services](#inspecting-services)
    - [DB tasks](#db-tasks)
    - [Using ehrenamtskarte.app as Database](#using-ehrenamtskarteapp-as-database)

## Prerequisites

- Install Java JDK 17.
   *If you use a later version, it has to be compatible with the [configured Gradle version](../frontend/android/gradle/wrapper/gradle-wrapper.properties).
   Check the [Gradle Compatibility Matrix](https://docs.gradle.org/current/userguide/compatibility.html#java) for details.*
- Open the [root project](..) in IntelliJ.

## Frontend

### Frontend Setup

1. Install [fvm](https://fvm.app/documentation/getting-started/installation) (flutter version manager)
2. Install flutter dependencies
```shell
cd frontend && fvm flutter pub get
```

3. Open IntelliJ settings and
   - Install the Android plugin and set the Android SDK path
   - Install the Dart plugin and set the Dart SDK path
   - Install the Flutter plugin and set the Flutter SDK path

*Note: IntelliJ needs access to environment variables to run these commands successfully.*

#### Android

1. Install Android SDK via Android Studio

#### iOS

1. Install XCode
2. Install ruby bundler
3. Install gems
``` shell
cd frontend/ios && bundle install
```
4. Install cocoapods
``` shell
cd frontend/ios && bundle exec pod install --repo-update
```
5. [Optional] Install cocoapods globally (only necessary if using IntelliJ run configurations to run on iOS)
``` shell
brew install cocoapods
```

### Run Frontend

1. Forward ports. As there are several services running and interacting some ports need to be forwarded.
This includes the backend port 8000 and the map tiles port at 5002.
The command has to be run every time a device is connected.

```shell
adb reverse tcp:8081 tcp:8081 && adb reverse tcp:8000 tcp:8000 && adb reverse tcp:5002 tcp:5002
```

2. Run the app 
   - Bayern: `Run (env:local+buildConfig:bayern)`
   - Nuernberg: `Run (env:local+buildConfig:nuernberg)`
   - Koblenz: `Run (env:local+buildConfig:koblenz)`

## Administration

### Administration Setup

1. Install node_modules

```shell
npm install
```

### Run Administration

Run `Start administration (env:local+buildConfig:all)` from Intellij run configurations

### Run e2e-tests for Administration

1. Run [backend](#run-backend) and start the [administration](#run-administration).
2. install supported browsers for [Playwright](https://playwright.dev/docs/browsers#install-browsers): `npx playwright install`
3. Run Playwright tests:
   - All tests: `/administration`: `npm run test:e2e`
   - You can run individual tests by `npm run test:e2e [file name]`

## Backend

### Prerequisites

You can either use the open-source docker replacement podman/podman-compose or classic docker/docker compose.

#### Podman

1. Install podman and podman-compose
2. Setup podman-compose
```shell
podman machine init
podman machine start && podman-compose up
```

#### Docker

1. Install docker
2. Setup docker compose
```shell
docker compose rm
docker compose build
docker compose up --force-recreate
```

### Recommended IDE set up

For IntelliJ, the following plugins are recommended:

- [detekt](https://plugins.jetbrains.com/plugin/10761-detekt)
- [Ktlint](https://plugins.jetbrains.com/plugin/15057-ktlint)

### Backend Setup

1. Open the IntelliJ "Project Structure" and set up the required SDK called "entitlementcard-jdk" and point it to your JDK installation.
   ![SDK/JDK setup](./img/intellij-sdk-setup.png)
2. Run the backend migration (`Migrate DB`)
```shell
cd backend && ./gradlew run --args "migrate"
```
3. Create a backend account with one of the run configurations or the following command:
```shell
./gradlew run --args="create-admin <project> <role> <email> <password> <region>"`
```

### Run Backend

1. Start `podman-compose`
```shell
podman machine start && podman-compose up
```
or `docker compose`
```shell
sudo docker compose up --force-recreate
```
2. Run the backend (`Run backend (env:local+buildConfig:all)`)
```shell
./gradlew run --args="execute"
```

### Optional Backend Setup

The following setup is only necessary if you work with the corresponding services.

#### Local Backend Configuration

The backend configuration file [config.yml](../backend/src/main/resources/config/config.yml) is checked in git and should therefore not be modified for development purposes.
Instead, you can create your own local copy:

1. Copy [config.yml](../backend/src/main/resources/config/config.yml) to `~/.config/entitlementcard/config.yml`

```shell
mkdir ~/.config/entitlementcard
cp backend/src/main/resources/config/config.yml ~/.config/entitlementcard
```

2. Adjust config

#### Map Styles

1. Clone the submodule inside `backend/ehrenamtskarte-maplibre-style`
2. Initialize all submodules by running `git submodule update --init --recursive` in the root directory 

#### Matomo

0. Use the docker desktop client
1. Set up the matomo instance [http://localhost:5003](http://localhost:5003).
 The public version is available at https://matomo-entitlementcard.tuerantuer.org
2. Create an access token (login before) at [http://localhost:5003/index.php?module=UsersManager&action=userSecurity](http://localhost:5003/index.php?module=UsersManager&action=userSecurity)
3. Add `localhost:5003` to `matomos trusted_hosts` at `/var/www/html/config/config.ini.php`
4. Add your matomo config for each project as described in [Local Backend Configuration](#local-backend-configuration)
```yaml
projects:
  - id: ...
    # ...
    matomo:
      siteId: 1
      url: http://localhost:5003/matomo.php
      accessToken: <matomo-access-token>
```
Troubleshooting: If your matomo instance is corrupt, you can just delete `config/config.ini.php` in folder (var/www/html)

#### Inspecting Services

- Adminer: [http://localhost:5001](http://127.0.0.1:5001/?pgsql=db-postgis&username=postgres&db=ehrenamtskarte)
   The credentials are:
   |Property|Value|
   |---|---|
   |Host (within Docker)|db-postgis|
   |Username|postgres|
   |Password|postgres|
   |Database|ehrenamtskarte|
- Martin endpoints: [http://localhost:5002/tiles/accepting_stores/index.json](http://localhost:5002/tiles/accepting_stores/index.json) and [http://localhost:5002/tiles/accepting_stores/rpc/index.json](http://localhost:5002/tiles/accepting_stores/rpc/index.json). *The data shown on the map is fetched from a hardcoded url and is not using the data from the local martin!*
- Map styles: [http://localhost:5002/map.html](http://localhost:5002)

### Common development tasks

- Run Ktlint diagnostic: `./gradlew ktlintCheck`
- Run Ktlint formatter: `./gradlew ktlintFormat`
- Run Detekt diagnostic: `./gradlew detekt`

### DB tasks

- Clear the DB's contents: `./gradlew db-clear`
- Run all migrations: `./gradlew db-migrate`
- Import data from online stores: `./gradlew db-import`
- Load developer sample data: `./gradlew db-import-dev`
- Create a clean DB with sample data (all of the above steps): `./gradlew db-recreate`
- Dump the DB
    ```shell
    docker exec -ti entitlementcard-db-postgis-1 pg_dump -c -U postgres ehrenamtskarte > dump-$(date +%F).sql
    ```
- Copy the dump to your local machine:
    ```shell
    rsync root@ehrenamtskarte.app:dump-2020-12-23.sql .
    ```
- Restore the dump
    ```shell
    docker exec -i entitlementcard-db-postgis-1 psql ehrenamtskarte postgres < dump-$(date +%F).sql
    ```

### Using ehrenamtskarte.app as Database

```shell
ssh -L 5432:localhost:5432 -L 5001:localhost:5001 team@ehrenamtskarte.app
```

That way the Adminer and postgres will be available locally.
