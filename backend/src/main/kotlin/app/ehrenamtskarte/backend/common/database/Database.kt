package app.ehrenamtskarte.backend.common.database

import app.ehrenamtskarte.backend.auth.database.repos.AdministratorsRepository
import app.ehrenamtskarte.backend.auth.webservice.schema.types.Role
import app.ehrenamtskarte.backend.config.BackendConfiguration
import app.ehrenamtskarte.backend.stores.database.*
import org.jetbrains.exposed.sql.Database.Companion.connect
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.BufferedReader
import java.io.InputStreamReader
import java.lang.IllegalArgumentException
import java.util.stream.Collectors
import app.ehrenamtskarte.backend.projects.database.setupDatabase as setupDatabaseForProjects
import app.ehrenamtskarte.backend.auth.database.setupDatabase as setupDatabaseForAuth
import app.ehrenamtskarte.backend.regions.database.setupDatabase as setupDatabaseForRegions
import app.ehrenamtskarte.backend.stores.database.setupDatabase as setupDatabaseForStores
import app.ehrenamtskarte.backend.verification.database.setupDatabase as setupDatabaseForVerification
import app.ehrenamtskarte.backend.application.database.setupDatabase as setupDatabaseForApplication


class Database {

    companion object {
        private fun executeScript(path: String) {
            val java = Database::class.java
            val resource = java.classLoader.getResource(path) ?: throw Exception("Failed to find script")
            val stream = resource.openStream()
            val sql = BufferedReader(InputStreamReader(stream))
                .lines().collect(Collectors.joining("\n"))
            stream.close()
            with(TransactionManager.current()) {
                exec(sql)
            }
        }

        fun createAccount(project: String, email: String, password: String, roleDbValue: String) {
            val role = Role.fromDbValue(roleDbValue) ?: throw IllegalArgumentException("Invalid role '${roleDbValue}'.")
            transaction {
                AdministratorsRepository.insert(project, email, password, role)
            }
        }

        fun setup(config: BackendConfiguration) {
            connect(
                config.postgres.url, driver = "org.postgresql.Driver",
                user = config.postgres.user, password = config.postgres.password
            )

            transaction {
                if (!config.production) {
                    addLogger(StdOutSqlLogger)
                }

                setupDatabaseForProjects(config)
                setupDatabaseForRegions()
                setupDatabaseForStores(Companion::executeScript)
                setupDatabaseForVerification()
                setupDatabaseForApplication()
                setupDatabaseForAuth()
            }
        }
    }
}
