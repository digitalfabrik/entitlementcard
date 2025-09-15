package app.ehrenamtskarte.backend.db

import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.config.Environment
import app.ehrenamtskarte.backend.db.migration.assertDatabaseIsInSync
import app.ehrenamtskarte.backend.db.repositories.AdministratorsRepository
import app.ehrenamtskarte.backend.db.repositories.RegionsRepository
import app.ehrenamtskarte.backend.db.setup.createOrReplaceStoreFunctions
import app.ehrenamtskarte.backend.db.setup.insertOrUpdateCategories
import app.ehrenamtskarte.backend.db.setup.insertOrUpdateProjects
import app.ehrenamtskarte.backend.db.setup.insertOrUpdateRegions
import app.ehrenamtskarte.backend.graphql.auth.types.Role
import app.ehrenamtskarte.backend.graphql.freinet.util.FreinetAgenciesLoader
import org.jetbrains.exposed.sql.Database.Companion.connect
import org.jetbrains.exposed.sql.DatabaseConfig
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader

object Database {
    fun executeSqlResource(path: String) {
        val resource = Database::class.java.classLoader.getResource(path)
            ?: throw Exception("Failed to find script")

        with(TransactionManager.current()) {
            exec(resource.openStream().use { BufferedReader(InputStreamReader(it)).readText() })
        }
    }

    fun executeSqlFile(file: File) {
        transaction {
            exec(file.bufferedReader().use { it.readText() })
        }
    }

    fun createAccount(project: String, email: String, password: String, roleDbValue: String) {
        val role = Role.fromDbValue(roleDbValue)
        transaction {
            val testRegionId = if (role in setOf(
                    Role.REGION_MANAGER,
                    Role.REGION_ADMIN,
                )
            ) {
                RegionsRepository.findAllInProject(project).first().id.value
            } else {
                null
            }
            AdministratorsRepository.insert(project, email, password, role, testRegionId)
        }
    }

    fun setupWithInitialDataAndMigrationChecks(config: BackendConfiguration): org.jetbrains.exposed.sql.Database =
        setupWithoutMigrationCheck(config).apply {
            val agencies = FreinetAgenciesLoader().loadAgenciesFromXml(config.projects)
            transaction {
                assertDatabaseIsInSync()
                insertOrUpdateProjects(config)
                insertOrUpdateRegions(agencies, config)
                insertOrUpdateCategories()
                createOrReplaceStoreFunctions()
            }
        }

    fun setupWithoutMigrationCheck(
        config: BackendConfiguration,
        log: Boolean = true,
    ): org.jetbrains.exposed.sql.Database =
        connect(
            config.postgres.url,
            driver = "org.postgresql.Driver",
            user = config.postgres.user,
            password = config.postgres.password,
            setupConnection = {
                // Set session time zone to UTC, to make timestamps work properly in every configuration.
                // Note(michael-markl): I believe this is postgres specific syntax.
                it.prepareStatement("SET TIME ZONE 'UTC';").executeUpdate()
            },
            databaseConfig = DatabaseConfig.invoke {
                // Nested transactions are helpful for applying migrations in subtransactions.
                useNestedTransactions = true

                if (config.environment != Environment.PRODUCTION && log) {
                    this.sqlLogger = StdOutSqlLogger
                }
            },
        )
}
