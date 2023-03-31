package app.ehrenamtskarte.backend.migration

import app.ehrenamtskarte.backend.migration.database.MigrationEntity
import app.ehrenamtskarte.backend.migration.database.Migrations
import app.ehrenamtskarte.backend.migration.migrations.MigrationsRegistry
import app.ehrenamtskarte.backend.migration.migrations.V2_Baseline
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.exceptions.ExposedSQLException
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.vendors.currentDialect
import org.slf4j.LoggerFactory
import java.time.Clock
import java.time.Instant.now

private val logger = LoggerFactory.getLogger(Migrations::class.java)

object MigrationUtils {
    class MigrationException(message: String, cause: Exception? = null) : Exception(message, cause)

    /**
     * @throws MigrationException
     */
    fun applyRequiredMigrations(database: Database, clock: Clock, skipBaseline: Boolean = false) {
        val migrations = MigrationsRegistry.getAllMigrations()

        if (migrations.map { it.version } != (1..migrations.size).toList()) {
            throw MigrationException("List of versions is not consecutive: ${migrations.map { it.version }}")
        }

        logger.info("Running migrations on database ${database.url}")

        val versionBeforeMigration = transaction { Migrations.getCurrentVersionOrNull() }

        logger.info("Database version before migrations: $versionBeforeMigration / ${migrations.size}")
        try {
            transaction {
                for (migration in migrations) {
                    if (versionBeforeMigration != null && migration.version <= versionBeforeMigration) {
                        logger.debug("Skipping ${migration.javaClass.simpleName}")
                        continue
                    }

                    if (migration is V2_Baseline && skipBaseline) {
                        logger.info("Skipping ${migration.javaClass.simpleName} as requested.")
                    } else {
                        logger.info("Applying ${migration.javaClass.simpleName}")
                        // If we create or drop tables in a migration, we need to reset Exposed's caches.
                        transaction(statement = migration.migrate)
                        currentDialect.resetCaches()
                    }

                    MigrationEntity.new {
                        version = EntityID(migration.version, Migrations)
                        name = migration.name
                        executedAt = now(clock)
                    }
                }

                assertDatabaseIsInSync(database)
            }
        } catch (exception: DatabaseOutOfSyncException) {
            throw MigrationException(
                "Database was still out sync after attempted migration. Hence, NO CHANGES were committed onto the DB.",
                exception,
            )
        } catch (exception: ExposedSQLException) {
            throw MigrationException(
                "The above SQL error occuring during attempted migration. Hence, NO CHANGES were committed onto the DB.",
                exception,
            )
        }
        logger.info("Migrations finished successfully")
    }
}
