# Development Setup

## Contents

- [Prerequisites](#prerequisites)
- [Frontend](#frontend)
   - [Setup](#frontend-setup)
   - [Run](#run-frontend)
- [Backend](#backend)
  - [Setup](#backend-setup)
  - [Run](#run-backend)
  - [Optional Setup](#optional-backend-setup)
  - [Dumping and Restoring the Database](#dumping-and-restoring-the-database)
  - [Using ehrenamtskarte.app as Database](#using-ehrenamtskarteapp-as-database)
- [Administration](#administration)
   - [Setup](#administration-setup)
   - [Run](#run-administration)

## Prerequisites

1. Install the [protobuf compiler](https://github.com/protocolbuffers/protobuf) using a package manager of your choice
  or using a binary from the [github release page](https://github.com/protocolbuffers/protobuf/releases). 
  *The selected version has to match (or be older than) the version of protobuf-kotlin dependency used in [build.gradle.kts](../backend/build.gradle.kts).*
2. Install Java JDK 17.
   *If you use a later version, it has to be compatible with the [configured Gradle version](../frontend/android/gradle/wrapper/gradle-wrapper.properties).
   Check the [Gradle Compatibility Matrix](https://docs.gradle.org/current/userguide/compatibility.html#java) for details.*
3. Open the [root project](..) in IntelliJ.

## Frontend

### Frontend Setup

1. Install Android SDK via the [Android plugin](https://www.jetbrains.com/help/idea/create-your-first-android-application.html#754fd) or Android Studio
2. Install [fvm](https://fvm.app/documentation/getting-started/installation) (flutter version manager)
3. Install flutter dependencies
``` shell
cd frontend && fvm flutter pub get
```
4. Open IntelliJ settings and
   - Install the Android extension and set the Android SDK path
   - Install the Dart extension in IntelliJ and set the Dart SDK path
   - Install the Flutter extension in IntelliJ and set the Flutter SDK path
5. Install app-toolbelt
```shell
npm install --unsafe-perm -g https://github.com/digitalfabrik/app-toolbelt/archive/refs/heads/main.tar.gz
```

*Note: IntelliJ needs access to environment variables to run these commands successfully.*

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

1. Create directory `administration/src/generated`
```shell
mkdir administration/src/generated
```
2. Install node_modules
```shell
npm install
```

### Run Administration

Run `Start administration (env:local+buildConfig:all)` from Intellij run configurations


## Backend

### Backend Setup

1. Install docker and docker-compose
2. Setup docker-compose
```shell
docker-compose rm
docker-compose build
docker-compose up --force-recreate
```
3. Open the IntelliJ "Project Structure" and set up the required SDK called "entitlementcard-jdk" and point it to your JDK installation.
   ![SDK/JDK setup](./img/intellij-sdk-setup.png)
4. Run the backend migration (`Migrate DB`)
```shell
cd backend && ./gradlew run --args "migrate"
```
5. Create a backend account with one of the run configurations or the following command:
```shell
./gradlew run --args="create-admin <project> <role> <email> <password> <region>"`
```

### Run Backend

1. Start `docker-compose`
```shell
sudo docker-compose up --force-recreate
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
1. Create an access token at [localhost:5003/settings](http://localhost:5003/settings)
2. Add `localhost:5003` to `matomos trusted_hosts` at `/var/www/html/config/config.ini.php`
3. Add your matomo config for each project as described in [Local Backend Configuration](#local-backend-configuration)
```yaml
projects:
  - id: ...
    # ...
    matomo:
      siteId: 1
      url: http://localhost:5003/matomo.php
      accessToken: <matomo-access-token>
```

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

### Dumping and Restoring the Database

```shell
docker exec -ti <container_id> pg_dump -c -U postgres ehrenamtskarte > dump-$(date +%F).sql
```

To copy the dump to your local machine:

```shell
rsync root@ehrenamtskarte.app:dump-2020-12-23.sql .
```

To restore the dump
```shell
docker exec -i <container_id> psql ehrenamtskarte postgres < dump-$(date +%F).sql
```

### Using ehrenamtskarte.app as Database

```shell
ssh -L 5432:localhost:5432 -L 5001:localhost:5001 team@ehrenamtskarte.app
```

That way the Adminer and postgres will be available locally.
