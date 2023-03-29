package app.ehrenamtskarte.backend.migration

import app.ehrenamtskarte.backend.migration.database.MigrationEntity
import app.ehrenamtskarte.backend.migration.database.Migrations
import app.ehrenamtskarte.backend.migration.migrations.V1_RemoveEmailIndex
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.exceptions.ExposedSQLException
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils.create
import org.jetbrains.exposed.sql.exists
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory
import java.time.Clock
import java.time.Instant.now

private val logger = LoggerFactory.getLogger(Migrations::class.java)

fun runAllMigrations(database: Database, clock: Clock) {
    runMigrations(database, listOf(V1_RemoveEmailIndex()), clock)
}

fun runMigrations(database: Database, migrations: List<Migration>, clock: Clock) {
    checkVersions(migrations)

    logger.info("Running migrations on database ${database.url}")

    val latestVersion =
        transaction(database) {
            createTableIfNotExists()
            MigrationEntity.all().maxBy { it.version }.version.value
        }

    logger.info("Database version before migrations: $latestVersion")
    try {
        migrations.sortedBy { it.version }.filter { shouldRun(latestVersion, it) }.forEach {
            logger.info("Running migration version ${it.version}: ${it.name}")

            transaction(database) {
                it.run()

                MigrationEntity.new {
                    version = EntityID(it.version, Migrations)
                    name = it.name
                    executedAt = now(clock)
                }
            }
        }
    } catch (exception: MigrationException) {
        logger.error(exception.toString())
        return
    } catch (exception: ExposedSQLException) {
        logger.error(exception.toString())
        return
    }
    logger.info("Migrations finished successfully")
}

private fun createTableIfNotExists() {
    transaction {
        if (!Migrations.exists()) {
            create(Migrations)
        }

        val numMigrations = MigrationEntity.all().count()

        if (numMigrations == 0L) {
            MigrationEntity.new(0) {
                this.name = "Initialize"
                this.executedAt = now()
            }
        }
    }
}

private fun checkVersions(migrations: List<Migration>) {
    val sorted = migrations.map { it.version }.sorted()
    if ((1..migrations.size).toList() != sorted) {
        throw IllegalStateException("List of migrations version is not consecutive: $sorted")
    }
}

private fun shouldRun(latestVersion: Int?, migration: Migration): Boolean {
    val run = latestVersion?.let { migration.version > it } ?: true
    if (!run) {
        logger.debug("Skipping migration version ${migration.version}: ${migration.name}")
    }
    return run
}
