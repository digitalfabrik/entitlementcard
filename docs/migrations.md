# Migrations

Our database relies on the [jetbrains exposed](https://github.com/JetBrains/Exposed) framework. As the framework did not already provide a proper migration routine/setup, we decided to implement migrations ourselves. The implementation can be found in the [migration package in the backend directory](../backend/src/main/kotlin/app/ehrenamtskarte/backend/migration). The migration scripts themselves reside in a [subfolder](../backend/src/main/kotlin/app/ehrenamtskarte/backend/migration/migrations/) of this package.
In the CI the migration script is run automatically in the postinstall process of the debian package installation (apt upgrade).

## How to use it locally?

Simply run `./gradlew run --args="migrate"` to apply all migrations. Migrations that are already present in the `migrations` table are not executed.
When starting the backend server the state of the database is checked. If the exposed definitions are out of sync with the actual database the, backend server is not started.

If you switched branch and due to that the database is out of sync you'll need to restore a synchronized database. How to deal with that is explained in the following example.

## How to use it on server?

Simply run `sudo -u backend /opt/ehrenamtskarte/backend/bin/backend migrate`.
Then restart backend service: `systemctl restart eak-backend.service`

### Example

On branch b1 migration m1_increase_email_length has been applied to the db. 
That means the `migrations` table includes an entry for migration m1 and a constraint has been added to the administration table.

Now you switch to branch b2, which does not now about migration m1.
There are two ways to fix this:
- a: manually delete the entry for m1 from the `migrations` table and also delete the constraint from the administration table
- b: delete and recreate the database (this obviously also clears all the db entries)
  1. `sudo docker compose rm`
  2. `sudo docker compose build`
  3. `sudo docker compose up --force-recreate`
