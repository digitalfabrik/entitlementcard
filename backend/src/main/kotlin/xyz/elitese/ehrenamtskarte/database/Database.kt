package xyz.elitese.ehrenamtskarte.database

import org.jetbrains.exposed.sql.Database.Companion.connect
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.stream.Collectors

import java.io.BufferedReader
import java.io.InputStreamReader
import java.sql.DriverManager


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

                SchemaUtils.create(
                        Categories,
                        Contacts,
                        AcceptingStores,
                        PhysicalStores,
                        Addresses
                )

                executeScript("sql/create_tilebbox.sql")
                executeScript("sql/create_physical_stores_clustered.sql")
                executeScript("sql/create_physical_stores.sql")
            }
        }
    }

    val db by lazy {
        val connectionUrl = "jdbc:postgresql://" +
                "${System.getProperty("app.postgres.host")}:${System.getProperty("app.postgres.port")}" +
                "/${System.getProperty("app.postgres.database")}?user=${System.getProperty("app.postgres.user")}&" +
                "password=${System.getProperty("app.postgres.password")}&reWriteBatchedInserts=true"
        connect({ DriverManager.getConnection(connectionUrl) })
    }
}
