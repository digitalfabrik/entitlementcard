package app.ehrenamtskarte.backend.common.database

import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.freinet.util.FreinetAgenciesLoader
import app.ehrenamtskarte.backend.migration.assertDatabaseIsInSync
import app.ehrenamtskarte.backend.projects.database.insertOrUpdateProjects
import app.ehrenamtskarte.backend.regions.database.insertOrUpdateRegions
import app.ehrenamtskarte.backend.regions.database.repos.RegionsRepository
import app.ehrenamtskarte.backend.stores.database.createOrReplaceStoreFunctions
import app.ehrenamtskarte.backend.stores.database.insertOrUpdateCategories
import org.jetbrains.exposed.sql.Database.Companion.connect
import org.jetbrains.exposed.sql.DatabaseConfig
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.BufferedReader
import java.io.InputStreamReader

class Database {
    companion object {
        fun executeSqlResource(path: String) {
            val resource = Database::class.java.classLoader.getResource(path)
                ?: throw Exception("Failed to find script")

            with(TransactionManager.current()) {
                exec(resource.openStream().use { BufferedReader(InputStreamReader(it)).readText() })
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

        fun setupWithoutMigrationCheck(config: BackendConfiguration): org.jetbrains.exposed.sql.Database =
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
                    if (config.isDevelopment()) {
                        this.sqlLogger = StdOutSqlLogger
                    }
                },
            )
    }
}
