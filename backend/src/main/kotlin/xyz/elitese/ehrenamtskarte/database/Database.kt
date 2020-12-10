package xyz.elitese.ehrenamtskarte.database

import org.jetbrains.exposed.sql.Database.Companion.connect
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.nio.file.Files
import java.nio.file.Paths

class Database {

    companion object {
        private fun executeScript(path: String) {
            val java = Database::class.java
            val resource = java.classLoader.getResource(path) ?: throw Exception("Failed to find script")

            val uri = resource.toURI()
            val sql = String(Files.readAllBytes(Paths.get(uri)));
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
                executeScript("sql/create_accepting_stores_clustered.sql")
            }
        }
    }

    val db by lazy {
        val host = System.getProperty("app.postgres.host")
        val port = System.getProperty("app.postgres.port")
        val user = System.getProperty("app.postgres.user")
        val password = System.getProperty("app.postgres.password")
        val database = System.getProperty("app.postgres.database")

        connect("jdbc:pgsql://$host:$port/$database",
                driver = "com.impossibl.postgres.jdbc.PGDriver",
                user = user, password = password)
    }
}
