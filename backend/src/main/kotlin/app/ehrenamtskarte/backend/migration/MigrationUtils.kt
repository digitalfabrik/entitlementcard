package app.ehrenamtskarte.backend.migration

import app.ehrenamtskarte.backend.migration.database.MigrationEntity
import app.ehrenamtskarte.backend.migration.database.Migrations
import app.ehrenamtskarte.backend.migration.migrations.MigrationsRegistry
import app.ehrenamtskarte.backend.migration.migrations.V0001_Baseline
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.exceptions.ExposedSQLException
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.exists
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.vendors.currentDialect
import org.slf4j.LoggerFactory
import java.time.Instant.now

object MigrationUtils {
    private val logger = LoggerFactory.getLogger(MigrationUtils::class.java)

    class MigrationException(message: String, cause: Exception? = null) : Exception(message, cause)

    /**
     * @throws MigrationException
     */
    fun applyRequiredMigrations(database: Database, skipBaseline: Boolean = false) {
        val migrations = MigrationsRegistry.getAllMigrations()

        if (migrations.map { it.version } != (1..migrations.size).toList()) {
            throw MigrationException(
                "List of versions is not consecutive: ${migrations.map { it.version }}",
            )
        }

        logger.info("Running migrations on database ${database.url}")
        try {
            // Apply all migrations in a single transaction, to make sure nothing changes if any migration step fails.
            transaction {
                val versionBeforeMigration = transaction { Migrations.getCurrentVersionOrNull() }

                logger.info(
                    "Database version before migrations: ${versionBeforeMigration ?: "(none)"}",
                )
                logger.info(
                    "Latest migration version:           ${migrations.maxOfOrNull { it.version } ?: "(none)"}",
                )

                if (!Migrations.exists()) {
                    logger.info("Migrations table did not exist. Creating it.")
                    transaction { SchemaUtils.create(Migrations) }
                    currentDialect.resetCaches()
                } else {
                    // If changes to the Migrations table ever need to made, they need to be handled here (before any
                    // migrations are applied).
                    // Changes to the Migrations table should not be done through migrations (see discussion on
                    // https://github.com/digitalfabrik/entitlementcard/pull/906)
                }

                for (migration in migrations) {
                    if (versionBeforeMigration != null && migration.version <= versionBeforeMigration) {
                        logger.debug("Skipping ${migration.javaClass.simpleName}")
                        continue
                    }
                    if (migration is V0001_Baseline && skipBaseline) {
                        logger.info("Skipping ${migration.javaClass.simpleName} as requested.")
                    } else {
                        logger.info("Applying ${migration.javaClass.simpleName}")
                        transaction(statement = migration.migrate)
                        // If we create or drop tables in a migration, we need to reset Exposed's caches.
                        currentDialect.resetCaches()
                    }
                    transaction {
                        MigrationEntity.new {
                            version = EntityID(migration.version, Migrations)
                            name = migration.name
                            executedAt = now()
                        }
                    }
                }

                assertDatabaseIsInSync()
            }
        } catch (exception: DatabaseOutOfSyncException) {
            throw MigrationException(
                "Database was still out sync after attempted migration. Hence, NO CHANGES were committed onto the DB.",
                exception,
            )
        } catch (exception: ExposedSQLException) {
            throw MigrationException(
                "The above SQL error occuring during attempted migration. " +
                    "Hence, NO CHANGES were committed onto the DB.",
                exception,
            )
        }
        logger.info("Migrations finished successfully")
    }
}
