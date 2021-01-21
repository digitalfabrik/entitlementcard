package xyz.elitese.ehrenamtskarte.common.database

import org.jetbrains.exposed.sql.Database.Companion.connect
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.BufferedReader
import java.io.InputStreamReader
import java.util.stream.Collectors
import xyz.elitese.ehrenamtskarte.stores.database.setupDatabase as setupDatabaseForStores
import xyz.elitese.ehrenamtskarte.verification.database.setupDatabase as setupDatabaseForVerification


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
                setupDatabaseForStores(Companion::executeScript)
                setupDatabaseForVerification()
            }
        }
    }

    val db by lazy {
        connect("jdbc:postgresql://" +
                "${System.getProperty("app.postgres.host")}:${System.getProperty("app.postgres.port")}" +
                "/${System.getProperty("app.postgres.database")}", driver = "org.postgresql.Driver",
                user = System.getProperty("app.postgres.user"), password = System.getProperty("app.postgres.password"))
    }
}
