package app.ehrenamtskarte.backend.common.database

import org.jetbrains.exposed.sql.Database.Companion.connect
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.BufferedReader
import java.io.InputStreamReader
import java.util.stream.Collectors
import app.ehrenamtskarte.backend.stores.database.setupDatabase as setupDatabaseForStores
import app.ehrenamtskarte.backend.regions.database.setupDatabase as setupDatabaseForRegions
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

        fun setup() {
            Database().db

            transaction {
                // print sql to std-out
                addLogger(StdOutSqlLogger)
                setupDatabaseForRegions(Companion::executeScript)
                setupDatabaseForStores(Companion::executeScript)
                setupDatabaseForVerification()
                setupDatabaseForApplication()
            }
        }
    }

    val db by lazy {
        connect(
            System.getProperty("app.postgres.url"), driver = "org.postgresql.Driver",
            user = System.getProperty("app.postgres.user"), password = System.getProperty("app.postgres.password")
        )
    }
}
